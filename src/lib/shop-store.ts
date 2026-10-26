import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Part, Stock } from "@/lib/catalog";
import { ZERO_MARKUP, type Markup } from "@/lib/money";

export type FeedProfile = {
  id: string;
  name: string;
  supplier: string;
  url: string;
  warehouse: Stock;
  markup: Markup;
  schedule: "manual" | "daily";
  updatedAt: string;
  lastCount: number;
};

export type CartLine = { id: string; qty: number };

type ShopState = {
  markup: Markup;
  cart: CartLine[];
  imports: Part[];
  profiles: FeedProfile[];
  setMarkup: (markup: Markup) => void;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  saveImport: (profile: FeedProfile, parts: Part[]) => void;
  removeProfile: (id: string) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      markup: ZERO_MARKUP,
      cart: [],
      imports: [],
      profiles: [],
      setMarkup: (markup) => set({ markup }),
      addToCart: (id, qty = 1) =>
        set((state) => {
          const found = state.cart.find((line) => line.id === id);
          if (found) {
            return { cart: state.cart.map((line) => (line.id === id ? { ...line, qty: Math.min(99, line.qty + qty) } : line)) };
          }
          return { cart: [...state.cart, { id, qty }] };
        }),
      setQty: (id, qty) =>
        set((state) => ({
          cart: qty <= 0 ? state.cart.filter((line) => line.id !== id) : state.cart.map((line) => (line.id === id ? { ...line, qty } : line)),
        })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((line) => line.id !== id) })),
      clearCart: () => set({ cart: [] }),
      saveImport: (profile, parts) =>
        set((state) => ({
          profiles: [profile, ...state.profiles.filter((item) => item.id !== profile.id)].slice(0, 20),
          imports: [...state.imports.filter((part) => part.profileId !== profile.id), ...parts],
        })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((item) => item.id !== id),
          imports: state.imports.filter((part) => part.profileId !== id),
        })),
    }),
    {
      name: "alyans-shop",
      partialize: (state) => ({
        markup: state.markup,
        cart: state.cart,
        profiles: state.profiles,
        imports: state.imports.length > 350 ? [] : state.imports,
      }),
    },
  ),
);

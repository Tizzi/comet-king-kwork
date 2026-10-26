import { Link } from "@tanstack/react-router";
import { Menu, Phone, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useShop } from "@/lib/shop-store";

const PHONES = ["8 (831) 414-29-83", "8 (831) 414-29-86", "8 (903) 602-29-83", "8 (903) 602-29-86"];

const NAV = [
  { to: "/stock/$wh", params: { wh: "main" }, label: "Осн. склад" },
  { to: "/stock/$wh", params: { wh: "extra" }, label: "Доп. склад" },
  { to: "/delivery", label: "Доставка и оплата" },
  { to: "/news", label: "Новости" },
  { to: "/warehouse", label: "Конструктор прайса" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const cartCount = useShop((state) => state.cart.reduce((sum, line) => sum + line.qty, 0));
  const { user, isPending } = useCurrentUserState();

  useEffect(() => setHydrated(true), []);

  return (
    <div className="min-h-screen">
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-xs">
          <Phone className="size-3.5 shrink-0" aria-hidden />
          {PHONES.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-red-ink">
              {phone}
            </a>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <span className="font-display text-3xl leading-none tracking-tight">
              <span className="text-red">A</span>
              <span className="text-blue">A</span>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg tracking-wide">АЛЬЯНСАВТО</span>
              <span className="block text-xs uppercase tracking-wider text-muted">Запчасти б/у</span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-4 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={"params" in item ? item.params : undefined}
                className="text-sm font-semibold uppercase tracking-wide text-ink hover:text-red"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/search" search={{ q: "", brand: "", group: "", stock: "", page: 1, sort: "price-asc" }} aria-label="Поиск" className="grid size-11 place-items-center lg:hidden">
              <Search className="size-5" />
            </Link>
            <Link to="/cart" aria-label="Заявка" className="relative grid size-11 place-items-center">
              <ShoppingBag className="size-5" />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-sm bg-red px-1 text-xs font-semibold text-red-ink tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            <AuthChip pending={isPending} signedIn={Boolean(user)} />
            <button type="button" className="grid size-11 place-items-center lg:hidden" aria-label={open ? "Закрыть меню" : "Меню"} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line px-4 py-2 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                params={"params" in item ? item.params : undefined}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mt-8 border-t border-line bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl tracking-wide">АльянсАвто</p>
            <p className="mt-2 text-sm text-muted">Б/у запчасти с фото, OEM и примечанием по состоянию. Онлайн-оплату подключим отдельно — сейчас заявка и звонок.</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Склад</p>
            <p className="mt-2 text-muted">Нижний Новгород</p>
            {PHONES.slice(0, 2).map((phone) => (
              <a key={phone} className="mt-1 block" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/delivery" className="hover:text-red">Доставка и оплата</Link>
            <Link to="/warehouse" className="hover:text-red">Как загрузить прайс</Link>
            <Link to="/account" className="hover:text-red">Кабинет клиента</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthChip({ pending, signedIn }: { pending: boolean; signedIn: boolean }) {
  if (pending) return <span className="size-11 animate-pulse rounded-sm bg-line" aria-hidden />;
  return (
    <Link to={signedIn ? "/account" : "/login"} aria-label={signedIn ? "Кабинет" : "Вход"} className="grid size-11 place-items-center">
      <UserRound className="size-5" />
    </Link>
  );
}

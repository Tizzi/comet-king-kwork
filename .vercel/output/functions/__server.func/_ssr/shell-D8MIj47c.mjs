import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-IWHfIGH2.mjs";
import { a as Search, c as Menu, i as ShoppingBag, n as UserRound, o as Phone, t as X } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-D8MIj47c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var ZERO_MARKUP = {
	percent: 0,
	fixed: 0,
	round: 1
};
function sellPrice(base, markup) {
	const raw = base * (1 + (Number(markup.percent) || 0) / 100) + (Number(markup.fixed) || 0);
	const step = Math.max(1, Number(markup.round) || 1);
	return Math.max(0, Math.round(raw / step) * step);
}
function formatMoney(value) {
	return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}
function formatCount(value) {
	return new Intl.NumberFormat("ru-RU").format(value);
}
var useShop = create()(persist((set) => ({
	markup: ZERO_MARKUP,
	cart: [],
	imports: [],
	profiles: [],
	setMarkup: (markup) => set({ markup }),
	addToCart: (id, qty = 1) => set((state) => {
		if (state.cart.find((line) => line.id === id)) return { cart: state.cart.map((line) => line.id === id ? {
			...line,
			qty: Math.min(99, line.qty + qty)
		} : line) };
		return { cart: [...state.cart, {
			id,
			qty
		}] };
	}),
	setQty: (id, qty) => set((state) => ({ cart: qty <= 0 ? state.cart.filter((line) => line.id !== id) : state.cart.map((line) => line.id === id ? {
		...line,
		qty
	} : line) })),
	removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((line) => line.id !== id) })),
	clearCart: () => set({ cart: [] }),
	saveImport: (profile, parts) => set((state) => ({
		profiles: [profile, ...state.profiles.filter((item) => item.id !== profile.id)].slice(0, 20),
		imports: [...state.imports.filter((part) => part.profileId !== profile.id), ...parts]
	})),
	removeProfile: (id) => set((state) => ({
		profiles: state.profiles.filter((item) => item.id !== id),
		imports: state.imports.filter((part) => part.profileId !== id)
	}))
}), {
	name: "alyans-shop",
	partialize: (state) => ({
		markup: state.markup,
		cart: state.cart,
		profiles: state.profiles,
		imports: state.imports.length > 350 ? [] : state.imports
	})
}));
var PHONES = [
	"8 (831) 414-29-83",
	"8 (831) 414-29-86",
	"8 (903) 602-29-83",
	"8 (903) 602-29-86"
];
var NAV = [
	{
		to: "/stock/$wh",
		params: { wh: "main" },
		label: "Осн. склад"
	},
	{
		to: "/stock/$wh",
		params: { wh: "extra" },
		label: "Доп. склад"
	},
	{
		to: "/delivery",
		label: "Доставка и оплата"
	},
	{
		to: "/news",
		label: "Новости"
	},
	{
		to: "/warehouse",
		label: "Конструктор прайса"
	}
];
function Shell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const cartCount = useShop((state) => state.cart.reduce((sum, line) => sum + line.qty, 0));
	const { user, isPending } = useCurrentUserState();
	(0, import_react.useEffect)(() => setHydrated(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-ink text-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
						className: "size-3.5 shrink-0",
						"aria-hidden": true
					}), PHONES.map((phone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `tel:${phone.replace(/[^\d+]/g, "")}`,
						className: "hover:text-red-ink",
						children: phone
					}, phone))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 shrink-0",
							onClick: () => setOpen(false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-3xl leading-none tracking-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red",
									children: "A"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-blue",
									children: "A"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-display text-lg tracking-wide",
									children: "АЛЬЯНСАВТО"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs uppercase tracking-wider text-muted",
									children: "Запчасти б/у"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-4 hidden items-center gap-4 lg:flex",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								params: "params" in item ? item.params : void 0,
								className: "text-sm font-semibold uppercase tracking-wide text-ink hover:text-red",
								children: item.label
							}, item.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/search",
									search: {
										q: "",
										brand: "",
										group: "",
										stock: "",
										page: 1,
										sort: "price-asc"
									},
									"aria-label": "Поиск",
									className: "grid size-11 place-items-center lg:hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cart",
									"aria-label": "Заявка",
									className: "relative grid size-11 place-items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), hydrated && cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-1 top-1 grid min-w-5 place-items-center rounded-sm bg-red px-1 text-xs font-semibold text-red-ink tabular-nums",
										children: cartCount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthChip, {
									pending: isPending,
									signedIn: Boolean(user)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-11 place-items-center lg:hidden",
									"aria-label": open ? "Закрыть меню" : "Меню",
									onClick: () => setOpen((v) => !v),
									children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							]
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-t border-line px-4 py-2 lg:hidden",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						params: "params" in item ? item.params : void 0,
						onClick: () => setOpen(false),
						className: "block py-3 text-sm font-semibold uppercase tracking-wide",
						children: item.label
					}, item.label))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-8 border-t border-line bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tracking-wide",
							children: "АльянсАвто"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Б/у запчасти с фото, OEM и примечанием по состоянию. Онлайн-оплату подключим отдельно — сейчас заявка и звонок."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Склад"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted",
									children: "Нижний Новгород"
								}),
								PHONES.slice(0, 2).map((phone) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-1 block",
									href: `tel:${phone.replace(/[^\d+]/g, "")}`,
									children: phone
								}, phone))
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/delivery",
									className: "hover:text-red",
									children: "Доставка и оплата"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/warehouse",
									className: "hover:text-red",
									children: "Как загрузить прайс"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									className: "hover:text-red",
									children: "Кабинет клиента"
								})
							]
						})
					]
				})
			})
		]
	});
}
function AuthChip({ pending, signedIn }) {
	if (pending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "size-11 animate-pulse rounded-sm bg-line",
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: signedIn ? "/account" : "/login",
		"aria-label": signedIn ? "Кабинет" : "Вход",
		className: "grid size-11 place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" })
	});
}
//#endregion
export { useCurrentUser as a, sellPrice as i, formatCount as n, useCurrentUserState as o, formatMoney as r, useShop as s, Shell as t };

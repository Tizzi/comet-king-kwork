import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useCurrentUserState, r as formatMoney, s as useShop, t as Shell } from "./shell-D8MIj47c.mjs";
import { t as createRequest } from "./requests-D5xZ7jk_.mjs";
import { a as useCatalog } from "./use-catalog-Gadq4JJ0.mjs";
import { t as PartPhoto } from "./part-photo-B1rpUPIU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart--GTO1AM2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { parts, priceOf } = useCatalog();
	const cart = useShop((state) => state.cart);
	const setQty = useShop((state) => state.setQty);
	const removeFromCart = useShop((state) => state.removeFromCart);
	const clearCart = useShop((state) => state.clearCart);
	const { user, isPending } = useCurrentUserState();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(null);
	const [sending, setSending] = (0, import_react.useState)(false);
	const lines = cart.map((line) => {
		const part = parts?.find((item) => item.id === line.id);
		return {
			line,
			part,
			price: part ? priceOf(part) : 0
		};
	}).filter((row) => row.part);
	const total = lines.reduce((sum, row) => sum + row.price * row.line.qty, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-wide",
			children: "Заявка"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: "Оплата на сайте не списывается. Менеджер сверяет наличие б/у детали и перезванивает."
		}),
		!parts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-sm text-muted",
			children: "Подгружаем позиции из корзины…"
		}),
		parts && lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 border border-dashed border-line bg-card px-4 py-10 text-center text-sm",
			children: ["Корзина пуста. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "text-blue",
				children: "Выбрать марку"
			})]
		}),
		lines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line border-y border-line",
				children: lines.map(({ line, part, price }) => part && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartPhoto, {
							src: part.photos[0],
							alt: "",
							className: "size-20 shrink-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/part/$id",
									params: { id: part.id },
									className: "font-medium hover:text-red",
									children: part.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										part.brand,
										" ",
										part.model
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 tabular-nums",
									children: formatMoney(price)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Количество",
								type: "number",
								min: 1,
								max: 99,
								value: line.qty,
								onChange: (event) => setQty(line.id, Number(event.target.value)),
								className: "h-11 w-16 border border-line bg-card px-2 tabular-nums"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => removeFromCart(line.id),
								className: "text-sm text-muted hover:text-red",
								children: "Убрать"
							})]
						})
					]
				}, line.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border border-line bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Итого"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: formatMoney(total)
					}),
					isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-40 animate-pulse bg-paper" }),
					!isPending && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: [
							"Чтобы заявка осталась в кабинете, ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-blue",
								children: "войдите или зарегистрируйтесь"
							}),
							". Корзина на этом устройстве сохранится."
						]
					}),
					!isPending && user && done === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 grid gap-3",
						onSubmit: (event) => {
							event.preventDefault();
							setSending(true);
							setError("");
							createRequest({ data: {
								name: name || user.displayName || "Клиент",
								phone,
								comment,
								items: lines.map(({ line, part, price }) => ({
									id: part.id,
									name: part.name,
									qty: line.qty,
									price,
									brand: part.brand,
									model: part.model
								}))
							} }).then((result) => {
								setDone(result.id);
								clearCart();
							}).catch((reason) => setError(reason instanceof Error ? reason.message : "Не отправилось")).finally(() => setSending(false));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								placeholder: "Имя",
								className: "h-11 border border-line bg-paper px-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: phone,
								onChange: (event) => setPhone(event.target.value),
								placeholder: "Телефон",
								required: true,
								className: "h-11 border border-line bg-paper px-3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: comment,
								onChange: (event) => setComment(event.target.value),
								placeholder: "Город, VIN, удобное время звонка",
								className: "min-h-24 border border-line bg-paper px-3 py-2"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-red",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: sending,
								className: "h-12 bg-red font-semibold text-red-ink disabled:opacity-60",
								children: sending ? "Отправляем…" : "Отправить заявку"
							})
						]
					}),
					done !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: [
							"Заявка №",
							done,
							" принята. Мы перезвоним. История лежит в кабинете."
						]
					})
				]
			})]
		})
	] });
}
//#endregion
export { CartPage as component };

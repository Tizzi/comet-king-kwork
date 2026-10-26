import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatMoney, s as useShop, t as Shell } from "./shell-D8MIj47c.mjs";
import { i as Route$2 } from "./router-B0OiHvH-.mjs";
import { a as useCatalog, r as stockLabel } from "./use-catalog-Gadq4JJ0.mjs";
import { r as groupTitle } from "./groups-QY9_H2hi.mjs";
import { n as slugify, t as modelSlug } from "./slug-D3UUeuvz.mjs";
import { t as PartPhoto } from "./part-photo-B1rpUPIU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/part._id-Ctf8KEcb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PartPage() {
	const { id } = Route$2.useParams();
	const { parts, priceOf } = useCatalog();
	const addToCart = useShop((state) => state.addToCart);
	const part = parts?.find((item) => item.id === id) ?? null;
	const [photo, setPhoto] = (0, import_react.useState)(0);
	const [added, setAdded] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		!parts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Открываем карточку…"
		}),
		parts && !part && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Позиция не найдена"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/search",
			search: {
				q: id,
				brand: "",
				group: "",
				stock: "",
				page: 1,
				sort: "price-asc"
			},
			className: "mt-4 inline-block text-blue",
			children: [
				"Искать «",
				id,
				"»"
			]
		})] }),
		part && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartPhoto, {
				src: part.photos[photo] ?? part.photos[0],
				alt: part.name,
				className: "aspect-square w-full border border-line"
			}), part.photos.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto",
				children: part.photos.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPhoto(index),
					className: `shrink-0 border ${index === photo ? "border-ink" : "border-line"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartPhoto, {
						src,
						alt: "",
						className: "size-16"
					})
				}, src))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/brand/$slug",
							params: { slug: slugify(part.brand) },
							className: "hover:text-red",
							children: part.brand
						}),
						" / ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/brand/$slug/$model",
							params: {
								slug: slugify(part.brand),
								model: modelSlug(part.model || "bez-modeli", part.years)
							},
							className: "hover:text-red",
							children: part.model || "Без модели"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-3xl tracking-wide sm:text-4xl",
					children: part.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-4xl tabular-nums",
					children: formatMoney(priceOf(part))
				}),
				priceOf(part) !== part.price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"База поставщика ",
						formatMoney(part.price),
						", на витрине уже с наценкой."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [
						part.condition,
						" · ",
						stockLabel(part.stock),
						" · ",
						part.qty,
						" шт."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-5 h-12 bg-red px-6 font-semibold text-red-ink",
					onClick: () => {
						addToCart(part.id, 1);
						setAdded(true);
					},
					children: added ? "Добавлено в заявку" : "В заявку"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-6 divide-y divide-line border-y border-line text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Группа",
							value: groupTitle(part.group)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Марка",
							value: part.brand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Модель",
							value: `${part.model} ${part.years}`.trim()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Год авто",
							value: part.year
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Двигатель",
							value: part.engine
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "OEM",
							value: part.oem
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Артикул склада",
							value: part.id.replace(/^imp-[^-]+-/, "")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Замены",
							value: part.repl
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Поставщик",
							value: part.supplier
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Примечание",
							value: part.note
						})
					]
				})
			] })]
		})
	] });
}
function Row({ label, value }) {
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1 py-2 sm:flex-row sm:gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "w-36 shrink-0 text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value })]
	});
}
//#endregion
export { PartPage as component };

import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as formatMoney, s as useShop } from "./shell-D8MIj47c.mjs";
import { n as queryParts, r as stockLabel } from "./use-catalog-Gadq4JJ0.mjs";
import { r as groupTitle, t as GROUPS } from "./groups-QY9_H2hi.mjs";
import { t as PartPhoto } from "./part-photo-B1rpUPIU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-view-bUhTOehy.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogView({ parts, query, priceOf, onQuery }) {
	const addToCart = useShop((state) => state.addToCart);
	if (!parts) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "border border-line bg-card px-4 py-8 text-sm text-muted",
		children: "Собираем индекс склада. В список попадут 24 карточки, не вся база."
	});
	const scoped = parts.filter((part) => matchBase(part, query));
	const result = queryParts(parts, query, priceOf);
	const visibleGroups = GROUPS.filter((group) => scoped.some((part) => part.group === group.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted tabular-nums",
				children: [result.total.toLocaleString("ru-RU"), " позиций"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Сортировка", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: query.sort || "price-asc",
					onChange: (event) => onQuery({
						...query,
						sort: event.target.value,
						page: 1
					}),
					className: "ml-2 h-11 border border-line bg-card px-2 text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price-asc",
							children: "Сначала дешевле"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "price-desc",
							children: "Сначала дороже"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name",
							children: "По названию"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex gap-2 overflow-x-auto pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: !query.group,
				onClick: () => onQuery({
					...query,
					group: "",
					page: 1
				}),
				children: "Все группы"
			}), visibleGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: query.group === group.id,
				onClick: () => onQuery({
					...query,
					group: group.id,
					page: 1
				}),
				children: group.title
			}, group.id))]
		}),
		result.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 border border-dashed border-line bg-card px-4 py-10 text-center text-sm text-muted",
			children: "В этом срезе пусто. Смените группу или загрузите прайс в конструкторе."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 divide-y divide-line border-y border-line",
			children: result.items.map((part) => {
				const price = priceOf(part);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap gap-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/part/$id",
							params: { id: part.id },
							className: "block w-24 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartPhoto, {
								src: part.photos[0],
								alt: "",
								className: "aspect-square w-full"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 basis-48",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/part/$id",
									params: { id: part.id },
									className: "font-medium leading-snug hover:text-red",
									children: part.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted",
									children: [
										part.brand,
										" ",
										part.model,
										" ",
										part.years && `(${part.years})`,
										part.year && ` · ${part.year}`,
										part.engine && ` · ${part.engine}`
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: groupTitle(part.group)
										}),
										part.oem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" · OEM ", part.oem] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" · арт. ", part.id.replace(/^imp-[^-]+-/, "")] })
									]
								}),
								part.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-sm text-muted",
									children: part.note
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full items-center justify-between gap-3 sm:w-40 sm:flex-col sm:items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [
									price !== part.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted line-through tabular-nums",
										children: formatMoney(part.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl tabular-nums",
										children: formatMoney(price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											part.condition,
											" · ",
											stockLabel(part.stock)
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => addToCart(part.id, 1),
								className: "h-11 bg-red px-4 text-sm font-semibold text-red-ink hover:opacity-90",
								children: "В заявку"
							})]
						})
					]
				}, part.id);
			})
		}),
		result.pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
					label: "Назад",
					disabled: result.page <= 1,
					onClick: () => onQuery({
						...query,
						page: result.page - 1
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "px-2 text-sm tabular-nums text-muted",
					children: [
						result.page,
						" / ",
						result.pages
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
					label: "Дальше",
					disabled: result.page >= result.pages,
					onClick: () => onQuery({
						...query,
						page: result.page + 1
					})
				})
			]
		})
	] });
}
function matchBase(part, query) {
	if (query.brand && part.brand !== query.brand) return false;
	if (query.model && part.model !== query.model) return false;
	if (query.years && part.years !== query.years) return false;
	if (query.stock && part.stock !== query.stock) return false;
	return true;
}
function FilterChip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `h-10 shrink-0 border px-3 text-sm ${active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink"}`,
		children
	});
}
function Pager({ label, disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: "h-11 border border-line bg-card px-4 text-sm disabled:opacity-40",
		children: label
	});
}
//#endregion
export { CatalogView as t };

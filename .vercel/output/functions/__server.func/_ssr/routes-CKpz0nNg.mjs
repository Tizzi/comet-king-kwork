import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatCount, t as Shell } from "./shell-D8MIj47c.mjs";
import { t as catalogMeta } from "./use-catalog-Gadq4JJ0.mjs";
import { t as SearchBox } from "./search-box-BMUtAKtT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CKpz0nNg.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const brands = catalogMeta.showcase.filter((brand) => !(brand.count === 0 && /-\d+$/.test(brand.slug)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid items-center gap-6 border border-line bg-card lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/hero-car.jpg",
				alt: "Красный кузов в разборе, отдельно от голого шасси",
				className: "h-64 w-full object-cover object-left sm:h-80 lg:h-full"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-6 sm:px-8 sm:py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold uppercase tracking-widest text-blue",
						children: "Склад б/у"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-wide sm:text-5xl",
						children: "Автозапчасти АльянсАвто"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 max-w-md text-lg",
						children: [
							"Новые и б/у на все марки и модели. Сейчас в индексе ",
							formatCount(catalogMeta.total),
							" позиций с фото."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stock/$wh",
						params: { wh: "main" },
						className: "mt-6 inline-flex h-11 items-center border-b-2 border-ink font-semibold tracking-wide",
						children: "Подробнее"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, { large: true })
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl tracking-wide",
					children: "Выберите марку"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-2 grid gap-1 text-sm text-muted sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Марка автомобиля" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Модель и годы" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Группа детали или поиск по OEM" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 columns-2 gap-x-6 sm:columns-3 lg:columns-6",
					children: brands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/brand/$slug",
						params: { slug: brand.slug },
						className: `block break-inside-avoid py-1.5 text-sm hover:text-red ${brand.count ? "text-ink" : "text-muted"}`,
						children: [brand.name, brand.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 tabular-nums text-muted",
							children: formatCount(brand.count)
						})]
					}, brand.slug))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-10 grid gap-4 sm:grid-cols-3",
			children: [
				["Фото по ссылке", "Картинки не лежат в базе. В списке грузится только первое фото, остальные — на карточке."],
				["Цена с наценкой", "Базовая цена поставщика и наценка магазина считаются отдельно. Процент меняется сразу на витрине."],
				["Заявка, не эквайринг", "Б/у и чужие разборки. Клиент оставляет телефон, оплату картой подключим, когда будет ИП или ООО."]
			].map(([title, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl tracking-wide",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: text
				})]
			}, title))
		})
	] });
}
//#endregion
export { Home as component };

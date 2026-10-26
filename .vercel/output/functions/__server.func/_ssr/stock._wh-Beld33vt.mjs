import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-D8MIj47c.mjs";
import { r as Route$1 } from "./router-B0OiHvH-.mjs";
import { a as useCatalog } from "./use-catalog-Gadq4JJ0.mjs";
import { t as CatalogView } from "./catalog-view-bUhTOehy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock._wh-Beld33vt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StockPage() {
	const { wh } = Route$1.useParams();
	const stock = wh === "main" ? "main" : "extra";
	const { parts, priceOf } = useCatalog();
	const [query, setQuery] = (0, import_react.useState)({
		page: 1,
		sort: "price-asc",
		stock,
		group: ""
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/stock/$wh",
				params: { wh: "main" },
				className: stock === "main" ? "font-semibold text-red" : "text-muted",
				children: "Основной"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/stock/$wh",
				params: { wh: "extra" },
				className: stock === "extra" ? "font-semibold text-red" : "text-muted",
				children: "Под заказ"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl tracking-wide",
			children: stock === "main" ? "Основной склад" : "Дополнительный склад"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm text-muted",
			children: stock === "main" ? "Позиции, у которых в примечании поставщика стоит «склад» — их можно смотреть и забирать быстрее." : "Остальное едет от разборок под заказ. Срок и состояние написаны в примечании карточки."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogView, {
				parts,
				priceOf,
				query: {
					...query,
					stock
				},
				onQuery: (next) => setQuery({
					...next,
					stock
				})
			})
		})
	] });
}
//#endregion
export { StockPage as component };

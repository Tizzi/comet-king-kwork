import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-D8MIj47c.mjs";
import { o as Route$5 } from "./router-B0OiHvH-.mjs";
import { a as useCatalog } from "./use-catalog-Gadq4JJ0.mjs";
import { t as CatalogView } from "./catalog-view-bUhTOehy.mjs";
import { t as SearchBox } from "./search-box-BMUtAKtT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CbYxkSu6.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const params = Route$5.useSearch();
	const navigate = Route$5.useNavigate();
	const { parts, priceOf, ms } = useCatalog();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-wide",
			children: "Поиск"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				initial: params.q,
				large: true
			})
		}),
		ms > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-muted",
			children: [
				"Индекс собран за ",
				ms,
				" мс. На странице не больше 24 карточек."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogView, {
				parts,
				priceOf,
				query: params,
				onQuery: (next) => {
					navigate({ search: {
						q: next.q ?? params.q,
						brand: next.brand ?? "",
						group: next.group ?? "",
						stock: next.stock ?? "",
						page: next.page ?? 1,
						sort: next.sort ?? "price-asc"
					} });
				}
			})
		})
	] });
}
//#endregion
export { SearchPage as component };

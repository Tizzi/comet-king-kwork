import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-D8MIj47c.mjs";
import { n as Route } from "./router-B0OiHvH-.mjs";
import { a as useCatalog, t as catalogMeta } from "./use-catalog-Gadq4JJ0.mjs";
import { t as modelSlug } from "./slug-D3UUeuvz.mjs";
import { t as CatalogView } from "./catalog-view-bUhTOehy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand._slug._model-CAAhS-jb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ModelPage() {
	const { slug, model: modelParam } = Route.useParams();
	const { parts, priceOf } = useCatalog();
	const brand = catalogMeta.brands.find((item) => item.slug === slug);
	const metaModel = brand?.models.find((item) => item.slug === modelParam);
	const [query, setQuery] = (0, import_react.useState)({
		page: 1,
		sort: "price-asc",
		group: ""
	});
	const resolved = (0, import_react.useMemo)(() => {
		if (metaModel && brand) return {
			brand: brand.name,
			model: metaModel.name || "Без модели",
			years: metaModel.years
		};
		const sample = parts?.find((part) => modelSlug(part.model || "bez-modeli", part.years) === modelParam);
		return sample ? {
			brand: sample.brand,
			model: sample.model || "Без модели",
			years: sample.years
		} : null;
	}, [
		brand,
		metaModel,
		parts,
		modelParam
	]);
	const scoped = (0, import_react.useMemo)(() => {
		if (!parts || !resolved) return parts;
		return parts.filter((part) => part.brand === resolved.brand && (part.model || "Без модели") === resolved.model && part.years === resolved.years);
	}, [parts, resolved]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "hover:text-red",
					children: "Марки"
				}),
				" / ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/brand/$slug",
					params: { slug },
					className: "hover:text-red",
					children: resolved?.brand ?? slug
				}),
				resolved && ` / ${resolved.model}`
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl tracking-wide",
			children: resolved ? `${resolved.brand} ${resolved.model}` : "Модель"
		}),
		resolved?.years && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: resolved.years
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogView, {
				parts: resolved ? scoped : parts ? [] : null,
				query: {
					...query,
					brand: resolved?.brand,
					model: resolved?.model === "Без модели" ? "" : resolved?.model,
					years: resolved?.years
				},
				priceOf,
				onQuery: setQuery
			})
		})
	] });
}
//#endregion
export { ModelPage as component };

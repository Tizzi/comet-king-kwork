import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatCount, t as Shell } from "./shell-D8MIj47c.mjs";
import { a as Route$3 } from "./router-B0OiHvH-.mjs";
import { a as useCatalog, t as catalogMeta } from "./use-catalog-Gadq4JJ0.mjs";
import { r as groupTitle } from "./groups-QY9_H2hi.mjs";
import { t as modelSlug } from "./slug-D3UUeuvz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand._slug-Cl4dEWxv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandPage() {
	const { slug } = Route$3.useParams();
	const { parts } = useCatalog();
	const fromMeta = catalogMeta.brands.find((brand) => brand.slug === slug);
	const showcase = catalogMeta.showcase.find((brand) => brand.slug === slug);
	const name = fromMeta?.name ?? showcase?.name ?? slug;
	const models = (0, import_react.useMemo)(() => {
		if (!parts) return fromMeta?.models ?? [];
		const mine = parts.filter((part) => part.brand === name || fromMeta && part.brand === fromMeta.name);
		const map = /* @__PURE__ */ new Map();
		for (const part of mine) {
			const key = modelSlug(part.model || "bez-modeli", part.years);
			const current = map.get(key) ?? {
				name: part.model || "Без модели",
				years: part.years,
				slug: key,
				count: 0
			};
			current.count += 1;
			map.set(key, current);
		}
		return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "ru") || b.count - a.count);
	}, [
		parts,
		name,
		fromMeta
	]);
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
				name
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl tracking-wide",
			children: name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: models.length ? "Выберите модель и годы выпуска." : "В текущей выгрузке этой марки нет. Добавьте её прайсом в конструкторе."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 divide-y divide-line border-y border-line",
			children: models.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/brand/$slug/$model",
				params: {
					slug,
					model: model.slug
				},
				className: "flex items-center justify-between gap-3 py-3 hover:text-red",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: model.name || "Без модели"
				}), model.years && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-sm text-muted",
					children: model.years
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm tabular-nums text-muted",
					children: formatCount(model.count)
				})]
			}) }, model.slug))
		}),
		fromMeta && !parts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-muted",
			children: [
				"Группы уточнятся, когда индекс догрузится. ",
				groupTitle("other"),
				" и остальные разделы откроются внутри модели."
			]
		})
	] });
}
//#endregion
export { BrandPage as component };

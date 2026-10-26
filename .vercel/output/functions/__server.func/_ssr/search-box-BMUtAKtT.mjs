import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Search } from "../_libs/lucide-react.mjs";
import { r as formatMoney } from "./shell-D8MIj47c.mjs";
import { a as useCatalog, i as suggestParts } from "./use-catalog-Gadq4JJ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-box-BMUtAKtT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchBox({ initial = "", large = false }) {
	const navigate = useNavigate();
	const { parts, priceOf } = useCatalog();
	const [q, setQ] = (0, import_react.useState)(initial);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setQ(initial), [initial]);
	const hints = parts && q.trim().length > 1 ? suggestParts(parts, q) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "relative",
		onSubmit: (event) => {
			event.preventDefault();
			setOpen(false);
			navigate({
				to: "/search",
				search: {
					q: q.trim(),
					page: 1,
					sort: "price-asc",
					brand: "",
					group: "",
					stock: ""
				}
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: large ? "search-large" : "search-main",
				children: "Поиск детали, OEM или артикула"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: large ? "search-large" : "search-main",
				value: q,
				onChange: (event) => {
					setQ(event.target.value);
					setOpen(true);
				},
				onFocus: () => setOpen(true),
				placeholder: "Капот, OEM, артикул склада…",
				className: `w-full border border-line bg-card pr-12 pl-4 text-ink outline-none placeholder:text-muted ${large ? "h-14 text-base" : "h-11 text-sm"}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				"aria-label": "Найти",
				className: "absolute top-0 right-0 grid h-full w-12 place-items-center text-ink hover:text-red",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
			}),
			open && hints.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute z-20 mt-1 w-full border border-line bg-card shadow-sm",
				children: hints.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/part/$id",
					params: { id: part.id },
					onClick: () => setOpen(false),
					className: "flex items-start justify-between gap-3 px-3 py-2 text-sm hover:bg-paper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: part.name.split(",")[0]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							part.brand,
							" ",
							part.model,
							" ",
							part.oem && `· ${part.oem}`
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums",
						children: formatMoney(priceOf(part))
					})]
				}) }, part.id))
			})
		]
	});
}
//#endregion
export { SearchBox as t };

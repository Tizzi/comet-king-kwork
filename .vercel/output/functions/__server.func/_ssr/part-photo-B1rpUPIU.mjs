import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Package } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/part-photo-B1rpUPIU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PartPhoto({ src, alt, className = "" }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (!src || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `grid place-items-center bg-paper text-muted ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
			className: "size-6",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: alt
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		loading: "lazy",
		decoding: "async",
		onError: () => setFailed(true),
		className: `bg-paper object-cover ${className}`
	});
}
//#endregion
export { PartPhoto as t };

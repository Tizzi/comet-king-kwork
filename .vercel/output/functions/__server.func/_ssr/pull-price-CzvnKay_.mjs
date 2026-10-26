import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-by4BGCsA.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pull-price-CzvnKay_.js
function publicHttps(raw) {
	let url;
	try {
		url = new URL(String(raw ?? "").trim());
	} catch {
		throw new Error("Некорректная ссылка");
	}
	if (url.protocol !== "https:") throw new Error("Нужна ссылка, которая начинается с https");
	const host = url.hostname.toLowerCase();
	if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) throw new Error("Внутренние адреса скачивать нельзя");
	return url.toString();
}
var pullPrice_createServerFn_handler = createServerRpc({
	id: "1ddf8600ec1004fb47c786b31d6b5697ff658c5ec5c9cafcb8c7da7e3184f3c5",
	name: "pullPrice",
	filename: "src/lib/pull-price.ts"
}, (opts) => pullPrice.__executeServer(opts));
var pullPrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((url) => publicHttps(url)).handler(pullPrice_createServerFn_handler, async ({ data }) => {
	const response = await fetch(data, {
		redirect: "follow",
		signal: AbortSignal.timeout(15e3)
	});
	if (!response.ok) throw new Error(`Поставщик ответил ${response.status}`);
	if (Number(response.headers.get("content-length") || 0) > 8e6) throw new Error("Файл больше 8 МБ — для такой выгрузки нужен серверный поток");
	const text = await response.text();
	if (text.length > 8e6) throw new Error("Файл больше 8 МБ");
	return {
		text: text.slice(0, 8e6),
		bytes: text.length
	};
});
//#endregion
export { pullPrice_createServerFn_handler };

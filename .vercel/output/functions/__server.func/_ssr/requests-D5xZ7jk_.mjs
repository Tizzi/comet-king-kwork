import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-by4BGCsA.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests-D5xZ7jk_.js
var listRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b142e9eefe17a4e51ed75dc9575f14409cffde65877982f6bf4402788d072420"));
var createRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const name = String(input?.name ?? "").trim().slice(0, 80);
	const phone = String(input?.phone ?? "").trim().slice(0, 32);
	const comment = String(input?.comment ?? "").trim().slice(0, 500);
	const items = (Array.isArray(input?.items) ? input.items : []).slice(0, 40).map((item) => ({
		id: String(item.id ?? "").slice(0, 64),
		name: String(item.name ?? "").slice(0, 180),
		qty: Math.max(1, Math.min(99, Number(item.qty) || 1)),
		price: Math.max(0, Math.round(Number(item.price) || 0)),
		brand: String(item.brand ?? "").slice(0, 60),
		model: String(item.model ?? "").slice(0, 80)
	})).filter((item) => item.id && item.name && item.price >= 0);
	if (name.length < 2 || phone.length < 6 || !items.length) throw new Error("Нужны имя, телефон и хотя бы одна деталь");
	return {
		name,
		phone,
		comment,
		items
	};
}).handler(createSsrRpc("b49d40f18133225d9ee646a6bd1138e30ec524a6c35d7571c2fcf28d9b4c1998"));
//#endregion
export { listRequests as n, createRequest as t };

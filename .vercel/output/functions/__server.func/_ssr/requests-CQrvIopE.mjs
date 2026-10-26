import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-by4BGCsA.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requests-CQrvIopE.js
function asItems(value) {
	const source = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(source)) return [];
	return source.map((item) => ({
		id: String(item.id ?? ""),
		name: String(item.name ?? ""),
		qty: Number(item.qty) || 1,
		price: Number(item.price) || 0,
		brand: String(item.brand ?? ""),
		model: String(item.model ?? "")
	}));
}
var listRequests_createServerFn_handler = createServerRpc({
	id: "b142e9eefe17a4e51ed75dc9575f14409cffde65877982f6bf4402788d072420",
	name: "listRequests",
	filename: "src/lib/requests.ts"
}, (opts) => listRequests.__executeServer(opts));
var listRequests = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRequests_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-C6j5as2C.mjs").then((n) => n.t);
	return (await (await getSql())`select id, contact_name, phone, comment, items, total, created_at::text as created_at
       from part_requests where user_id = ${context.userId} order by id desc limit 30`).map((row) => ({
		id: row.id,
		name: row.contact_name,
		phone: row.phone,
		comment: row.comment,
		items: asItems(row.items),
		total: Number(row.total) || 0,
		createdAt: String(row.created_at)
	}));
});
var createRequest_createServerFn_handler = createServerRpc({
	id: "b49d40f18133225d9ee646a6bd1138e30ec524a6c35d7571c2fcf28d9b4c1998",
	name: "createRequest",
	filename: "src/lib/requests.ts"
}, (opts) => createRequest.__executeServer(opts));
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
}).handler(createRequest_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-C6j5as2C.mjs").then((n) => n.t);
	const sql = await getSql();
	const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
	return { id: (await sql`
      insert into part_requests (user_id, contact_name, phone, comment, items, total)
      values (${context.userId}, ${data.name}, ${data.phone}, ${data.comment}, ${JSON.stringify(data.items)}, ${total})
      returning id
    `)[0]?.id ?? 0 };
});
//#endregion
export { createRequest_createServerFn_handler, listRequests_createServerFn_handler };

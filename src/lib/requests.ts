import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type RequestItem = { id: string; name: string; qty: number; price: number; brand: string; model: string };

export type SavedRequest = {
  id: number;
  name: string;
  phone: string;
  comment: string;
  items: RequestItem[];
  total: number;
  createdAt: string;
};

function asItems(value: unknown): RequestItem[] {
  const source = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(source)) return [];
  return source.map((item) => ({
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    qty: Number(item.qty) || 1,
    price: Number(item.price) || 0,
    brand: String(item.brand ?? ""),
    model: String(item.model ?? ""),
  }));
}

export const listRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      contact_name: string;
      phone: string;
      comment: string;
      items: string;
      total: number;
      created_at: string;
    }>`select id, contact_name, phone, comment, items, total, created_at::text as created_at
       from part_requests where user_id = ${context.userId} order by id desc limit 30`;
    return rows.map((row) => ({
      id: row.id,
      name: row.contact_name,
      phone: row.phone,
      comment: row.comment,
      items: asItems(row.items),
      total: Number(row.total) || 0,
      createdAt: String(row.created_at),
    })) satisfies SavedRequest[];
  });

export const createRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; phone: string; comment: string; items: RequestItem[] }) => {
    const name = String(input?.name ?? "").trim().slice(0, 80);
    const phone = String(input?.phone ?? "").trim().slice(0, 32);
    const comment = String(input?.comment ?? "").trim().slice(0, 500);
    const items = (Array.isArray(input?.items) ? input.items : []).slice(0, 40).map((item) => ({
      id: String(item.id ?? "").slice(0, 64),
      name: String(item.name ?? "").slice(0, 180),
      qty: Math.max(1, Math.min(99, Number(item.qty) || 1)),
      price: Math.max(0, Math.round(Number(item.price) || 0)),
      brand: String(item.brand ?? "").slice(0, 60),
      model: String(item.model ?? "").slice(0, 80),
    })).filter((item) => item.id && item.name && item.price >= 0);
    if (name.length < 2 || phone.length < 6 || !items.length) {
      throw new Error("Нужны имя, телефон и хотя бы одна деталь");
    }
    return { name, phone, comment, items };
  })
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const rows = await sql<{ id: number }>`
      insert into part_requests (user_id, contact_name, phone, comment, items, total)
      values (${context.userId}, ${data.name}, ${data.phone}, ${data.comment}, ${JSON.stringify(data.items)}, ${total})
      returning id
    `;
    return { id: rows[0]?.id ?? 0 };
  });

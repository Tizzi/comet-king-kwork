import { catalogMeta } from "@/data/meta";
import type { Markup } from "@/lib/money";
import { sellPrice } from "@/lib/money";

export type Stock = "main" | "extra";

export type Part = {
  id: string;
  name: string;
  brand: string;
  model: string;
  years: string;
  oem: string;
  engine: string;
  year: string;
  note: string;
  qty: number;
  price: number;
  stock: Stock;
  group: string;
  photos: string[];
  repl: string;
  supplier: string;
  condition: "БУ" | "Новая";
  profileId?: string;
};

type Payload = { hosts: string[]; rows: unknown[][] };

let cache: Promise<{ parts: Part[]; ms: number }> | null = null;

function unpackPhoto(hosts: string[], token: string) {
  const match = token.match(/^(\d+)(\/.*)$/);
  if (!match) return token;
  const host = hosts[Number(match[1])];
  return host ? host + match[2] : token;
}

export function loadSeed() {
  if (!cache) {
    const started = performance.now();
    cache = fetch("/catalog/parts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Каталог не открылся");
        return res.json() as Promise<Payload>;
      })
      .then((data) => {
        const parts: Part[] = data.rows.map((row) => {
          const [id, name, brand, model, years, oem, engine, year, note, qty, price, stock, group, photos, repl] =
            row as [string, string, string, string, string, string, string, string, string, number, number, Stock, string, string, string];
          return {
            id: String(id),
            name,
            brand,
            model,
            years,
            oem: oem || "",
            engine: engine || "",
            year: year || "",
            note: note || "",
            qty: Number(qty) || 1,
            price: Number(price) || 0,
            stock: stock === "main" ? "main" : "extra",
            group: group || "other",
            photos: photos
              ? String(photos)
                  .split("|")
                  .filter(Boolean)
                  .map((photo) => unpackPhoto(data.hosts, photo))
              : [],
            repl: repl || "",
            supplier: catalogMeta.supplier,
            condition: "БУ",
          };
        });
        return { parts, ms: Math.round(performance.now() - started) };
      });
  }
  return cache;
}

export function mergeParts(seed: Part[], imported: Part[]) {
  if (!imported.length) return seed;
  const map = new Map(seed.map((part) => [part.id, part]));
  for (const part of imported) map.set(part.id, part);
  return [...map.values()];
}

export function partPrice(part: Part, global: Markup, profiles: { id: string; markup: Markup }[]) {
  const profile = part.profileId ? profiles.find((item) => item.id === part.profileId) : undefined;
  return sellPrice(part.price, profile?.markup ?? global);
}

function norm(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

export type PartQuery = {
  q?: string;
  brand?: string;
  model?: string;
  years?: string;
  group?: string;
  stock?: "" | Stock;
  page?: number;
  sort?: "price-asc" | "price-desc" | "name";
  pageSize?: number;
};

export function queryParts(parts: Part[], query: PartQuery, priceOf: (part: Part) => number) {
  const tokens = norm(query.q || "").split(" ").filter(Boolean);
  let list = parts;
  if (query.brand) list = list.filter((part) => part.brand === query.brand);
  if (query.model) list = list.filter((part) => part.model === query.model && (!query.years || part.years === query.years));
  if (query.group) list = list.filter((part) => part.group === query.group);
  if (query.stock) list = list.filter((part) => part.stock === query.stock);
  if (tokens.length) {
    list = list.filter((part) => {
      const hay = norm([part.name, part.brand, part.model, part.years, part.oem, part.id, part.engine, part.year, part.note, part.repl, part.supplier].join(" "));
      return tokens.every((token) => hay.includes(token));
    });
  }
  const sorted = list.slice();
  const sort = query.sort || "price-asc";
  if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  else if (sort === "price-desc") sorted.sort((a, b) => priceOf(b) - priceOf(a) || a.name.localeCompare(b.name, "ru"));
  else sorted.sort((a, b) => priceOf(a) - priceOf(b) || a.name.localeCompare(b.name, "ru"));
  const pageSize = query.pageSize || 24;
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, query.page || 1), pages);
  const start = (page - 1) * pageSize;
  return { total: sorted.length, page, pages, items: sorted.slice(start, start + pageSize) };
}

export function suggestParts(parts: Part[], q: string, limit = 7) {
  const tokens = norm(q).split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return [];
  const out: Part[] = [];
  for (const part of parts) {
    const hay = norm(`${part.name} ${part.brand} ${part.model} ${part.oem} ${part.id}`);
    if (tokens.every((token) => hay.includes(token))) {
      out.push(part);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export function stockLabel(stock: Stock) {
  return stock === "main" ? "Основной склад" : "Под заказ";
}

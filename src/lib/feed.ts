import { classifyPart } from "@/lib/groups";
import { catalogMeta } from "@/data/meta";
import type { Part, Stock } from "@/lib/catalog";
import { slugify } from "@/lib/slug";

export const FEED_FIELDS = [
  { key: "name", label: "Наименование", required: true, hints: ["наименование", "название", "name", "title", "товар"] },
  { key: "brand", label: "Марка", required: true, hints: ["марка", "brand", "make"] },
  { key: "model", label: "Модель", required: true, hints: ["модель", "model"] },
  { key: "price", label: "Цена", required: true, hints: ["цена", "price", "стоимость"] },
  { key: "photos", label: "Фото", hints: ["фото", "photo", "image", "картин", "изображ"] },
  { key: "sku", label: "Артикул склада", hints: ["артикул склада", "артикул", "sku", "код склада"] },
  { key: "oem", label: "Номер OEM", hints: ["oem", "номер oem", "оригинал"] },
  { key: "engine", label: "Двигатель", hints: ["двигатель", "engine", "мотор"] },
  { key: "year", label: "Год", hints: ["год", "year"] },
  { key: "note", label: "Примечание", hints: ["примечание", "описание", "comment", "note"] },
  { key: "qty", label: "Количество", hints: ["колич", "qty", "остаток"] },
  { key: "condition", label: "Новая / БУ", hints: ["новая", "состояние", "condition", "б/у", "бу"] },
  { key: "repl", label: "Номера замен", hints: ["замен", "кросс", "cross"] },
  { key: "group", label: "Группа", hints: ["группа", "категор", "раздел"] },
] as const;

export type FieldKey = (typeof FEED_FIELDS)[number]["key"];
export type Mapping = Partial<Record<FieldKey, string>>;

export function detectDelimiter(text: string) {
  const line = text.split(/\r?\n/).find((row) => row.trim()) ?? "";
  const scored = [
    { d: "\t", n: (line.match(/\t/g) ?? []).length },
    { d: ";", n: (line.match(/;/g) ?? []).length },
    { d: ",", n: (line.match(/,/g) ?? []).length },
  ].sort((a, b) => b.n - a.n);
  return scored[0].n > 0 ? scored[0].d : ",";
}

export function parseDelimited(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delimiter) {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") cur += ch;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim()));
}

export function tableFromDelimited(text: string, delimiter: string) {
  const matrix = parseDelimited(text, delimiter);
  if (matrix.length < 2) return { headers: [] as string[], records: [] as Record<string, string>[] };
  const headers = matrix[0].map((cell, index) => cell.trim() || `Колонка ${index + 1}`);
  const records = matrix.slice(1, 8000).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  });
  return { headers, records };
}

export function guessMapping(headers: string[]): Mapping {
  const mapping: Mapping = {};
  const used = new Set<string>();
  for (const field of FEED_FIELDS) {
    const found = headers.find((header) => {
      if (used.has(header)) return false;
      const name = header.toLowerCase().replace(/ё/g, "е");
      return field.hints.some((hint) => name.includes(hint) || hint.includes(name));
    });
    if (found) {
      mapping[field.key] = found;
      used.add(found);
    }
  }
  return mapping;
}

export function parseXmlTable(text: string) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) return null;
  const counts = new Map<string, number>();
  for (const el of doc.getElementsByTagName("*")) {
    if (el.children.length >= 2) counts.set(el.tagName, (counts.get(el.tagName) ?? 0) + 1);
  }
  let best = "";
  let bestCount = 1;
  for (const [name, count] of counts) {
    if (count > bestCount && name !== doc.documentElement?.tagName) {
      best = name;
      bestCount = count;
    }
  }
  if (!best) return null;
  const headers = new Set<string>();
  const records = [...doc.getElementsByTagName(best)].slice(0, 8000).map((node) => {
    const record: Record<string, string> = {};
    for (const child of node.children) {
      headers.add(child.tagName);
      record[child.tagName] = (child.textContent ?? "").trim();
    }
    return record;
  });
  return { headers: [...headers], records };
}

function parsePrice(raw: string) {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function splitModel(model: string) {
  const match = model.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { name: model.trim(), years: "" };
  return { name: match[1].trim(), years: match[2].trim() };
}

export function rowsToParts(
  records: Record<string, string>[],
  mapping: Mapping,
  profile: { id: string; supplier: string; warehouse: Stock },
) {
  const parts: Part[] = [];
  const seen = new Set<string>();
  records.forEach((record, index) => {
    const read = (key: FieldKey) => {
      const column = mapping[key];
      return column ? (record[column] ?? "").trim() : "";
    };
    const name = read("name");
    const brand = read("brand");
    const price = parsePrice(read("price"));
    if (!name || !brand || !price) return;
    const modelRaw = read("model");
    const split = splitModel(modelRaw);
    const sku = read("sku") || `${slugify(brand)}-${slugify(name).slice(0, 24)}-${index + 1}`;
    const id = `${profile.id}-${sku}`;
    if (seen.has(id)) return;
    seen.add(id);
    const note = read("note");
    const groupRaw = read("group").toLowerCase();
    const known = ["engine", "cooling", "fuel", "exhaust", "transmission", "suspension", "brakes", "climate", "electric", "optics", "body", "interior", "exterior", "other"];
    const photos = read("photos")
      .split(/[,|\s]+/)
      .map((item) => item.trim())
      .filter((item) => item.startsWith("http"))
      .slice(0, 4);
    const conditionText = read("condition").toLowerCase();
    parts.push({
      id,
      name,
      brand,
      model: split.name,
      years: split.years,
      oem: read("oem"),
      engine: read("engine"),
      year: read("year"),
      note,
      qty: Math.max(1, Number(read("qty").replace(",", ".")) || 1),
      price,
      stock: profile.warehouse,
      group: known.includes(groupRaw) ? groupRaw : classifyPart(name, note),
      photos,
      repl: read("repl"),
      supplier: profile.supplier || catalogMeta.supplier,
      condition: conditionText.includes("нов") ? "Новая" : "БУ",
      profileId: profile.id,
    });
  });
  return parts;
}

export const SAMPLE_PRICE = `Наименование товара;Марка;Модель;Номер OEM;Артикул склада;Двигатель;Год;Примечание Описание;Колличество;Цена;Фотография
Фара передняя левая;Peugeot;307 (2001 - 2008);6204S3;demo-1001;1.6 Бензин;2004;Европейская. Мелкие потёртости;1;4200;https://i0775.ru/i/2108/ff5/ff58cf1ea316eae0071124045e1a5202.jpg
Капот;Renault;Megane 2 (2002 - 2008);;demo-1002;;2006;Цена за железо;1;6500;
Рычаг передний левый;Citroen;Xsara (1997 - 2006);;demo-1003;;2001;Сайлентблок под замену;1;1800;
Блок АБС;Citroen;C4 Picasso 1 (2006 - 2013);9661963780;demo-1004;;2008;ESP;1;8900;`;

import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

function publicHttps(raw: string) {
  let url: URL;
  try {
    url = new URL(String(raw ?? "").trim());
  } catch {
    throw new Error("Некорректная ссылка");
  }
  if (url.protocol !== "https:") throw new Error("Нужна ссылка, которая начинается с https");
  const host = url.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
  if (blocked) throw new Error("Внутренние адреса скачивать нельзя");
  return url.toString();
}

export const pullPrice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((url: string) => publicHttps(url))
  .handler(async ({ data }) => {
    const response = await fetch(data, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Поставщик ответил ${response.status}`);
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > 8_000_000) throw new Error("Файл больше 8 МБ — для такой выгрузки нужен серверный поток");
    const text = await response.text();
    if (text.length > 8_000_000) throw new Error("Файл больше 8 МБ");
    return { text: text.slice(0, 8_000_000), bytes: text.length };
  });

const TR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i", й: "j",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e",
  ю: "yu", я: "ya",
};

export function slugify(value: string) {
  const lower = value.toLowerCase().replace(/ё/g, "е");
  let out = "";
  for (const ch of lower) out += TR[ch] ?? ch;
  return out.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
}

export function modelSlug(name: string, years: string) {
  return slugify(`${name}${years ? `-${years}` : ""}`);
}

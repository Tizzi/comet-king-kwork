//#region node_modules/.nitro/vite/services/ssr/assets/slug-D3UUeuvz.js
var TR = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ж: "zh",
	з: "z",
	и: "i",
	й: "j",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "h",
	ц: "c",
	ч: "ch",
	ш: "sh",
	щ: "sch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya"
};
function slugify(value) {
	const lower = value.toLowerCase().replace(/ё/g, "е");
	let out = "";
	for (const ch of lower) out += TR[ch] ?? ch;
	return out.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
}
function modelSlug(name, years) {
	return slugify(`${name}${years ? `-${years}` : ""}`);
}
//#endregion
export { slugify as n, modelSlug as t };

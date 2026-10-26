import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-D8MIj47c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news-BDsxelsP.js
var import_jsx_runtime = require_jsx_runtime();
var NEWS = [
	{
		title: "Как устроен заказ",
		date: "12 марта 2026",
		text: "Каталог открыт без регистрации. Аккаунт нужен, чтобы заявка не потерялась: телефон, состав и сумма остаются в кабинете. Менеджер перезванивает и подтверждает, что б/у деталь ещё в наличии."
	},
	{
		title: "Фото иногда показывает весь узел",
		date: "2 февраля 2026",
		text: "Поставщик может снять головку блока целиком, а в названии будет только постель распредвала. Цена относится к тому, что написано в наименовании. Смотрите примечание и OEM, не только снимок."
	},
	{
		title: "Два склада",
		date: "20 января 2026",
		text: "Основной склад — позиции, которые поставщик пометил как лежащие на складе. Дополнительный — под заказ с разборок. Оба раздела листаются по 24 карточки, чтобы страница не вставала на сотнях тысяч строк."
	}
];
function NewsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-4xl tracking-wide",
		children: "Новости"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 grid gap-4",
		children: NEWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "border border-line bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wider text-muted",
					children: item.date
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: item.text
				})
			]
		}, item.title))
	})] });
}
//#endregion
export { NewsPage as component };

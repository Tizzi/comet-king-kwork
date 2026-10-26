import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-D8MIj47c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/delivery-DuU7--qg.js
var import_jsx_runtime = require_jsx_runtime();
function DeliveryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-4xl tracking-wide",
		children: "Доставка и оплата"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-line bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Доставка"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 grid gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Самовывоз со склада в Нижнем Новгороде — после подтверждения, что деталь ещё на месте." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Отправка транспортной компанией по России. Трек присылаем в ответ на заявку." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Крупногабарит — бампер, дверь, капот, крыло, балка — считается отдельно, в цене карточки его доставки нет." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Перед отправкой сверяем фото и примечание. Если на снимке весь узел, цена в карточке относится к названию позиции, не ко всему узлу." })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border border-line bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Оплата"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: "Онлайн-эквайринг пока не подключён. Много позиций б/у и с разборок, которые принимают перевод на карту, а не на расчётный счёт."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: "Сейчас схема такая: заявка с сайта, звонок, резерв, оплата тем способом, который принимает конкретный поставщик. Кнопку оплаты добавим, когда расчёты пойдут через ИП или ООО."
				})
			]
		})]
	})] });
}
//#endregion
export { DeliveryPage as component };

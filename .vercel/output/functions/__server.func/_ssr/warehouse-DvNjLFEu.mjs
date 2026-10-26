import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as sellPrice, n as formatCount, o as useCurrentUserState, r as formatMoney, s as useShop, t as Shell } from "./shell-D8MIj47c.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-by4BGCsA.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { a as useCatalog, t as catalogMeta } from "./use-catalog-Gadq4JJ0.mjs";
import { n as classifyPart } from "./groups-QY9_H2hi.mjs";
import { n as slugify } from "./slug-D3UUeuvz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/warehouse-DvNjLFEu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEED_FIELDS = [
	{
		key: "name",
		label: "Наименование",
		required: true,
		hints: [
			"наименование",
			"название",
			"name",
			"title",
			"товар"
		]
	},
	{
		key: "brand",
		label: "Марка",
		required: true,
		hints: [
			"марка",
			"brand",
			"make"
		]
	},
	{
		key: "model",
		label: "Модель",
		required: true,
		hints: ["модель", "model"]
	},
	{
		key: "price",
		label: "Цена",
		required: true,
		hints: [
			"цена",
			"price",
			"стоимость"
		]
	},
	{
		key: "photos",
		label: "Фото",
		hints: [
			"фото",
			"photo",
			"image",
			"картин",
			"изображ"
		]
	},
	{
		key: "sku",
		label: "Артикул склада",
		hints: [
			"артикул склада",
			"артикул",
			"sku",
			"код склада"
		]
	},
	{
		key: "oem",
		label: "Номер OEM",
		hints: [
			"oem",
			"номер oem",
			"оригинал"
		]
	},
	{
		key: "engine",
		label: "Двигатель",
		hints: [
			"двигатель",
			"engine",
			"мотор"
		]
	},
	{
		key: "year",
		label: "Год",
		hints: ["год", "year"]
	},
	{
		key: "note",
		label: "Примечание",
		hints: [
			"примечание",
			"описание",
			"comment",
			"note"
		]
	},
	{
		key: "qty",
		label: "Количество",
		hints: [
			"колич",
			"qty",
			"остаток"
		]
	},
	{
		key: "condition",
		label: "Новая / БУ",
		hints: [
			"новая",
			"состояние",
			"condition",
			"б/у",
			"бу"
		]
	},
	{
		key: "repl",
		label: "Номера замен",
		hints: [
			"замен",
			"кросс",
			"cross"
		]
	},
	{
		key: "group",
		label: "Группа",
		hints: [
			"группа",
			"категор",
			"раздел"
		]
	}
];
function detectDelimiter(text) {
	const line = text.split(/\r?\n/).find((row) => row.trim()) ?? "";
	const scored = [
		{
			d: "	",
			n: (line.match(/\t/g) ?? []).length
		},
		{
			d: ";",
			n: (line.match(/;/g) ?? []).length
		},
		{
			d: ",",
			n: (line.match(/,/g) ?? []).length
		}
	].sort((a, b) => b.n - a.n);
	return scored[0].n > 0 ? scored[0].d : ",";
}
function parseDelimited(text, delimiter) {
	const rows = [];
	let row = [];
	let cur = "";
	let quoted = false;
	const src = text.replace(/^\uFEFF/, "");
	for (let i = 0; i < src.length; i++) {
		const ch = src[i];
		if (quoted) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cur += "\"";
					i += 1;
				} else quoted = false;
			} else cur += ch;
		} else if (ch === "\"") quoted = true;
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
function tableFromDelimited(text, delimiter) {
	const matrix = parseDelimited(text, delimiter);
	if (matrix.length < 2) return {
		headers: [],
		records: []
	};
	const headers = matrix[0].map((cell, index) => cell.trim() || `Колонка ${index + 1}`);
	return {
		headers,
		records: matrix.slice(1, 8e3).map((cells) => {
			const record = {};
			headers.forEach((header, index) => {
				record[header] = (cells[index] ?? "").trim();
			});
			return record;
		})
	};
}
function guessMapping(headers) {
	const mapping = {};
	const used = /* @__PURE__ */ new Set();
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
function parseXmlTable(text) {
	const doc = new DOMParser().parseFromString(text, "application/xml");
	if (doc.querySelector("parsererror")) return null;
	const counts = /* @__PURE__ */ new Map();
	for (const el of doc.getElementsByTagName("*")) if (el.children.length >= 2) counts.set(el.tagName, (counts.get(el.tagName) ?? 0) + 1);
	let best = "";
	let bestCount = 1;
	for (const [name, count] of counts) if (count > bestCount && name !== doc.documentElement?.tagName) {
		best = name;
		bestCount = count;
	}
	if (!best) return null;
	const headers = /* @__PURE__ */ new Set();
	const records = [...doc.getElementsByTagName(best)].slice(0, 8e3).map((node) => {
		const record = {};
		for (const child of node.children) {
			headers.add(child.tagName);
			record[child.tagName] = (child.textContent ?? "").trim();
		}
		return record;
	});
	return {
		headers: [...headers],
		records
	};
}
function parsePrice(raw) {
	const cleaned = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
	const value = Number(cleaned);
	return Number.isFinite(value) ? Math.round(value) : 0;
}
function splitModel(model) {
	const match = model.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
	if (!match) return {
		name: model.trim(),
		years: ""
	};
	return {
		name: match[1].trim(),
		years: match[2].trim()
	};
}
function rowsToParts(records, mapping, profile) {
	const parts = [];
	const seen = /* @__PURE__ */ new Set();
	records.forEach((record, index) => {
		const read = (key) => {
			const column = mapping[key];
			return column ? (record[column] ?? "").trim() : "";
		};
		const name = read("name");
		const brand = read("brand");
		const price = parsePrice(read("price"));
		if (!name || !brand || !price) return;
		const split = splitModel(read("model"));
		const sku = read("sku") || `${slugify(brand)}-${slugify(name).slice(0, 24)}-${index + 1}`;
		const id = `${profile.id}-${sku}`;
		if (seen.has(id)) return;
		seen.add(id);
		const note = read("note");
		const groupRaw = read("group").toLowerCase();
		const known = [
			"engine",
			"cooling",
			"fuel",
			"exhaust",
			"transmission",
			"suspension",
			"brakes",
			"climate",
			"electric",
			"optics",
			"body",
			"interior",
			"exterior",
			"other"
		];
		const photos = read("photos").split(/[,|\s]+/).map((item) => item.trim()).filter((item) => item.startsWith("http")).slice(0, 4);
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
			profileId: profile.id
		});
	});
	return parts;
}
var SAMPLE_PRICE = `Наименование товара;Марка;Модель;Номер OEM;Артикул склада;Двигатель;Год;Примечание Описание;Колличество;Цена;Фотография
Фара передняя левая;Peugeot;307 (2001 - 2008);6204S3;demo-1001;1.6 Бензин;2004;Европейская. Мелкие потёртости;1;4200;https://i0775.ru/i/2108/ff5/ff58cf1ea316eae0071124045e1a5202.jpg
Капот;Renault;Megane 2 (2002 - 2008);;demo-1002;;2006;Цена за железо;1;6500;
Рычаг передний левый;Citroen;Xsara (1997 - 2006);;demo-1003;;2001;Сайлентблок под замену;1;1800;
Блок АБС;Citroen;C4 Picasso 1 (2006 - 2013);9661963780;demo-1004;;2008;ESP;1;8900;`;
function publicHttps(raw) {
	let url;
	try {
		url = new URL(String(raw ?? "").trim());
	} catch {
		throw new Error("Некорректная ссылка");
	}
	if (url.protocol !== "https:") throw new Error("Нужна ссылка, которая начинается с https");
	const host = url.hostname.toLowerCase();
	if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) throw new Error("Внутренние адреса скачивать нельзя");
	return url.toString();
}
var pullPrice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((url) => publicHttps(url)).handler(createSsrRpc("1ddf8600ec1004fb47c786b31d6b5697ff658c5ec5c9cafcb8c7da7e3184f3c5"));
function WarehousePage() {
	const { ms, parts } = useCatalog();
	const markup = useShop((state) => state.markup);
	const setMarkup = useShop((state) => state.setMarkup);
	const profiles = useShop((state) => state.profiles);
	const saveImport = useShop((state) => state.saveImport);
	const removeProfile = useShop((state) => state.removeProfile);
	const { user, isPending } = useCurrentUserState();
	const [headers, setHeaders] = (0, import_react.useState)([]);
	const [records, setRecords] = (0, import_react.useState)([]);
	const [mapping, setMapping] = (0, import_react.useState)({});
	const [sourceName, setSourceName] = (0, import_react.useState)("Автофранция");
	const [supplier, setSupplier] = (0, import_react.useState)("ИП Лиора В.Л.");
	const [url, setUrl] = (0, import_react.useState)("");
	const [warehouse, setWarehouse] = (0, import_react.useState)("extra");
	const [feedMarkup, setFeedMarkup] = (0, import_react.useState)({
		percent: 15,
		fixed: 0,
		round: 10
	});
	const [schedule, setSchedule] = (0, import_react.useState)("manual");
	const [error, setError] = (0, import_react.useState)("");
	const [info, setInfo] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const preview = (0, import_react.useMemo)(() => {
		if (!records.length) return [];
		return rowsToParts(records.slice(0, 5), mapping, {
			id: "preview",
			supplier,
			warehouse
		}).map((part) => ({
			...part,
			sell: sellPrice(part.price, feedMarkup)
		}));
	}, [
		records,
		mapping,
		supplier,
		warehouse,
		feedMarkup
	]);
	function takeTable(nextHeaders, nextRecords) {
		setHeaders(nextHeaders);
		setRecords(nextRecords);
		setMapping(guessMapping(nextHeaders));
		setError(nextRecords.length ? "" : "В файле нет строк");
		setInfo(nextRecords.length ? `Разобрали ${formatCount(nextRecords.length)} строк и ${nextHeaders.length} колонок.` : "");
	}
	function takeText(text) {
		const trimmed = text.trim();
		if (!trimmed) return;
		if (trimmed.startsWith("<")) {
			const xml = parseXmlTable(trimmed);
			if (!xml) {
				setError("XML не похож на прайс: нет повторяющегося блока товара");
				return;
			}
			takeTable(xml.headers, xml.records);
			return;
		}
		const table = tableFromDelimited(trimmed, detectDelimiter(trimmed));
		takeTable(table.headers, table.records);
	}
	async function onFile(file) {
		setBusy(true);
		setError("");
		try {
			const lower = file.name.toLowerCase();
			if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
				const XLSX = await import("../_libs/xlsx.mjs").then((n) => n.t);
				const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
				const sheet = book.Sheets[book.SheetNames[0]];
				const rows = XLSX.utils.sheet_to_json(sheet, {
					defval: "",
					raw: false
				});
				const nextHeaders = Object.keys(rows[0] ?? {});
				takeTable(nextHeaders, rows.slice(0, 8e3).map((row) => {
					const record = {};
					for (const header of nextHeaders) record[header] = String(row[header] ?? "").trim();
					return record;
				}));
			} else takeText(await file.text());
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Файл не прочитался");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-wide",
			children: "Конструктор прайса"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 max-w-3xl text-sm text-muted",
			children: [
				"У поставщиков разные колонки: где-то CSV, где-то Excel, где-то XML. Здесь колонка прайса садится на поле карточки. Текущая витрина уже собрана из файла на ",
				formatCount(catalogMeta.total),
				" позиций",
				ms > 0 ? `, индекс в браузере собрался за ${ms} мс` : "",
				". В списке всегда 24 строки."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 border border-line bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Наценка всей витрины"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Базовая цена в прайсе не переписывается. Процент, добавка и округление применяются при показе. Свои поставщики ниже могут иметь отдельную наценку."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkupFields, {
					value: markup,
					onChange: setMarkup
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 border border-line bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Новая выгрузка"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Название профиля",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: sourceName,
								onChange: (event) => setSourceName(event.target.value),
								className: "h-11 w-full border border-line bg-paper px-3"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Поставщик на карточке",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: supplier,
								onChange: (event) => setSupplier(event.target.value),
								className: "h-11 w-full border border-line bg-paper px-3"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Склад",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: warehouse,
								onChange: (event) => setWarehouse(event.target.value),
								className: "h-11 w-full border border-line bg-paper px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "extra",
									children: "Дополнительный, под заказ"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "main",
									children: "Основной склад"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Автозапуск",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: schedule,
								onChange: (event) => setSchedule(event.target.value),
								className: "h-11 w-full border border-line bg-paper px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "manual",
									children: "Вручную"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "daily",
									children: "Раз в сутки по ссылке"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-medium",
					children: "Наценка этого поставщика"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkupFields, {
					value: feedMarkup,
					onChange: setFeedMarkup
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-11 cursor-pointer items-center border border-ink bg-ink px-4 text-sm font-semibold text-paper",
						children: [busy ? "Читаем…" : "Файл CSV, XML или Excel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: ".csv,.txt,.tsv,.xml,.xlsx,.xls",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (file) onFile(file);
								event.target.value = "";
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 border border-line px-4 text-sm",
						onClick: () => takeText(SAMPLE_PRICE),
						children: "Пример колонок"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: url,
						onChange: (event) => setUrl(event.target.value),
						placeholder: "https://поставщик/price.csv",
						className: "h-11 flex-1 border border-line bg-paper px-3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 border border-line px-4 text-sm",
						onClick: () => {
							if (!user) {
								setError("Ссылку скачивает сервер, для этого нужен вход.");
								return;
							}
							setBusy(true);
							setError("");
							pullPrice({ data: url }).then((result) => takeText(result.text)).catch((reason) => setError(reason instanceof Error ? reason.message : "Ссылка не скачалась")).finally(() => setBusy(false));
						},
						children: "Скачать прайс"
					})]
				}),
				!isPending && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Файл с компьютера грузится без входа. Ссылка поставщика — после ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-blue",
							children: "входа"
						}),
						", чтобы обойти запрет браузера на чужой сайт."
					]
				}),
				headers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Колонка прайса → поле карточки"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2",
							children: FEED_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [field.label, "required" in field && field.required ? " *" : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: mapping[field.key] ?? "",
									onChange: (event) => setMapping({
										...mapping,
										[field.key]: event.target.value
									}),
									className: "mt-1 h-11 w-full border border-line bg-paper px-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Не использовать"
									}), headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: header,
										children: header
									}, header))]
								})]
							}, field.key))
						}),
						preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 pr-3 font-medium",
											children: "Наименование"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 pr-3 font-medium",
											children: "Марка"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 pr-3 font-medium",
											children: "Группа"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-2 font-medium",
											children: "Цена"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: part.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 pr-3",
											children: [
												part.brand,
												" ",
												part.model
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 pr-3",
											children: part.group
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 tabular-nums",
											children: formatMoney(part.sell)
										})
									]
								}, part.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 h-12 bg-red px-5 font-semibold text-red-ink",
							onClick: () => {
								const id = `${slugify(sourceName)}-${Date.now().toString(36)}`;
								const built = rowsToParts(records, mapping, {
									id,
									supplier: supplier || sourceName,
									warehouse
								});
								if (!built.length) {
									setError("Ни одна строка не собралась. Нужны наименование, марка и цена.");
									return;
								}
								const profile = {
									id,
									name: sourceName || "Поставщик",
									supplier: supplier || sourceName,
									url,
									warehouse,
									markup: feedMarkup,
									schedule,
									updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
									lastCount: built.length
								};
								saveImport(profile, built);
								setInfo(built.length > 350 ? `В витрину вошло ${formatCount(built.length)} позиций. Такой объём живёт, пока открыта вкладка: браузер не обязан хранить миллионы строк. На сервере те же карточки пишутся пачками в базу.` : `В витрину вошло ${formatCount(built.length)}. Ищите по марке или артикулу.`);
								setError("");
							},
							children: "Разложить по каталогу"
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-red",
					children: error
				}),
				info && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm",
					children: info
				})
			]
		}),
		profiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 border border-line bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Сохранённые профили"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line",
				children: profiles.map((profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center justify-between gap-2 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: profile.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" · ",
							formatCount(profile.lastCount),
							" · наценка ",
							profile.markup.percent,
							"% · ",
							profile.schedule === "daily" ? "раз в сутки" : "вручную"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-muted hover:text-red",
						onClick: () => removeProfile(profile.id),
						children: "Убрать"
					})]
				}, profile.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Как выгрузить самому"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 grid list-decimal gap-2 pl-5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Скачайте прайс или откройте ссылку поставщика. Excel можно не пересохранять." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Проверьте, что наименование, марка, модель и цена сели в свои поля. Остальное по желанию." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Поставьте наценку и округление: 10 ₽ удобно для мелких позиций, 100 ₽ — для кузова." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Нажмите «Разложить по каталогу». Строка попадёт в марку, модель и группу. Группа ставится по названию, если в прайсе её нет." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Повторная загрузка того же профиля заменяет его позиции, чужие прайсы не трогает." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ссылка с пометкой «раз в сутки» — задание для сервера. Здесь оно запоминается, скачивание запускается кнопкой, пока магазин открыт в браузере." })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "border border-line bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Почему не скрипит на сотнях тысяч"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Страница не рисует весь прайс. Поиск идёт по индексу, на экран выходят 24 карточки." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Фото остаются ссылками. В списке одно изображение, и то ленивое. В базу байты картинок не кладём." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Сейчас в памяти ",
							formatCount(parts?.length ?? catalogMeta.total),
							" карточек одного файла. Это проверка скорости, не потолок."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "На боевом объёме в 10 млн строк тот же конструктор колонок пишет пачками в Postgres, а ищет Meilisearch или свой OpenSearch. Платить есть за диск сервера, не за Битрикс." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WordPress и OpenCart на таком объёме как раз и открывались минутами: они читают каталог как таблицу магазина, а не как поисковый индекс." })
					]
				})]
			})]
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
function MarkupFields({ value, onChange }) {
	const patch = (part) => onChange({
		...value,
		...part
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 grid gap-3 sm:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Процент", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					value: value.percent,
					onChange: (event) => patch({ percent: Number(event.target.value) }),
					className: "mt-1 h-11 w-full border border-line bg-paper px-3 text-ink tabular-nums"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Плюс, ₽", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					value: value.fixed,
					onChange: (event) => patch({ fixed: Number(event.target.value) }),
					className: "mt-1 h-11 w-full border border-line bg-paper px-3 text-ink tabular-nums"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Округлять до", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: value.round,
					onChange: (event) => patch({ round: Number(event.target.value) }),
					className: "mt-1 h-11 w-full border border-line bg-paper px-3 text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 1,
							children: "1 ₽"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 10,
							children: "10 ₽"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 50,
							children: "50 ₽"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 100,
							children: "100 ₽"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { WarehousePage as component };

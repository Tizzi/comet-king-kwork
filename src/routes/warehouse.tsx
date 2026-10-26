import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { catalogMeta } from "@/data/meta";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { Stock } from "@/lib/catalog";
import {
  FEED_FIELDS,
  SAMPLE_PRICE,
  detectDelimiter,
  guessMapping,
  parseXmlTable,
  rowsToParts,
  tableFromDelimited,
  type Mapping,
} from "@/lib/feed";
import { formatCount, formatMoney, sellPrice, type Markup } from "@/lib/money";
import { pullPrice } from "@/lib/pull-price";
import { useShop, type FeedProfile } from "@/lib/shop-store";
import { slugify } from "@/lib/slug";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/warehouse")({
  component: WarehousePage,
});

function WarehousePage() {
  const { ms, parts } = useCatalog();
  const markup = useShop((state) => state.markup);
  const setMarkup = useShop((state) => state.setMarkup);
  const profiles = useShop((state) => state.profiles);
  const saveImport = useShop((state) => state.saveImport);
  const removeProfile = useShop((state) => state.removeProfile);
  const { user, isPending } = useCurrentUserState();

  const [headers, setHeaders] = useState<string[]>([]);
  const [records, setRecords] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [sourceName, setSourceName] = useState("Автофранция");
  const [supplier, setSupplier] = useState("ИП Лиора В.Л.");
  const [url, setUrl] = useState("");
  const [warehouse, setWarehouse] = useState<Stock>("extra");
  const [feedMarkup, setFeedMarkup] = useState<Markup>({ percent: 15, fixed: 0, round: 10 });
  const [schedule, setSchedule] = useState<"manual" | "daily">("manual");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => {
    if (!records.length) return [];
    return rowsToParts(records.slice(0, 5), mapping, { id: "preview", supplier, warehouse }).map((part) => ({
      ...part,
      sell: sellPrice(part.price, feedMarkup),
    }));
  }, [records, mapping, supplier, warehouse, feedMarkup]);

  function takeTable(nextHeaders: string[], nextRecords: Record<string, string>[]) {
    setHeaders(nextHeaders);
    setRecords(nextRecords);
    setMapping(guessMapping(nextHeaders));
    setError(nextRecords.length ? "" : "В файле нет строк");
    setInfo(nextRecords.length ? `Разобрали ${formatCount(nextRecords.length)} строк и ${nextHeaders.length} колонок.` : "");
  }

  function takeText(text: string) {
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
    const delimiter = detectDelimiter(trimmed);
    const table = tableFromDelimited(trimmed, delimiter);
    takeTable(table.headers, table.records);
  }

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
        const XLSX = await import("xlsx");
        const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
        const sheet = book.Sheets[book.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
        const nextHeaders = Object.keys(rows[0] ?? {});
        takeTable(
          nextHeaders,
          rows.slice(0, 8000).map((row) => {
            const record: Record<string, string> = {};
            for (const header of nextHeaders) record[header] = String(row[header] ?? "").trim();
            return record;
          }),
        );
      } else {
        takeText(await file.text());
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Файл не прочитался");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <h1 className="font-display text-4xl tracking-wide">Конструктор прайса</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        У поставщиков разные колонки: где-то CSV, где-то Excel, где-то XML. Здесь колонка прайса садится на поле карточки. Текущая витрина уже собрана из файла на {formatCount(catalogMeta.total)} позиций
        {ms > 0 ? `, индекс в браузере собрался за ${ms} мс` : ""}. В списке всегда 24 строки.
      </p>

      <section className="mt-6 border border-line bg-card p-4">
        <h2 className="font-display text-2xl">Наценка всей витрины</h2>
        <p className="mt-1 text-sm text-muted">Базовая цена в прайсе не переписывается. Процент, добавка и округление применяются при показе. Свои поставщики ниже могут иметь отдельную наценку.</p>
        <MarkupFields value={markup} onChange={setMarkup} />
      </section>

      <section className="mt-4 border border-line bg-card p-4">
        <h2 className="font-display text-2xl">Новая выгрузка</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Название профиля">
            <input value={sourceName} onChange={(event) => setSourceName(event.target.value)} className="h-11 w-full border border-line bg-paper px-3" />
          </Field>
          <Field label="Поставщик на карточке">
            <input value={supplier} onChange={(event) => setSupplier(event.target.value)} className="h-11 w-full border border-line bg-paper px-3" />
          </Field>
          <Field label="Склад">
            <select value={warehouse} onChange={(event) => setWarehouse(event.target.value as Stock)} className="h-11 w-full border border-line bg-paper px-3">
              <option value="extra">Дополнительный, под заказ</option>
              <option value="main">Основной склад</option>
            </select>
          </Field>
          <Field label="Автозапуск">
            <select value={schedule} onChange={(event) => setSchedule(event.target.value as "manual" | "daily")} className="h-11 w-full border border-line bg-paper px-3">
              <option value="manual">Вручную</option>
              <option value="daily">Раз в сутки по ссылке</option>
            </select>
          </Field>
        </div>
        <p className="mt-3 text-sm font-medium">Наценка этого поставщика</p>
        <MarkupFields value={feedMarkup} onChange={setFeedMarkup} />

        <div className="mt-4 flex flex-wrap gap-2">
          <label className="inline-flex h-11 cursor-pointer items-center border border-ink bg-ink px-4 text-sm font-semibold text-paper">
            {busy ? "Читаем…" : "Файл CSV, XML или Excel"}
            <input
              type="file"
              accept=".csv,.txt,.tsv,.xml,.xlsx,.xls"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onFile(file);
                event.target.value = "";
              }}
            />
          </label>
          <button type="button" className="h-11 border border-line px-4 text-sm" onClick={() => takeText(SAMPLE_PRICE)}>
            Пример колонок
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://поставщик/price.csv" className="h-11 flex-1 border border-line bg-paper px-3" />
          <button
            type="button"
            className="h-11 border border-line px-4 text-sm"
            onClick={() => {
              if (!user) {
                setError("Ссылку скачивает сервер, для этого нужен вход.");
                return;
              }
              setBusy(true);
              setError("");
              void pullPrice({ data: url })
                .then((result) => takeText(result.text))
                .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Ссылка не скачалась"))
                .finally(() => setBusy(false));
            }}
          >
            Скачать прайс
          </button>
        </div>
        {!isPending && !user && <p className="mt-2 text-sm text-muted">Файл с компьютера грузится без входа. Ссылка поставщика — после <Link to="/login" className="text-blue">входа</Link>, чтобы обойти запрет браузера на чужой сайт.</p>}

        {headers.length > 0 && (
          <div className="mt-5">
            <h3 className="font-semibold">Колонка прайса → поле карточки</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {FEED_FIELDS.map((field) => (
                <label key={field.key} className="text-sm">
                  <span className="text-muted">{field.label}{"required" in field && field.required ? " *" : ""}</span>
                  <select
                    value={mapping[field.key] ?? ""}
                    onChange={(event) => setMapping({ ...mapping, [field.key]: event.target.value })}
                    className="mt-1 h-11 w-full border border-line bg-paper px-2"
                  >
                    <option value="">Не использовать</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            {preview.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-muted">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Наименование</th>
                      <th className="py-2 pr-3 font-medium">Марка</th>
                      <th className="py-2 pr-3 font-medium">Группа</th>
                      <th className="py-2 font-medium">Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((part) => (
                      <tr key={part.id} className="border-t border-line">
                        <td className="py-2 pr-3">{part.name}</td>
                        <td className="py-2 pr-3">{part.brand} {part.model}</td>
                        <td className="py-2 pr-3">{part.group}</td>
                        <td className="py-2 tabular-nums">{formatMoney(part.sell)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              type="button"
              className="mt-4 h-12 bg-red px-5 font-semibold text-red-ink"
              onClick={() => {
                const id = `${slugify(sourceName)}-${Date.now().toString(36)}`;
                const built = rowsToParts(records, mapping, { id, supplier: supplier || sourceName, warehouse });
                if (!built.length) {
                  setError("Ни одна строка не собралась. Нужны наименование, марка и цена.");
                  return;
                }
                const profile: FeedProfile = {
                  id,
                  name: sourceName || "Поставщик",
                  supplier: supplier || sourceName,
                  url,
                  warehouse,
                  markup: feedMarkup,
                  schedule,
                  updatedAt: new Date().toISOString(),
                  lastCount: built.length,
                };
                saveImport(profile, built);
                setInfo(
                  built.length > 350
                    ? `В витрину вошло ${formatCount(built.length)} позиций. Такой объём живёт, пока открыта вкладка: браузер не обязан хранить миллионы строк. На сервере те же карточки пишутся пачками в базу.`
                    : `В витрину вошло ${formatCount(built.length)}. Ищите по марке или артикулу.`,
                );
                setError("");
              }}
            >
              Разложить по каталогу
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red">{error}</p>}
        {info && <p className="mt-3 text-sm">{info}</p>}
      </section>

      {profiles.length > 0 && (
        <section className="mt-4 border border-line bg-card p-4">
          <h2 className="font-display text-2xl">Сохранённые профили</h2>
          <ul className="mt-3 divide-y divide-line">
            {profiles.map((profile) => (
              <li key={profile.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-muted"> · {formatCount(profile.lastCount)} · наценка {profile.markup.percent}% · {profile.schedule === "daily" ? "раз в сутки" : "вручную"}</span>
                </span>
                <button type="button" className="text-muted hover:text-red" onClick={() => removeProfile(profile.id)}>Убрать</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="border border-line bg-card p-4">
          <h2 className="font-display text-2xl">Как выгрузить самому</h2>
          <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm">
            <li>Скачайте прайс или откройте ссылку поставщика. Excel можно не пересохранять.</li>
            <li>Проверьте, что наименование, марка, модель и цена сели в свои поля. Остальное по желанию.</li>
            <li>Поставьте наценку и округление: 10 ₽ удобно для мелких позиций, 100 ₽ — для кузова.</li>
            <li>Нажмите «Разложить по каталогу». Строка попадёт в марку, модель и группу. Группа ставится по названию, если в прайсе её нет.</li>
            <li>Повторная загрузка того же профиля заменяет его позиции, чужие прайсы не трогает.</li>
            <li>Ссылка с пометкой «раз в сутки» — задание для сервера. Здесь оно запоминается, скачивание запускается кнопкой, пока магазин открыт в браузере.</li>
          </ol>
        </article>
        <article className="border border-line bg-card p-4">
          <h2 className="font-display text-2xl">Почему не скрипит на сотнях тысяч</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>Страница не рисует весь прайс. Поиск идёт по индексу, на экран выходят 24 карточки.</li>
            <li>Фото остаются ссылками. В списке одно изображение, и то ленивое. В базу байты картинок не кладём.</li>
            <li>Сейчас в памяти {formatCount(parts?.length ?? catalogMeta.total)} карточек одного файла. Это проверка скорости, не потолок.</li>
            <li>На боевом объёме в 10 млн строк тот же конструктор колонок пишет пачками в Postgres, а ищет Meilisearch или свой OpenSearch. Платить есть за диск сервера, не за Битрикс.</li>
            <li>WordPress и OpenCart на таком объёме как раз и открывались минутами: они читают каталог как таблицу магазина, а не как поисковый индекс.</li>
          </ul>
        </article>
      </section>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm">
      <span className="text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function MarkupFields({ value, onChange }: { value: Markup; onChange: (next: Markup) => void }) {
  const patch = (part: Partial<Markup>) => onChange({ ...value, ...part });
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-3">
      <label className="text-sm text-muted">
        Процент
        <input type="number" value={value.percent} onChange={(event) => patch({ percent: Number(event.target.value) })} className="mt-1 h-11 w-full border border-line bg-paper px-3 text-ink tabular-nums" />
      </label>
      <label className="text-sm text-muted">
        Плюс, ₽
        <input type="number" value={value.fixed} onChange={(event) => patch({ fixed: Number(event.target.value) })} className="mt-1 h-11 w-full border border-line bg-paper px-3 text-ink tabular-nums" />
      </label>
      <label className="text-sm text-muted">
        Округлять до
        <select value={value.round} onChange={(event) => patch({ round: Number(event.target.value) })} className="mt-1 h-11 w-full border border-line bg-paper px-3 text-ink">
          <option value={1}>1 ₽</option>
          <option value={10}>10 ₽</option>
          <option value={50}>50 ₽</option>
          <option value={100}>100 ₽</option>
        </select>
      </label>
    </div>
  );
}

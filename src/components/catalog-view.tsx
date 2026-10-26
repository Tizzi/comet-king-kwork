import { Link } from "@tanstack/react-router";
import { queryParts, stockLabel, type Part, type PartQuery } from "@/lib/catalog";
import { GROUPS, groupTitle } from "@/lib/groups";
import { formatMoney } from "@/lib/money";
import { useShop } from "@/lib/shop-store";
import { PartPhoto } from "@/components/part-photo";

export function CatalogView({
  parts,
  query,
  priceOf,
  onQuery,
}: {
  parts: Part[] | null;
  query: PartQuery;
  priceOf: (part: Part) => number;
  onQuery: (next: PartQuery) => void;
}) {
  const addToCart = useShop((state) => state.addToCart);

  if (!parts) {
    return <p className="border border-line bg-card px-4 py-8 text-sm text-muted">Собираем индекс склада. В список попадут 24 карточки, не вся база.</p>;
  }

  const scoped = parts.filter((part) => matchBase(part, query));
  const result = queryParts(parts, query, priceOf);
  const visibleGroups = GROUPS.filter((group) => scoped.some((part) => part.group === group.id));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-muted tabular-nums">{result.total.toLocaleString("ru-RU")} позиций</p>
        <label className="text-sm text-muted">
          Сортировка
          <select
            value={query.sort || "price-asc"}
            onChange={(event) => onQuery({ ...query, sort: event.target.value as PartQuery["sort"], page: 1 })}
            className="ml-2 h-11 border border-line bg-card px-2 text-ink"
          >
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="name">По названию</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        <FilterChip active={!query.group} onClick={() => onQuery({ ...query, group: "", page: 1 })}>Все группы</FilterChip>
        {visibleGroups.map((group) => (
          <FilterChip key={group.id} active={query.group === group.id} onClick={() => onQuery({ ...query, group: group.id, page: 1 })}>
            {group.title}
          </FilterChip>
        ))}
      </div>
      {result.items.length === 0 ? (
        <p className="mt-6 border border-dashed border-line bg-card px-4 py-10 text-center text-sm text-muted">
          В этом срезе пусто. Смените группу или загрузите прайс в конструкторе.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {result.items.map((part) => {
            const price = priceOf(part);
            return (
              <li key={part.id} className="flex flex-wrap gap-3 py-3">
                <Link to="/part/$id" params={{ id: part.id }} className="block w-24 shrink-0">
                  <PartPhoto src={part.photos[0]} alt="" className="aspect-square w-full" />
                </Link>
                <div className="min-w-0 flex-1 basis-48">
                  <Link to="/part/$id" params={{ id: part.id }} className="font-medium leading-snug hover:text-red">
                    {part.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {part.brand} {part.model} {part.years && `(${part.years})`}
                    {part.year && ` · ${part.year}`}
                    {part.engine && ` · ${part.engine}`}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="text-muted">{groupTitle(part.group)}</span>
                    {part.oem && <span> · OEM {part.oem}</span>}
                    <span> · арт. {part.id.replace(/^imp-[^-]+-/, "")}</span>
                  </p>
                  {part.note && <p className="mt-1 line-clamp-2 text-sm text-muted">{part.note}</p>}
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-40 sm:flex-col sm:items-end">
                  <div className="text-right">
                    {price !== part.price && <p className="text-xs text-muted line-through tabular-nums">{formatMoney(part.price)}</p>}
                    <p className="font-display text-2xl tabular-nums">{formatMoney(price)}</p>
                    <p className="text-xs text-muted">{part.condition} · {stockLabel(part.stock)}</p>
                  </div>
                  <button type="button" onClick={() => addToCart(part.id, 1)} className="h-11 bg-red px-4 text-sm font-semibold text-red-ink hover:opacity-90">
                    В заявку
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {result.pages > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pager label="Назад" disabled={result.page <= 1} onClick={() => onQuery({ ...query, page: result.page - 1 })} />
          <span className="px-2 text-sm tabular-nums text-muted">{result.page} / {result.pages}</span>
          <Pager label="Дальше" disabled={result.page >= result.pages} onClick={() => onQuery({ ...query, page: result.page + 1 })} />
        </div>
      )}
    </div>
  );
}

function matchBase(part: Part, query: PartQuery) {
  if (query.brand && part.brand !== query.brand) return false;
  if (query.model && part.model !== query.model) return false;
  if (query.years && part.years !== query.years) return false;
  if (query.stock && part.stock !== query.stock) return false;
  return true;
}

function FilterChip({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`h-10 shrink-0 border px-3 text-sm ${active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink"}`}>
      {children}
    </button>
  );
}

function Pager({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="h-11 border border-line bg-card px-4 text-sm disabled:opacity-40">
      {label}
    </button>
  );
}

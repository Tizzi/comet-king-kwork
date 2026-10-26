import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PartPhoto } from "@/components/part-photo";
import { Shell } from "@/components/shell";
import { stockLabel } from "@/lib/catalog";
import { groupTitle } from "@/lib/groups";
import { formatMoney } from "@/lib/money";
import { modelSlug, slugify } from "@/lib/slug";
import { useShop } from "@/lib/shop-store";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/part/$id")({
  component: PartPage,
});

function PartPage() {
  const { id } = Route.useParams();
  const { parts, priceOf } = useCatalog();
  const addToCart = useShop((state) => state.addToCart);
  const part = parts?.find((item) => item.id === id) ?? null;
  const [photo, setPhoto] = useState(0);
  const [added, setAdded] = useState(false);

  return (
    <Shell>
      {!parts && <p className="text-sm text-muted">Открываем карточку…</p>}
      {parts && !part && (
        <div>
          <h1 className="font-display text-4xl">Позиция не найдена</h1>
          <Link to="/search" search={{ q: id, brand: "", group: "", stock: "", page: 1, sort: "price-asc" }} className="mt-4 inline-block text-blue">Искать «{id}»</Link>
        </div>
      )}
      {part && (
        <article className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <PartPhoto src={part.photos[photo] ?? part.photos[0]} alt={part.name} className="aspect-square w-full border border-line" />
            {part.photos.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {part.photos.map((src, index) => (
                  <button key={src} type="button" onClick={() => setPhoto(index)} className={`shrink-0 border ${index === photo ? "border-ink" : "border-line"}`}>
                    <PartPhoto src={src} alt="" className="size-16" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-muted">
              <Link to="/brand/$slug" params={{ slug: slugify(part.brand) }} className="hover:text-red">{part.brand}</Link>
              {" / "}
              <Link to="/brand/$slug/$model" params={{ slug: slugify(part.brand), model: modelSlug(part.model || "bez-modeli", part.years) }} className="hover:text-red">
                {part.model || "Без модели"}
              </Link>
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">{part.name}</h1>
            <p className="mt-4 font-display text-4xl tabular-nums">{formatMoney(priceOf(part))}</p>
            {priceOf(part) !== part.price && <p className="text-sm text-muted">База поставщика {formatMoney(part.price)}, на витрине уже с наценкой.</p>}
            <p className="mt-2 text-sm">{part.condition} · {stockLabel(part.stock)} · {part.qty} шт.</p>
            <button
              type="button"
              className="mt-5 h-12 bg-red px-6 font-semibold text-red-ink"
              onClick={() => {
                addToCart(part.id, 1);
                setAdded(true);
              }}
            >
              {added ? "Добавлено в заявку" : "В заявку"}
            </button>
            <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
              <Row label="Группа" value={groupTitle(part.group)} />
              <Row label="Марка" value={part.brand} />
              <Row label="Модель" value={`${part.model} ${part.years}`.trim()} />
              <Row label="Год авто" value={part.year} />
              <Row label="Двигатель" value={part.engine} />
              <Row label="OEM" value={part.oem} />
              <Row label="Артикул склада" value={part.id.replace(/^imp-[^-]+-/, "")} />
              <Row label="Замены" value={part.repl} />
              <Row label="Поставщик" value={part.supplier} />
              <Row label="Примечание" value={part.note} />
            </dl>
          </div>
        </article>
      )}
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-4">
      <dt className="w-36 shrink-0 text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

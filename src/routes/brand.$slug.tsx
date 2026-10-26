import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { catalogMeta } from "@/data/meta";
import { Shell } from "@/components/shell";
import { groupTitle } from "@/lib/groups";
import { formatCount } from "@/lib/money";
import { modelSlug } from "@/lib/slug";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/brand/$slug")({
  component: BrandPage,
});

function BrandPage() {
  const { slug } = Route.useParams();
  const { parts } = useCatalog();
  const fromMeta = catalogMeta.brands.find((brand) => brand.slug === slug);
  const showcase = catalogMeta.showcase.find((brand) => brand.slug === slug);
  const name = fromMeta?.name ?? showcase?.name ?? slug;

  const models = useMemo(() => {
    if (!parts) return fromMeta?.models ?? [];
    const mine = parts.filter((part) => part.brand === name || (fromMeta && part.brand === fromMeta.name));
    const map = new Map<string, { name: string; years: string; slug: string; count: number }>();
    for (const part of mine) {
      const key = modelSlug(part.model || "bez-modeli", part.years);
      const current = map.get(key) ?? { name: part.model || "Без модели", years: part.years, slug: key, count: 0 };
      current.count += 1;
      map.set(key, current);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "ru") || b.count - a.count);
  }, [parts, name, fromMeta]);

  return (
    <Shell>
      <p className="text-sm text-muted"><Link to="/" className="hover:text-red">Марки</Link> / {name}</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide">{name}</h1>
      <p className="mt-2 text-muted">{models.length ? "Выберите модель и годы выпуска." : "В текущей выгрузке этой марки нет. Добавьте её прайсом в конструкторе."}</p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {models.map((model) => (
          <li key={model.slug}>
            <Link to="/brand/$slug/$model" params={{ slug, model: model.slug }} className="flex items-center justify-between gap-3 py-3 hover:text-red">
              <span>
                <span className="font-medium">{model.name || "Без модели"}</span>
                {model.years && <span className="ml-2 text-sm text-muted">{model.years}</span>}
              </span>
              <span className="text-sm tabular-nums text-muted">{formatCount(model.count)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {fromMeta && !parts && (
        <p className="mt-3 text-sm text-muted">Группы уточнятся, когда индекс догрузится. {groupTitle("other")} и остальные разделы откроются внутри модели.</p>
      )}
    </Shell>
  );
}

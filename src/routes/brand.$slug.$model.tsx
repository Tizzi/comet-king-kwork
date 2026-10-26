import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { catalogMeta } from "@/data/meta";
import { CatalogView } from "@/components/catalog-view";
import { Shell } from "@/components/shell";
import { modelSlug } from "@/lib/slug";
import { useCatalog } from "@/lib/use-catalog";
import type { PartQuery } from "@/lib/catalog";

export const Route = createFileRoute("/brand/$slug/$model")({
  component: ModelPage,
});

function ModelPage() {
  const { slug, model: modelParam } = Route.useParams();
  const { parts, priceOf } = useCatalog();
  const brand = catalogMeta.brands.find((item) => item.slug === slug);
  const metaModel = brand?.models.find((item) => item.slug === modelParam);
  const [query, setQuery] = useState<PartQuery>({ page: 1, sort: "price-asc", group: "" });

  const resolved = useMemo(() => {
    if (metaModel && brand) {
      return { brand: brand.name, model: metaModel.name || "Без модели", years: metaModel.years };
    }
    const sample = parts?.find((part) => modelSlug(part.model || "bez-modeli", part.years) === modelParam);
    return sample ? { brand: sample.brand, model: sample.model || "Без модели", years: sample.years } : null;
  }, [brand, metaModel, parts, modelParam]);

  const scoped = useMemo(() => {
    if (!parts || !resolved) return parts;
    return parts.filter(
      (part) => part.brand === resolved.brand && (part.model || "Без модели") === resolved.model && part.years === resolved.years,
    );
  }, [parts, resolved]);

  return (
    <Shell>
      <p className="text-sm text-muted">
        <Link to="/" className="hover:text-red">Марки</Link>
        {" / "}
        <Link to="/brand/$slug" params={{ slug }} className="hover:text-red">{resolved?.brand ?? slug}</Link>
        {resolved && ` / ${resolved.model}`}
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-wide">
        {resolved ? `${resolved.brand} ${resolved.model}` : "Модель"}
      </h1>
      {resolved?.years && <p className="text-muted">{resolved.years}</p>}
      <div className="mt-6">
        <CatalogView
          parts={resolved ? scoped : parts ? [] : null}
          query={{ ...query, brand: resolved?.brand, model: resolved?.model === "Без модели" ? "" : resolved?.model, years: resolved?.years }}
          priceOf={priceOf}
          onQuery={setQuery}
        />
      </div>
    </Shell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CatalogView } from "@/components/catalog-view";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import type { PartQuery, Stock } from "@/lib/catalog";
import { useCatalog } from "@/lib/use-catalog";

type SearchParams = {
  q: string;
  brand: string;
  group: string;
  stock: "" | Stock;
  page: number;
  sort: NonNullable<PartQuery["sort"]>;
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
    brand: typeof search.brand === "string" ? search.brand : "",
    group: typeof search.group === "string" ? search.group : "",
    stock: search.stock === "main" || search.stock === "extra" ? search.stock : "",
    page: Math.max(1, Number(search.page) || 1),
    sort: search.sort === "price-desc" || search.sort === "name" ? search.sort : "price-asc",
  }),
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const { parts, priceOf, ms } = useCatalog();
  return (
    <Shell>
      <h1 className="font-display text-4xl tracking-wide">Поиск</h1>
      <div className="mt-4">
        <SearchBox initial={params.q} large />
      </div>
      {ms > 0 && <p className="mt-3 text-sm text-muted">Индекс собран за {ms} мс. На странице не больше 24 карточек.</p>}
      <div className="mt-4">
        <CatalogView
          parts={parts}
          priceOf={priceOf}
          query={params}
          onQuery={(next) => {
            void navigate({
              search: {
                q: next.q ?? params.q,
                brand: next.brand ?? "",
                group: next.group ?? "",
                stock: next.stock ?? "",
                page: next.page ?? 1,
                sort: next.sort ?? "price-asc",
              },
            });
          }}
        />
      </div>
    </Shell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CatalogView } from "@/components/catalog-view";
import { Shell } from "@/components/shell";
import type { PartQuery, Stock } from "@/lib/catalog";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/stock/$wh")({
  component: StockPage,
});

function StockPage() {
  const { wh } = Route.useParams();
  const stock: Stock = wh === "main" ? "main" : "extra";
  const { parts, priceOf } = useCatalog();
  const [query, setQuery] = useState<PartQuery>({ page: 1, sort: "price-asc", stock, group: "" });
  const title = stock === "main" ? "Основной склад" : "Дополнительный склад";
  return (
    <Shell>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link to="/stock/$wh" params={{ wh: "main" }} className={stock === "main" ? "font-semibold text-red" : "text-muted"}>Основной</Link>
        <Link to="/stock/$wh" params={{ wh: "extra" }} className={stock === "extra" ? "font-semibold text-red" : "text-muted"}>Под заказ</Link>
      </div>
      <h1 className="mt-2 font-display text-4xl tracking-wide">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {stock === "main"
          ? "Позиции, у которых в примечании поставщика стоит «склад» — их можно смотреть и забирать быстрее."
          : "Остальное едет от разборок под заказ. Срок и состояние написаны в примечании карточки."}
      </p>
      <div className="mt-6">
        <CatalogView parts={parts} priceOf={priceOf} query={{ ...query, stock }} onQuery={(next) => setQuery({ ...next, stock })} />
      </div>
    </Shell>
  );
}

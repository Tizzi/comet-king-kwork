import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { suggestParts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { useCatalog } from "@/lib/use-catalog";

export function SearchBox({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  const navigate = useNavigate();
  const { parts, priceOf } = useCatalog();
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);

  useEffect(() => setQ(initial), [initial]);

  const hints = parts && q.trim().length > 1 ? suggestParts(parts, q) : [];

  return (
    <form
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        setOpen(false);
        void navigate({ to: "/search", search: { q: q.trim(), page: 1, sort: "price-asc", brand: "", group: "", stock: "" } });
      }}
    >
      <label className="sr-only" htmlFor={large ? "search-large" : "search-main"}>Поиск детали, OEM или артикула</label>
      <input
        id={large ? "search-large" : "search-main"}
        value={q}
        onChange={(event) => {
          setQ(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Капот, OEM, артикул склада…"
        className={`w-full border border-line bg-card pr-12 pl-4 text-ink outline-none placeholder:text-muted ${large ? "h-14 text-base" : "h-11 text-sm"}`}
      />
      <button type="submit" aria-label="Найти" className="absolute top-0 right-0 grid h-full w-12 place-items-center text-ink hover:text-red">
        <Search className="size-5" />
      </button>
      {open && hints.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full border border-line bg-card shadow-sm">
          {hints.map((part) => (
            <li key={part.id}>
              <Link
                to="/part/$id"
                params={{ id: part.id }}
                onClick={() => setOpen(false)}
                className="flex items-start justify-between gap-3 px-3 py-2 text-sm hover:bg-paper"
              >
                <span>
                  <span className="block font-medium">{part.name.split(",")[0]}</span>
                  <span className="text-muted">{part.brand} {part.model} {part.oem && `· ${part.oem}`}</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatMoney(priceOf(part))}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

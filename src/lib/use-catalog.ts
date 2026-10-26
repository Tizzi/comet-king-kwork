import { useEffect, useMemo, useState } from "react";
import { loadSeed, mergeParts, partPrice, type Part } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export function useCatalog() {
  const imports = useShop((state) => state.imports);
  const markup = useShop((state) => state.markup);
  const profiles = useShop((state) => state.profiles);
  const [seed, setSeed] = useState<Part[] | null>(null);
  const [ms, setMs] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadSeed()
      .then((result) => {
        if (!alive) return;
        setSeed(result.parts);
        setMs(result.ms);
      })
      .catch((reason: unknown) => {
        if (!alive) return;
        setError(reason instanceof Error ? reason.message : "Каталог не открылся");
        setSeed([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const parts = useMemo(() => (seed ? mergeParts(seed, imports) : null), [seed, imports]);
  const priceOf = useMemo(() => (part: Part) => partPrice(part, markup, profiles), [markup, profiles]);
  return { parts, ms, error, priceOf, markup };
}

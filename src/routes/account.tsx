import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatMoney } from "@/lib/money";
import { listRequests, type SavedRequest } from "@/lib/requests";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [rows, setRows] = useState<SavedRequest[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    listRequests()
      .then((list) => {
        if (alive) setRows(list);
      })
      .catch((reason: unknown) => {
        if (!alive) return;
        setError(reason instanceof Error ? reason.message : "История не открылась");
        setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  if (isPending) {
    return <Shell><div className="h-40 animate-pulse bg-card" /></Shell>;
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wide">Кабинет</h1>
        <UserButton />
      </div>
      <p className="mt-2 text-sm text-muted">{user.displayName || user.primaryEmail || "Клиент"}</p>
      <h2 className="mt-8 font-display text-2xl tracking-wide">Заявки</h2>
      {error && <p className="mt-3 text-sm text-red">{error}</p>}
      {rows === null && <div className="mt-4 h-24 animate-pulse bg-card" />}
      {rows && rows.length === 0 && (
        <p className="mt-4 text-sm text-muted">Пока пусто. <Link to="/" className="text-blue">Собрать детали</Link></p>
      )}
      <ul className="mt-4 grid gap-3">
        {rows?.map((row) => (
          <li key={row.id} className="border border-line bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">№{row.id} · {row.phone}</p>
              <p className="tabular-nums">{formatMoney(row.total)}</p>
            </div>
            <p className="text-xs text-muted">{row.createdAt.replace("T", " ").slice(0, 16)}</p>
            <ul className="mt-2 text-sm">
              {row.items.map((item) => (
                <li key={item.id}>{item.qty} × {item.name}</li>
              ))}
            </ul>
            {row.comment && <p className="mt-2 text-sm text-muted">{row.comment}</p>}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

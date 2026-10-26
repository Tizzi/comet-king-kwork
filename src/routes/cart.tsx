import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { PartPhoto } from "@/components/part-photo";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatMoney } from "@/lib/money";
import { createRequest } from "@/lib/requests";
import { useShop } from "@/lib/shop-store";
import { useCatalog } from "@/lib/use-catalog";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { parts, priceOf } = useCatalog();
  const cart = useShop((state) => state.cart);
  const setQty = useShop((state) => state.setQty);
  const removeFromCart = useShop((state) => state.removeFromCart);
  const clearCart = useShop((state) => state.clearCart);
  const { user, isPending } = useCurrentUserState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const lines = cart.map((line) => {
    const part = parts?.find((item) => item.id === line.id);
    return { line, part, price: part ? priceOf(part) : 0 };
  }).filter((row) => row.part);
  const total = lines.reduce((sum, row) => sum + row.price * row.line.qty, 0);

  return (
    <Shell>
      <h1 className="font-display text-4xl tracking-wide">Заявка</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">Оплата на сайте не списывается. Менеджер сверяет наличие б/у детали и перезванивает.</p>
      {!parts && <p className="mt-6 text-sm text-muted">Подгружаем позиции из корзины…</p>}
      {parts && lines.length === 0 && (
        <p className="mt-6 border border-dashed border-line bg-card px-4 py-10 text-center text-sm">
          Корзина пуста. <Link to="/" className="text-blue">Выбрать марку</Link>
        </p>
      )}
      {lines.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map(({ line, part, price }) => part && (
              <li key={line.id} className="flex gap-3 py-3">
                <PartPhoto src={part.photos[0]} alt="" className="size-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link to="/part/$id" params={{ id: part.id }} className="font-medium hover:text-red">{part.name}</Link>
                  <p className="text-sm text-muted">{part.brand} {part.model}</p>
                  <p className="mt-1 tabular-nums">{formatMoney(price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <input
                    aria-label="Количество"
                    type="number"
                    min={1}
                    max={99}
                    value={line.qty}
                    onChange={(event) => setQty(line.id, Number(event.target.value))}
                    className="h-11 w-16 border border-line bg-card px-2 tabular-nums"
                  />
                  <button type="button" onClick={() => removeFromCart(line.id)} className="text-sm text-muted hover:text-red">Убрать</button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="border border-line bg-card p-4">
            <p className="text-sm text-muted">Итого</p>
            <p className="font-display text-4xl tabular-nums">{formatMoney(total)}</p>
            {isPending && <div className="mt-4 h-40 animate-pulse bg-paper" />}
            {!isPending && !user && (
              <p className="mt-4 text-sm">
                Чтобы заявка осталась в кабинете, <Link to="/login" className="text-blue">войдите или зарегистрируйтесь</Link>. Корзина на этом устройстве сохранится.
              </p>
            )}
            {!isPending && user && done === null && (
              <form
                className="mt-4 grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSending(true);
                  setError("");
                  void createRequest({
                    data: {
                      name: name || user.displayName || "Клиент",
                      phone,
                      comment,
                      items: lines.map(({ line, part, price }) => ({
                        id: part!.id,
                        name: part!.name,
                        qty: line.qty,
                        price,
                        brand: part!.brand,
                        model: part!.model,
                      })),
                    },
                  })
                    .then((result) => {
                      setDone(result.id);
                      clearCart();
                    })
                    .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Не отправилось"))
                    .finally(() => setSending(false));
                }}
              >
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя" className="h-11 border border-line bg-paper px-3" />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" required className="h-11 border border-line bg-paper px-3" />
                <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Город, VIN, удобное время звонка" className="min-h-24 border border-line bg-paper px-3 py-2" />
                {error && <p className="text-sm text-red">{error}</p>}
                <button type="submit" disabled={sending} className="h-12 bg-red font-semibold text-red-ink disabled:opacity-60">
                  {sending ? "Отправляем…" : "Отправить заявку"}
                </button>
              </form>
            )}
            {done !== null && <p className="mt-4 text-sm">Заявка №{done} принята. Мы перезвоним. История лежит в кабинете.</p>}
          </aside>
        </div>
      )}
    </Shell>
  );
}

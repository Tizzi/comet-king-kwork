import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

const NEWS = [
  {
    title: "Как устроен заказ",
    date: "12 марта 2026",
    text: "Каталог открыт без регистрации. Аккаунт нужен, чтобы заявка не потерялась: телефон, состав и сумма остаются в кабинете. Менеджер перезванивает и подтверждает, что б/у деталь ещё в наличии.",
  },
  {
    title: "Фото иногда показывает весь узел",
    date: "2 февраля 2026",
    text: "Поставщик может снять головку блока целиком, а в названии будет только постель распредвала. Цена относится к тому, что написано в наименовании. Смотрите примечание и OEM, не только снимок.",
  },
  {
    title: "Два склада",
    date: "20 января 2026",
    text: "Основной склад — позиции, которые поставщик пометил как лежащие на складе. Дополнительный — под заказ с разборок. Оба раздела листаются по 24 карточки, чтобы страница не вставала на сотнях тысяч строк.",
  },
];

export const Route = createFileRoute("/news")({
  component: NewsPage,
});

function NewsPage() {
  return (
    <Shell>
      <h1 className="font-display text-4xl tracking-wide">Новости</h1>
      <div className="mt-6 grid gap-4">
        {NEWS.map((item) => (
          <article key={item.title} className="border border-line bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted">{item.date}</p>
            <h2 className="mt-1 font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm">{item.text}</p>
          </article>
        ))}
      </div>
    </Shell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/delivery")({
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <Shell>
      <h1 className="font-display text-4xl tracking-wide">Доставка и оплата</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="border border-line bg-card p-5">
          <h2 className="font-display text-2xl">Доставка</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>Самовывоз со склада в Нижнем Новгороде — после подтверждения, что деталь ещё на месте.</li>
            <li>Отправка транспортной компанией по России. Трек присылаем в ответ на заявку.</li>
            <li>Крупногабарит — бампер, дверь, капот, крыло, балка — считается отдельно, в цене карточки его доставки нет.</li>
            <li>Перед отправкой сверяем фото и примечание. Если на снимке весь узел, цена в карточке относится к названию позиции, не ко всему узлу.</li>
          </ul>
        </section>
        <section className="border border-line bg-card p-5">
          <h2 className="font-display text-2xl">Оплата</h2>
          <p className="mt-3 text-sm">Онлайн-эквайринг пока не подключён. Много позиций б/у и с разборок, которые принимают перевод на карту, а не на расчётный счёт.</p>
          <p className="mt-3 text-sm">Сейчас схема такая: заявка с сайта, звонок, резерв, оплата тем способом, который принимает конкретный поставщик. Кнопку оплаты добавим, когда расчёты пойдут через ИП или ООО.</p>
        </section>
      </div>
    </Shell>
  );
}

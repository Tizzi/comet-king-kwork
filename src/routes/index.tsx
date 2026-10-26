import { createFileRoute, Link } from "@tanstack/react-router";
import { catalogMeta } from "@/data/meta";
import { Shell } from "@/components/shell";
import { SearchBox } from "@/components/search-box";
import { formatCount } from "@/lib/money";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const brands = catalogMeta.showcase.filter((brand) => !(brand.count === 0 && /-\d+$/.test(brand.slug)));
  return (
    <Shell>
      <section className="grid items-center gap-6 border border-line bg-card lg:grid-cols-2">
        <img src="/hero-car.jpg" alt="Красный кузов в разборе, отдельно от голого шасси" className="h-64 w-full object-cover object-left sm:h-80 lg:h-full" />
        <div className="px-5 py-6 sm:px-8 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue">Склад б/у</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">Автозапчасти АльянсАвто</h1>
          <p className="mt-3 max-w-md text-lg">Новые и б/у на все марки и модели. Сейчас в индексе {formatCount(catalogMeta.total)} позиций с фото.</p>
          <Link to="/stock/$wh" params={{ wh: "main" }} className="mt-6 inline-flex h-11 items-center border-b-2 border-ink font-semibold tracking-wide">
            Подробнее
          </Link>
          <div className="mt-6">
            <SearchBox large />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl tracking-wide">Выберите марку</h2>
        <ol className="mt-2 grid gap-1 text-sm text-muted sm:grid-cols-3">
          <li>1. Марка автомобиля</li>
          <li>2. Модель и годы</li>
          <li>3. Группа детали или поиск по OEM</li>
        </ol>
        <div className="mt-5 columns-2 gap-x-6 sm:columns-3 lg:columns-6">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to="/brand/$slug"
              params={{ slug: brand.slug }}
              className={`block break-inside-avoid py-1.5 text-sm hover:text-red ${brand.count ? "text-ink" : "text-muted"}`}
            >
              {brand.name}
              {brand.count > 0 && <span className="ml-1 tabular-nums text-muted">{formatCount(brand.count)}</span>}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Фото по ссылке", "Картинки не лежат в базе. В списке грузится только первое фото, остальные — на карточке."],
          ["Цена с наценкой", "Базовая цена поставщика и наценка магазина считаются отдельно. Процент меняется сразу на витрине."],
          ["Заявка, не эквайринг", "Б/у и чужие разборки. Клиент оставляет телефон, оплату картой подключим, когда будет ИП или ООО."],
        ].map(([title, text]) => (
          <article key={title} className="border border-line bg-card p-4">
            <h3 className="font-display text-xl tracking-wide">{title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </article>
        ))}
      </section>
    </Shell>
  );
}

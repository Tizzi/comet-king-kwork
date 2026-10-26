export type Markup = { percent: number; fixed: number; round: number };

export const ZERO_MARKUP: Markup = { percent: 0, fixed: 0, round: 1 };

export function sellPrice(base: number, markup: Markup) {
  const raw = base * (1 + (Number(markup.percent) || 0) / 100) + (Number(markup.fixed) || 0);
  const step = Math.max(1, Number(markup.round) || 1);
  return Math.max(0, Math.round(raw / step) * step);
}

export function formatMoney(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

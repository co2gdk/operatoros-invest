export function formatNumber(value: number) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

export function formatMoney(value: number, currency: string) {
  return `${formatNumber(value)} ${currency}`;
}

export function formatHours(value: number) {
  return Math.round(Number(value))
    .toLocaleString("en-US")
    .replace(/,/g, " ");
}
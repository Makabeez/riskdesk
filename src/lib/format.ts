// U+2212 MINUS SIGN (distinct from hyphen-minus)
const MINUS = '−';

export function formatMoney(value: number): string {
  const abs = Math.abs(value);
  const s = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `$${s}`;
}

export function formatSignedMoney(value: number): string {
  if (value < 0) return `${MINUS}${formatMoney(Math.abs(value))}`;
  return `+${formatMoney(value)}`;
}

export function formatR(value: number): string {
  const abs = Math.abs(value);
  const s = abs.toFixed(2);
  if (value < 0) return `${MINUS}${s}R`;
  return `+${s}R`;
}

export function formatSize(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

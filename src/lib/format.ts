import { decimalPlaces, mul, fromInt, toFixed, type Ratio } from './decimal';

/** U+2212, the typographic minus used for negative values. */
export const MINUS = '−';

function groupThousands(fixed: string): string {
  const [int, frac] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac === undefined ? grouped : `${grouped}.${frac}`;
}

/** Splits a rounded value into its sign and grouped magnitude. */
function parts(a: Ratio, decimals: number): { negative: boolean; zero: boolean; body: string } {
  const fixed = toFixed(a, decimals);
  const negative = fixed.startsWith('-');
  const magnitude = negative ? fixed.slice(1) : fixed;
  return { negative, zero: /^[0.]+$/.test(magnitude), body: groupThousands(magnitude) };
}

/** "$1,234.56", or "−$149.40" when negative. */
export function formatMoney(a: Ratio): string {
  const { negative, body } = parts(a, 2);
  return `${negative ? MINUS : ''}$${body}`;
}

/** Like formatMoney, with an explicit "+" on gains: "+$198.80". */
export function formatSignedMoney(a: Ratio): string {
  const { negative, zero, body } = parts(a, 2);
  return `${negative ? MINUS : zero ? '' : '+'}$${body}`;
}

/** R multiple with 2 decimals and a sign: "+2.00R", "−1.50R". */
export function formatR(a: Ratio): string {
  const { negative, zero, body } = parts(a, 2);
  return `${negative ? MINUS : zero ? '' : '+'}${body}R`;
}

/** A size with exactly the instrument's lot-step decimals: "0.100". */
export function formatSize(a: Ratio, decimals: number): string {
  return parts(a, decimals).body;
}

/** A price exactly as entered, grouped, with at least 2 decimals: "60,000.00". */
export function formatPrice(a: Ratio): string {
  const decimals = Math.max(2, decimalPlaces(a) ?? 8);
  const { negative, body } = parts(a, decimals);
  return `${negative ? MINUS : ''}${body}`;
}

/** A plain number such as a leverage: "10", "12.5". */
export function formatPlain(a: Ratio): string {
  return formatPrice(a).replace(/\.?0+$/, '');
}

/** A ratio shown as a percentage with at most one decimal: "50%", "33.3%". */
export function formatPercent(a: Ratio): string {
  return `${parts(mul(a, fromInt(100)), 1).body.replace(/\.0$/, '')}%`;
}

/** Colour tone for a P&L or R value. */
export function toneOf(a: Ratio): 'gain' | 'loss' | undefined {
  const fixed = toFixed(a, 2);
  if (/^-?[0.]+$/.test(fixed)) return undefined;
  return fixed.startsWith('-') ? 'loss' : 'gain';
}

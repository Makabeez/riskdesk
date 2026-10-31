/**
 * Exact rational arithmetic on BigInt.
 *
 * Every money and size value in RiskDesk is computed exactly and rounded only
 * when it is displayed, so binary floating-point error can never push a
 * rounded-down position over the trader's risk limit.
 */
export interface Ratio {
  readonly n: bigint;
  /** Always positive; the fraction is kept in lowest terms. */
  readonly d: bigint;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function ratio(n: bigint, d: bigint = 1n): Ratio {
  if (d === 0n) throw new RangeError('Division by zero');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n < 0n ? -n : n, d);
  return g > 1n ? { n: n / g, d: d / g } : { n, d };
}

export const ZERO: Ratio = ratio(0n);

export const fromInt = (value: number | bigint): Ratio => ratio(BigInt(value));
export const pow10 = (exp: number): bigint => 10n ** BigInt(exp);

export const add = (a: Ratio, b: Ratio): Ratio => ratio(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Ratio, b: Ratio): Ratio => ratio(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Ratio, b: Ratio): Ratio => ratio(a.n * b.n, a.d * b.d);
export const div = (a: Ratio, b: Ratio): Ratio => ratio(a.n * b.d, a.d * b.n);
export const abs = (a: Ratio): Ratio => (a.n < 0n ? ratio(-a.n, a.d) : a);

export const sign = (a: Ratio): -1 | 0 | 1 => (a.n < 0n ? -1 : a.n > 0n ? 1 : 0);
export const cmp = (a: Ratio, b: Ratio): -1 | 0 | 1 => sign(sub(a, b));

/** Largest integer ≤ a. */
export function floor(a: Ratio): bigint {
  const q = a.n / a.d;
  return a.n < 0n && q * a.d !== a.n ? q - 1n : q;
}

/** Beyond this, an exponent cannot belong to any value RiskDesk accepts. */
const MAX_EXPONENT = 100;
const DECIMAL_RE = /^([+-]?)(\d+\.?\d*|\.\d+)(?:e([+-]?\d+))?$/i;

/** Parses "12", "-3.5", ".25" or "1e9" exactly. Returns null for anything else. */
export function parseDecimal(text: string): Ratio | null {
  const match = DECIMAL_RE.exec(text);
  if (!match) return null;
  const [, signText, body, expText] = match;
  const [intPart, fracPart = ''] = body.split('.');
  const exp = (expText ? Number(expText) : 0) - fracPart.length;
  if (Math.abs(exp) > MAX_EXPONENT) return null;
  const coef = BigInt((intPart || '0') + fracPart) * (signText === '-' ? -1n : 1n);
  return exp >= 0 ? ratio(coef * pow10(exp)) : ratio(coef, pow10(-exp));
}

/** Rounds half away from zero to a fixed number of decimals, e.g. "-149.40". */
export function toFixed(a: Ratio, decimals: number): string {
  const negative = a.n < 0n;
  const magnitude = negative ? -a.n : a.n;
  const scaled = (magnitude * pow10(decimals) * 2n + a.d) / (2n * a.d);
  let digits = scaled.toString();
  if (decimals > 0) {
    digits = digits.padStart(decimals + 1, '0');
    digits = `${digits.slice(0, -decimals)}.${digits.slice(-decimals)}`;
  }
  return negative && scaled !== 0n ? `-${digits}` : digits;
}

/** Number of decimals needed to write a exactly, or null if it never terminates. */
export function decimalPlaces(a: Ratio): number | null {
  let d = a.d;
  let twos = 0;
  let fives = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    twos++;
  }
  while (d % 5n === 0n) {
    d /= 5n;
    fives++;
  }
  return d === 1n ? Math.max(twos, fives) : null;
}

/** Shortest exact plain-decimal string, e.g. "3000" or "0.125". */
export function toPlain(a: Ratio): string {
  return toFixed(a, decimalPlaces(a) ?? 12);
}

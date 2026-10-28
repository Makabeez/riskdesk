import { cmp, fromInt, parseDecimal, sign, type Ratio } from './decimal';
import type { Instrument } from './instruments';

export type FieldResult = { ok: true; value: Ratio } | { ok: false; error: string };

const ok = (value: Ratio): FieldResult => ({ ok: true, value });
const fail = (error: string): FieldResult => ({ ok: false, error });

const MAX_BALANCE = fromInt(100_000_000);
const MAX_PRICE = fromInt(10_000_000);
const MIN_RISK = parseDecimal('0.1')!;
const MAX_RISK = fromInt(5);
const MIN_LEVERAGE = fromInt(1);
const MIN_FEE = fromInt(0);
const MAX_FEE = parseDecimal('0.1')!;

/** Accepts thousands separators only in valid positions, so "3,5" is never read as 35. */
const GROUPED_RE = /^[+-]?\d{1,3}(,\d{3})+(\.\d*)?$/;

/**
 * Reads a typed number. Tolerates surrounding spaces, thousands separators
 * and the field's own unit ("$", "%" or "x"); anything else is rejected.
 */
export function readNumber(text: string, unit?: { prefix?: string; suffix?: string }): Ratio | null {
  let s = text.trim();
  if (unit?.prefix && s.startsWith(unit.prefix)) s = s.slice(unit.prefix.length).trim();
  if (unit?.suffix && s.toLowerCase().endsWith(unit.suffix)) s = s.slice(0, -unit.suffix.length).trim();
  if (s.includes(',')) {
    if (!GROUPED_RE.test(s)) return null;
    s = s.replace(/,/g, '');
  }
  return parseDecimal(s);
}

export function validateBalance(text: string): FieldResult {
  const value = readNumber(text, { prefix: '$' });
  if (!value || sign(value) <= 0) return fail('Balance must be a positive number');
  if (cmp(value, MAX_BALANCE) > 0) return fail('Balance must be at most $100,000,000.00');
  return ok(value);
}

export function validateRisk(text: string): FieldResult {
  const value = readNumber(text, { suffix: '%' });
  if (!value || cmp(value, MIN_RISK) < 0 || cmp(value, MAX_RISK) > 0) {
    return fail('Risk must be between 0.1% and 5%');
  }
  return ok(value);
}

/** Fee per side, typed as a percent. Zero is allowed: it is the default. */
export function validateFee(text: string): FieldResult {
  const value = readNumber(text, { suffix: '%' });
  if (!value || cmp(value, MIN_FEE) < 0 || cmp(value, MAX_FEE) > 0) {
    return fail('Fee must be between 0% and 0.1%');
  }
  return ok(value);
}

/** Entry, stop loss and exit prices. `label` names the field in the error. */
export function validatePrice(text: string, label: string): FieldResult {
  const value = readNumber(text, { prefix: '$' });
  if (!value || sign(value) <= 0) return fail(`${label} must be a positive number`);
  if (cmp(value, MAX_PRICE) > 0) return fail(`${label} must be at most 10,000,000`);
  return ok(value);
}

/** Leverage above the instrument's cap is an error; it is never clamped. */
export function validateLeverage(text: string, instrument: Instrument): FieldResult {
  const value = readNumber(text, { suffix: 'x' });
  if (!value || sign(value) <= 0) return fail('Leverage must be a positive number');
  if (cmp(value, fromInt(instrument.maxLeverage)) > 0) {
    return fail(`Max leverage for ${instrument.id} is ${instrument.maxLeverage}x`);
  }
  if (cmp(value, MIN_LEVERAGE) < 0) return fail('Leverage must be at least 1x');
  return ok(value);
}

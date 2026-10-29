// Plain decimals only: "1e9", "-5", "0x1F" and "" are all rejected.
const PLAIN_DECIMAL = /^(\d+\.?\d*|\.\d+)$/;

// Values at or above this are rejected as input errors (AC-21 treats 1e9 as invalid).
export const INPUT_CEILING = 1e9;

export function parsePositive(text: string): number | null {
  const value = parseNonNegative(text);
  return value === null || value <= 0 ? null : value;
}

// Zero is allowed (a fee of 0%); negatives and non-numbers are not.
export function parseNonNegative(text: string): number | null {
  const trimmed = text.trim();
  if (!PLAIN_DECIMAL.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value >= INPUT_CEILING) return null;
  return value;
}

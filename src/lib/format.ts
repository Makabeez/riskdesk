const MINUS = '−';

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// "$1,234.56"; negatives as "−$149.40".
export function formatMoney(value: number): string {
  const cents = Math.round(Math.abs(value) * 100);
  const whole = Math.floor(cents / 100);
  const body = `$${groupThousands(String(whole))}.${String(cents % 100).padStart(2, '0')}`;
  return value < 0 && cents !== 0 ? `${MINUS}${body}` : body;
}

// Like formatMoney, but positive values get an explicit "+".
export function formatSignedMoney(value: number): string {
  const body = formatMoney(value);
  return value > 0 && Math.round(value * 100) > 0 ? `+${body}` : body;
}

// "+2.00R", "−1.50R", "0.00R".
export function formatR(value: number): string {
  const magnitude = Math.round(Math.abs(value) * 100) / 100;
  if (magnitude === 0) return '0.00R';
  const sign = value > 0 ? '+' : MINUS;
  return `${sign}${magnitude.toFixed(2)}R`;
}

// "5,000" for whole-number sizes, "1,234.56" with thousands separators.
export function formatSize(size: number, decimals: number): string {
  const [whole, fraction] = size.toFixed(decimals).split('.');
  return fraction === undefined ? groupThousands(whole) : `${groupThousands(whole)}.${fraction}`;
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

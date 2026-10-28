import { add, cmp, div, fromInt, mul, parseDecimal, ratio, sign, sub, toFixed, toPlain, ZERO, type Ratio } from './decimal';
import { getInstrument, type Instrument, type InstrumentId } from './instruments';
import { costPerUnitOf, feeRateOf, type Side, type Sizing } from './sizing';
import { validateFee } from './validation';

/**
 * A journal entry. Numbers are stored as exact decimal strings so a reloaded
 * trade recomputes to exactly the same cents.
 */
export interface Trade {
  id: string;
  instrument: InstrumentId;
  side: Side;
  size: string;
  entry: string;
  stop: string;
  leverage: string;
  /** Fee per side in percent, as it was when the trade was logged. Absent on trades logged before fees existed: 0%. */
  fee?: string;
  status: 'open' | 'closed';
  exit: string | null;
  openedAt: string;
  closedAt: string | null;
}

function newId(): string {
  // randomUUID only exists in secure contexts (https or localhost).
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function createTrade(
  instrument: Instrument,
  side: Side,
  sizing: Sizing,
  entry: Ratio,
  stop: Ratio,
  leverage: Ratio,
  fee: Ratio,
): Trade {
  return {
    id: newId(),
    instrument: instrument.id,
    side,
    size: toFixed(sizing.size, instrument.sizeDecimals),
    entry: toPlain(entry),
    stop: toPlain(stop),
    leverage: toPlain(leverage),
    fee: toPlain(fee),
    status: 'open',
    exit: null,
    openedAt: new Date().toISOString(),
    closedAt: null,
  };
}

export function closeTrade(trade: Trade, exit: Ratio): Trade {
  return { ...trade, status: 'closed', exit: toPlain(exit), closedAt: new Date().toISOString() };
}

/** Parses a stored number; trades are validated on load, so this cannot fail. */
export const num = (value: string): Ratio => parseDecimal(value) ?? ZERO;

/** The fee rate the trade was logged with, as a fraction of price. */
const feeRateOfTrade = (trade: Trade): Ratio => (trade.fee === undefined ? ZERO : feeRateOf(num(trade.fee)));

/** Actual risk: size × cost per unit, fees included. */
export function tradeRisk(trade: Trade): Ratio {
  const costPerUnit = costPerUnitOf(num(trade.entry), num(trade.stop), feeRateOfTrade(trade));
  return mul(num(trade.size), costPerUnit);
}

/** Realized P&L net of the entry and exit fees, or null while the trade is open. */
export function tradePnl(trade: Trade): Ratio | null {
  if (trade.status !== 'closed' || trade.exit === null) return null;
  const entry = num(trade.entry);
  const exit = num(trade.exit);
  const move = trade.side === 'long' ? sub(exit, entry) : sub(entry, exit);
  const fees = mul(feeRateOfTrade(trade), mul(num(trade.size), add(entry, exit)));
  return sub(mul(move, num(trade.size)), fees);
}

/** R multiple = realized P&L ÷ actual risk, or null while the trade is open. */
export function tradeR(trade: Trade): Ratio | null {
  const pnl = tradePnl(trade);
  const risk = tradeRisk(trade);
  return pnl && sign(risk) > 0 ? div(pnl, risk) : null;
}

export interface JournalSummary {
  closedCount: number;
  openCount: number;
  winRate: Ratio;
  totalPnl: Ratio;
  averageR: Ratio;
}

/** Performance of closed trades only; null when nothing has been closed yet. */
export function summarize(trades: readonly Trade[]): JournalSummary | null {
  const closed = trades.filter((trade) => trade.status === 'closed');
  if (closed.length === 0) return null;
  let wins = 0;
  let totalPnl = ZERO;
  let totalR = ZERO;
  for (const trade of closed) {
    const pnl = tradePnl(trade) ?? ZERO;
    if (sign(pnl) > 0) wins++;
    totalPnl = add(totalPnl, pnl);
    totalR = add(totalR, tradeR(trade) ?? ZERO);
  }
  return {
    closedCount: closed.length,
    openCount: trades.length - closed.length,
    winRate: ratio(BigInt(wins), BigInt(closed.length)),
    totalPnl,
    averageR: div(totalR, fromInt(closed.length)),
  };
}

const isPositive = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  const parsed = parseDecimal(value);
  return parsed !== null && sign(parsed) > 0;
};

/** Guards against stored data that was edited by hand or written by an older version. */
export function isTrade(value: unknown): value is Trade {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.instrument === 'string' &&
    getInstrument(t.instrument) !== undefined &&
    (t.side === 'long' || t.side === 'short') &&
    isPositive(t.size) &&
    isPositive(t.entry) &&
    isPositive(t.stop) &&
    cmp(num(t.entry), num(t.stop)) !== 0 &&
    isPositive(t.leverage) &&
    (t.fee === undefined || (typeof t.fee === 'string' && validateFee(t.fee).ok)) &&
    typeof t.openedAt === 'string' &&
    ((t.status === 'open' && t.exit === null && t.closedAt === null) ||
      (t.status === 'closed' && isPositive(t.exit) && typeof t.closedAt === 'string'))
  );
}

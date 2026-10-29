import type { InstrumentId } from './instruments';
import { realizedPnl, type Side } from './calc';

interface TradeBase {
  id: string;
  instrument: InstrumentId;
  side: Side;
  size: number;
  entry: number;
  stop: number;
  actualRisk: number;
  // Fee per side in percent, fixed when the trade was logged (AC-28). Missing on rows logged before fees existed: treated as 0.
  feePct?: number;
}

export interface OpenTrade extends TradeBase {
  status: 'open';
}

export interface ClosedTrade extends TradeBase {
  status: 'closed';
  exit: number;
  pnl: number;
  r: number;
}

export type Trade = OpenTrade | ClosedTrade;

export function isClosed(trade: Trade): trade is ClosedTrade {
  return trade.status === 'closed';
}

// Net of fees on entry and exit (AC-27).
export function closeTrade(trade: OpenTrade, exit: number): ClosedTrade {
  const fees = ((trade.feePct ?? 0) / 100) * trade.size * (trade.entry + exit);
  const pnl = realizedPnl(trade.side, trade.entry, exit, trade.size) - fees;
  return { ...trade, status: 'closed', exit, pnl, r: pnl / trade.actualRisk };
}

export interface JournalSummary {
  closedCount: number;
  winRate: number;
  totalPnl: number;
  averageR: number;
}

// Returns null when there are no closed trades; open trades are excluded.
export function summarize(trades: Trade[]): JournalSummary | null {
  const closed = trades.filter(isClosed);
  if (closed.length === 0) return null;
  const wins = closed.filter((trade) => trade.pnl > 0).length;
  return {
    closedCount: closed.length,
    winRate: wins / closed.length,
    totalPnl: closed.reduce((sum, trade) => sum + trade.pnl, 0),
    averageR: closed.reduce((sum, trade) => sum + trade.r, 0) / closed.length,
  };
}

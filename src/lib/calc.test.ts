import { describe, expect, it } from 'vitest';
import { sizePosition } from './calc';
import { closeTrade, summarize, type OpenTrade } from './journal';
import { getInstrument } from './instruments';
import { formatMoney, formatR, formatSignedMoney } from './format';

describe('sizing acceptance examples', () => {
  it('AC-05 long BTC: 0.100 BTC, $100.00 risk, $6,000.00 notional, $600.00 margin', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, instrument: getInstrument('BTC-PERP'), entry: 60000, stop: 59000, leverage: 10 });
    expect(s.size).toBe(0.1);
    expect(formatMoney(s.actualRisk)).toBe('$100.00');
    expect(formatMoney(s.notional)).toBe('$6,000.00');
    expect(formatMoney(s.marginRequired)).toBe('$600.00');
  });

  it('AC-06 rounds down: 1.42 ETH, $99.40 risk', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2930, leverage: 10 });
    expect(s.size).toBe(1.42);
    expect(formatMoney(s.actualRisk)).toBe('$99.40');
  });

  it('AC-09 short SOL: 16.6 SOL, $99.60 risk, $2,490.00 notional', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, instrument: getInstrument('SOL-PERP'), entry: 150, stop: 156, leverage: 10 });
    expect(s.size).toBe(16.6);
    expect(formatMoney(s.actualRisk)).toBe('$99.60');
    expect(formatMoney(s.notional)).toBe('$2,490.00');
  });

  it('AC-12 below minimum lot is flagged as too small', () => {
    const s = sizePosition({ balance: 100, riskPct: 0.1, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2000, leverage: 10 });
    expect(s.tooSmall).toBe(true);
  });

  it('AC-07 actual risk never exceeds the risk amount', () => {
    for (let entry = 100; entry < 400; entry += 7.3) {
      const s = sizePosition({ balance: 12345, riskPct: 2.7, instrument: getInstrument('ETH-PERP'), entry, stop: entry - 3.17, leverage: 10 });
      expect(s.actualRisk).toBeLessThanOrEqual(s.riskAmount);
    }
  });
});

describe('journal acceptance examples', () => {
  const open = (side: 'long' | 'short', size: number, entry: number, stop: number, actualRisk: number): OpenTrade => ({
    id: 't',
    instrument: side === 'long' ? 'ETH-PERP' : 'SOL-PERP',
    side,
    size,
    entry,
    stop,
    actualRisk,
    status: 'open',
  });

  it('AC-15 long winner: +$198.80, +2.00R', () => {
    const closed = closeTrade(open('long', 1.42, 3000, 2930, 99.4), 3140);
    expect(formatSignedMoney(closed.pnl)).toBe('+$198.80');
    expect(formatR(closed.r)).toBe('+2.00R');
  });

  it('AC-16 short loser: −$149.40, −1.50R', () => {
    const closed = closeTrade(open('short', 16.6, 150, 156, 99.6), 159);
    expect(formatSignedMoney(closed.pnl)).toBe('−$149.40');
    expect(formatR(closed.r)).toBe('−1.50R');
  });

  it('AC-19 summary: 2 trades, 50%, +$49.40, +0.25R; open trades excluded', () => {
    const winner = closeTrade(open('long', 1.42, 3000, 2930, 99.4), 3140);
    const loser = closeTrade(open('short', 16.6, 150, 156, 99.6), 159);
    const pending = open('long', 1, 100, 90, 10);
    const s = summarize([winner, pending, loser]);
    expect(s).not.toBeNull();
    expect(s?.closedCount).toBe(2);
    expect(Math.round((s?.winRate ?? 0) * 100)).toBe(50);
    expect(formatSignedMoney(s?.totalPnl ?? NaN)).toBe('+$49.40');
    expect(formatR(s?.averageR ?? NaN)).toBe('+0.25R');
  });

  it('AC-20 no closed trades gives no summary', () => {
    expect(summarize([open('long', 1, 100, 90, 10)])).toBeNull();
  });
});

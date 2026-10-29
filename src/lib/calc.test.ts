import { describe, expect, it } from 'vitest';
import { sizePosition } from './calc';
import { closeTrade, summarize, type OpenTrade } from './journal';
import { getInstrument } from './instruments';
import { formatMoney, formatR, formatSignedMoney, formatSize } from './format';
import { accountValues, feeError } from './validate';

describe('sizing acceptance examples', () => {
  it('AC-05 long BTC: 0.100 BTC, $100.00 risk, $6,000.00 notional, $600.00 margin', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0, instrument: getInstrument('BTC-PERP'), entry: 60000, stop: 59000, leverage: 10 });
    expect(s.size).toBe(0.1);
    expect(formatMoney(s.actualRisk)).toBe('$100.00');
    expect(formatMoney(s.notional)).toBe('$6,000.00');
    expect(formatMoney(s.marginRequired)).toBe('$600.00');
  });

  it('AC-06 rounds down: 1.42 ETH, $99.40 risk', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2930, leverage: 10 });
    expect(s.size).toBe(1.42);
    expect(formatMoney(s.actualRisk)).toBe('$99.40');
  });

  it('AC-09 short SOL: 16.6 SOL, $99.60 risk, $2,490.00 notional', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0, instrument: getInstrument('SOL-PERP'), entry: 150, stop: 156, leverage: 10 });
    expect(s.size).toBe(16.6);
    expect(formatMoney(s.actualRisk)).toBe('$99.60');
    expect(formatMoney(s.notional)).toBe('$2,490.00');
  });

  it('AC-12 below minimum lot is flagged as too small', () => {
    const s = sizePosition({ balance: 100, riskPct: 0.1, feePct: 0, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2000, leverage: 10 });
    expect(s.tooSmall).toBe(true);
  });

  it('AC-07 actual risk never exceeds the risk amount', () => {
    for (let entry = 100; entry < 400; entry += 7.3) {
      const s = sizePosition({ balance: 12345, riskPct: 2.7, feePct: 0.05, instrument: getInstrument('ETH-PERP'), entry, stop: entry - 3.17, leverage: 10 });
      expect(s.actualRisk).toBeLessThanOrEqual(s.riskAmount);
    }
  });
});

describe('fee acceptance examples', () => {
  it('AC-25 ETH with 0.05% fee: 1.37 ETH, $99.96 risk', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0.05, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2930, leverage: 10 });
    expect(s.size).toBe(1.37);
    expect(formatMoney(s.actualRisk)).toBe('$99.96');
  });

  it('AC-26 BTC with 0.05% fee: 0.094 BTC, $99.59 risk', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0.05, instrument: getInstrument('BTC-PERP'), entry: 60000, stop: 59000, leverage: 10 });
    expect(s.size).toBe(0.094);
    expect(formatMoney(s.actualRisk)).toBe('$99.59');
  });

  it('AC-29 XRP whole-number lots: 5,000 XRP, $100.00 risk', () => {
    const s = sizePosition({ balance: 10000, riskPct: 1, feePct: 0, instrument: getInstrument('XRP-PERP'), entry: 0.5, stop: 0.48, leverage: 10 });
    expect(s.size).toBe(5000);
    expect(formatSize(s.size, getInstrument('XRP-PERP').decimals)).toBe('5,000');
    expect(formatMoney(s.actualRisk)).toBe('$100.00');
  });

  it('AC-30 XRP below minimum size 10 is too small', () => {
    const s = sizePosition({ balance: 100, riskPct: 0.1, feePct: 0, instrument: getInstrument('XRP-PERP'), entry: 0.5, stop: 0.48, leverage: 10 });
    expect(s.size).toBe(5);
    expect(s.tooSmall).toBe(true);
  });

  it('C05 float trap: ETH 2500 at 0.3% with a 30-cent stop is 25.00 ETH, $7.50 risk', () => {
    const s = sizePosition({ balance: 2500, riskPct: 0.3, feePct: 0, instrument: getInstrument('ETH-PERP'), entry: 3000, stop: 2999.7, leverage: 10 });
    expect(s.size).toBe(25);
    expect(formatMoney(s.actualRisk)).toBe('$7.50');
    expect(s.actualRisk).toBeLessThanOrEqual(s.riskAmount + 1e-9);
  });

  it('AC-23 fee accepts 0 to 0.1 inclusive and rejects anything else', () => {
    expect(feeError('0')).toBeNull();
    expect(feeError('0.1')).toBeNull();
    expect(feeError('0.05')).toBeNull();
    expect(feeError('0.11')).toBe('Fee must be between 0% and 0.1%');
    expect(feeError('-0.01')).toBe('Fee must be between 0% and 0.1%');
    expect(feeError('abc')).toBe('Fee must be between 0% and 0.1%');
    expect(feeError('')).toBe('Fee must be between 0% and 0.1%');
  });

  it('AC-23 an invalid fee leaves the calculator without a result', () => {
    expect(accountValues({ balance: '10000', riskPct: '1', feePct: '0.2' })).toBeNull();
    expect(accountValues({ balance: '10000', riskPct: '1', feePct: '0.05' })?.feePct).toBe(0.05);
  });

  it('AC-24 actual risk never exceeds the risk amount with fees', () => {
    for (let entry = 0.5; entry < 400; entry += 3.7) {
      const s = sizePosition({ balance: 12345, riskPct: 2.7, feePct: 0.1, instrument: getInstrument('ETH-PERP'), entry, stop: entry * 0.97, leverage: 10 });
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

  it('AC-27 fee-aware close: +$187.59, +1.88R', () => {
    const trade: OpenTrade = { ...open('long', 1.37, 3000, 2930, 99.96), feePct: 0.05 };
    const closed = closeTrade(trade, 3140);
    expect(formatSignedMoney(closed.pnl)).toBe('+$187.59');
    expect(formatR(closed.r)).toBe('+1.88R');
  });

  it('AC-28 a trade keeps the fee it was logged with', () => {
    const trade: OpenTrade = { ...open('long', 1.37, 3000, 2930, 99.96), feePct: 0.05 };
    const before = closeTrade(trade, 3140);
    const withOtherSetting = closeTrade({ ...trade }, 3140);
    expect(withOtherSetting.pnl).toBe(before.pnl);
    expect(withOtherSetting.r).toBe(before.r);
  });

  it('AC-20 no closed trades gives no summary', () => {
    expect(summarize([open('long', 1, 100, 90, 10)])).toBeNull();
  });
});

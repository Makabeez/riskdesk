import { describe, expect, it } from 'vitest';
import { evaluate, type AccountInputs, type CalculatorInputs } from './calculator';
import { add, cmp, fromInt, mul, parseDecimal, ratio, toPlain } from './decimal';
import { formatMoney, formatPercent, formatPrice, formatR, formatSignedMoney, formatSize, MINUS } from './format';
import { getInstrument, INSTRUMENTS } from './instruments';
import { closeTrade, createTrade, isTrade, summarize, tradePnl, tradeR, tradeRisk, type Trade } from './journal';
import { readNumber, validateBalance, validateFee, validateLeverage, validatePrice, validateRisk } from './validation';

const dec = (s: string) => parseDecimal(s)!;
const DEFAULT_ACCOUNT: AccountInputs = { balance: '10,000.00', risk: '1', fee: '0' };

function calc(account: Partial<AccountInputs>, inputs: Partial<CalculatorInputs>) {
  return evaluate(
    { ...DEFAULT_ACCOUNT, ...account },
    { instrumentId: 'BTC-PERP', side: 'long', entry: '', stop: '', leverage: '10', ...inputs },
  );
}

function sized(account: Partial<AccountInputs>, inputs: Partial<CalculatorInputs>) {
  const evaluation = calc(account, inputs);
  if (evaluation.result.kind !== 'sized') throw new Error(`expected a result, got ${evaluation.result.kind}`);
  const { sizing } = evaluation.result;
  const decimals = evaluation.instrument.sizeDecimals;
  return {
    evaluation,
    size: formatSize(sizing.size, decimals),
    actualRisk: formatMoney(sizing.actualRisk),
    notional: formatMoney(sizing.notional),
    margin: formatMoney(sizing.margin),
    tradeFor: () => {
      const r = evaluation.result as Extract<typeof evaluation.result, { kind: 'sized' }>;
      return createTrade(evaluation.instrument, inputs.side ?? 'long', r.sizing, r.entry, r.stop, r.leverage, r.feePct);
    },
  };
}

describe('formatting', () => {
  it('formats money with 2 decimals, separators and a true minus sign', () => {
    expect(formatMoney(dec('1234.56'))).toBe('$1,234.56');
    expect(formatMoney(dec('-149.4'))).toBe(`${MINUS}$149.40`);
    expect(formatMoney(dec('-149.4'))).toBe('−$149.40');
    expect(formatMoney(dec('0'))).toBe('$0.00');
    expect(formatMoney(dec('-0.001'))).toBe('$0.00');
    expect(formatMoney(dec('1000000'))).toBe('$1,000,000.00');
    expect(formatSignedMoney(dec('198.8'))).toBe('+$198.80');
    expect(formatSignedMoney(dec('-149.4'))).toBe('−$149.40');
    expect(formatSignedMoney(dec('0'))).toBe('$0.00');
  });

  it('rounds half away from zero', () => {
    expect(formatMoney(dec('1.005'))).toBe('$1.01');
    expect(formatMoney(dec('-1.005'))).toBe('−$1.01');
    expect(formatMoney(dec('1.004999'))).toBe('$1.00');
  });

  it('formats R multiples with 2 decimals and a sign', () => {
    expect(formatR(dec('2'))).toBe('+2.00R');
    expect(formatR(dec('-1.5'))).toBe('−1.50R');
    expect(formatR(dec('0.25'))).toBe('+0.25R');
    expect(formatR(dec('0'))).toBe('0.00R');
    expect(formatR(dec('-0.004'))).toBe('0.00R');
  });

  it('formats sizes with the lot-step decimals (AC-13)', () => {
    expect(formatSize(dec('0.1'), getInstrument('BTC-PERP')!.sizeDecimals)).toBe('0.100');
    expect(formatSize(dec('1.42'), getInstrument('ETH-PERP')!.sizeDecimals)).toBe('1.42');
    expect(formatSize(dec('16.6'), getInstrument('SOL-PERP')!.sizeDecimals)).toBe('16.6');
    expect(formatSize(dec('1234.5'), 1)).toBe('1,234.5');
  });

  it('formats prices and percentages', () => {
    expect(formatPrice(dec('60000'))).toBe('60,000.00');
    expect(formatPrice(dec('0.000123'))).toBe('0.000123');
    expect(formatPercent(ratio(1n, 2n))).toBe('50%');
    expect(formatPercent(ratio(1n, 3n))).toBe('33.3%');
    expect(formatPercent(fromInt(1))).toBe('100%');
  });
});

describe('number input parsing', () => {
  it('accepts plain numbers, separators in the right places and the field unit', () => {
    expect(readNumber('10000')).toEqual(dec('10000'));
    expect(readNumber(' 10,000.50 ')).toEqual(dec('10000.5'));
    expect(readNumber('$10,000', { prefix: '$' })).toEqual(dec('10000'));
    expect(readNumber('1%', { suffix: '%' })).toEqual(dec('1'));
    expect(readNumber('10x', { suffix: 'x' })).toEqual(dec('10'));
    expect(readNumber('.5')).toEqual(dec('0.5'));
  });

  it('rejects letters and ambiguous separators', () => {
    for (const text of ['', 'abc', '12abc', '1.2.3', '3,5', '1,00', 'NaN', 'Infinity', '--1', '0x10']) {
      expect(readNumber(text)).toBeNull();
    }
  });
});

describe('UC-1 account settings', () => {
  it('AC-02 risk must be between 0.1% and 5% inclusive', () => {
    expect(validateRisk('0.1').ok).toBe(true);
    expect(validateRisk('5').ok).toBe(true);
    for (const text of ['0.09', '5.01', '0', '-1', 'abc', '', '1e9']) {
      expect(validateRisk(text)).toEqual({ ok: false, error: 'Risk must be between 0.1% and 5%' });
    }
    const evaluation = calc({ risk: '6' }, { entry: '60000', stop: '59000' });
    expect(evaluation.errors.risk).toBe('Risk must be between 0.1% and 5%');
    expect(evaluation.result.kind).toBe('invalid');
  });

  it('AC-03 balance must be a positive number', () => {
    for (const text of ['0', '-100', 'abc', '']) {
      expect(validateBalance(text)).toEqual({ ok: false, error: 'Balance must be a positive number' });
    }
    expect(calc({ balance: '0' }, { entry: '60000', stop: '59000' }).result.kind).toBe('invalid');
  });

  it('AC-21 rejects 1e9 in every numeric field', () => {
    const btc = getInstrument('BTC-PERP')!;
    expect(validateBalance('1e9').ok).toBe(false);
    expect(validateBalance('1000000000').ok).toBe(false);
    expect(validateRisk('1e9').ok).toBe(false);
    expect(validatePrice('1e9', 'Entry price').ok).toBe(false);
    expect(validateLeverage('1e9', btc).ok).toBe(false);
    expect(validateBalance('1e99999999').ok).toBe(false);
  });
});

describe('UC-2 / UC-3 sizing', () => {
  it('AC-05 BTC long', () => {
    const r = sized({}, { instrumentId: 'BTC-PERP', side: 'long', entry: '60,000', stop: '59,000', leverage: '10' });
    expect(r.size).toBe('0.100');
    expect(r.actualRisk).toBe('$100.00');
    expect(r.notional).toBe('$6,000.00');
    expect(r.margin).toBe('$600.00');
  });

  it('AC-06 rounds down, never to nearest', () => {
    const r = sized({}, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
    expect(r.size).toBe('1.42');
    expect(r.actualRisk).toBe('$99.40');
  });

  it('AC-08 long stop must be below entry', () => {
    for (const stop of ['60000', '61000']) {
      const evaluation = calc({}, { side: 'long', entry: '60000', stop });
      expect(evaluation.errors.stop).toBe('Stop loss must be below entry for a long');
      expect(evaluation.result.kind).toBe('invalid');
    }
  });

  it('AC-09 SOL short', () => {
    const r = sized({}, { instrumentId: 'SOL-PERP', side: 'short', entry: '150', stop: '156' });
    expect(r.size).toBe('16.6');
    expect(r.actualRisk).toBe('$99.60');
    expect(r.notional).toBe('$2,490.00');
  });

  it('AC-10 short stop must be above entry', () => {
    for (const stop of ['150', '140']) {
      const evaluation = calc({}, { instrumentId: 'SOL-PERP', side: 'short', entry: '150', stop });
      expect(evaluation.errors.stop).toBe('Stop loss must be above entry for a short');
      expect(evaluation.result.kind).toBe('invalid');
    }
  });

  it('shows no result until entry and stop are entered', () => {
    expect(calc({}, {}).result.kind).toBe('incomplete');
    expect(calc({}, { entry: '60000' }).result.kind).toBe('incomplete');
  });

  it('AC-07 actual risk never exceeds the risk amount, and the size is the largest that fits', () => {
    // Deterministic pseudo-random inputs, including awkward binary fractions.
    let seed = 42;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    const decimalString = (max: number, places: number) => (rand() * max + 10 ** -places).toFixed(places);
    for (let i = 0; i < 3000; i++) {
      const instrument = INSTRUMENTS[i % INSTRUMENTS.length];
      const side = rand() < 0.5 ? 'long' : 'short';
      const entry = decimalString(100_000, 1 + Math.floor(rand() * 4));
      const distance = Number(decimalString(Number(entry) / 2, 4));
      if (distance <= 0) continue;
      const stop = side === 'long' ? (Number(entry) - distance).toFixed(4) : (Number(entry) + distance).toFixed(4);
      const account = { balance: decimalString(1_000_000, 2), risk: (0.1 + rand() * 4.9).toFixed(2) };
      const evaluation = calc(account, { instrumentId: instrument.id, side, entry, stop });
      if (evaluation.result.kind !== 'sized') continue;
      const { sizing } = evaluation.result;
      expect(cmp(sizing.actualRisk, sizing.riskAmount)).toBeLessThanOrEqual(0);
      const oneMoreLot = mul(add(sizing.size, instrument.lotStep), sizing.riskPerUnit);
      expect(cmp(oneMoreLot, sizing.riskAmount)).toBe(1);
    }
  });

  it('AC-07 holds where binary floating point would round the wrong way', () => {
    // 0.3 / 0.1 is 2.9999999999999996 in floating point; exactly 3 lots fit.
    const r = sized({ balance: '30', risk: '1' }, { instrumentId: 'SOL-PERP', entry: '1.1', stop: '0.1' });
    expect(r.size).toBe('0.3');
    expect(r.actualRisk).toBe('$0.30');
  });
});

describe('UC-4 instrument limits', () => {
  it('AC-11 leverage above the cap is an error, never clamped', () => {
    const evaluation = calc({}, { instrumentId: 'SOL-PERP', side: 'long', entry: '150', stop: '140', leverage: '25' });
    expect(evaluation.errors.leverage).toBe('Max leverage for SOL-PERP is 20x');
    expect(evaluation.result.kind).toBe('invalid');
    expect(calc({}, { instrumentId: 'BTC-PERP', leverage: '51' }).errors.leverage).toBe('Max leverage for BTC-PERP is 50x');
    expect(calc({}, { instrumentId: 'ETH-PERP', leverage: '50' }).errors.leverage).toBeUndefined();
    expect(calc({}, { instrumentId: 'SOL-PERP', leverage: '20' }).errors.leverage).toBeUndefined();
  });

  it('AC-11 leverage must be positive', () => {
    expect(calc({}, { leverage: '0' }).errors.leverage).toBe('Leverage must be a positive number');
    expect(calc({}, { leverage: 'abc' }).errors.leverage).toBe('Leverage must be a positive number');
    expect(calc({}, { leverage: '0.5' }).errors.leverage).toBe('Leverage must be at least 1x');
  });

  it('AC-12 flags a size below the minimum lot', () => {
    const evaluation = calc({ balance: '100', risk: '0.1' }, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2000' });
    expect(evaluation.result.kind).toBe('sized');
    if (evaluation.result.kind === 'sized') expect(evaluation.result.sizing.belowMinimum).toBe(true);
  });
});

describe('UC-5 / UC-6 journal', () => {
  const ethLong = () =>
    sized({}, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' }).tradeFor();
  const solShort = () =>
    sized({}, { instrumentId: 'SOL-PERP', side: 'short', entry: '150', stop: '156' }).tradeFor();

  it('AC-14 a logged trade records the sized position as Open', () => {
    const trade = ethLong();
    expect(trade).toMatchObject({ instrument: 'ETH-PERP', side: 'long', size: '1.42', entry: '3000', stop: '2930', status: 'open' });
    expect(formatMoney(tradeRisk(trade))).toBe('$99.40');
    expect(tradePnl(trade)).toBeNull();
    expect(tradeR(trade)).toBeNull();
  });

  it('AC-15 long winner', () => {
    const trade = closeTrade(ethLong(), dec('3140'));
    expect(trade.status).toBe('closed');
    expect(formatSignedMoney(tradePnl(trade)!)).toBe('+$198.80');
    expect(formatR(tradeR(trade)!)).toBe('+2.00R');
  });

  it('AC-16 short loser', () => {
    const trade = closeTrade(solShort(), dec('159'));
    expect(trade.status).toBe('closed');
    expect(formatSignedMoney(tradePnl(trade)!)).toBe('−$149.40');
    expect(formatR(tradeR(trade)!)).toBe('−1.50R');
  });

  it('AC-19 summarizes closed trades only', () => {
    const trades: Trade[] = [closeTrade(ethLong(), dec('3140')), closeTrade(solShort(), dec('159')), ethLong()];
    const summary = summarize(trades)!;
    expect(summary.closedCount).toBe(2);
    expect(summary.openCount).toBe(1);
    expect(formatPercent(summary.winRate)).toBe('50%');
    expect(formatSignedMoney(summary.totalPnl)).toBe('+$49.40');
    expect(formatR(summary.averageR)).toBe('+0.25R');
  });

  it('AC-20 has no summary without closed trades', () => {
    expect(summarize([])).toBeNull();
    expect(summarize([ethLong()])).toBeNull();
  });

  it('round-trips through JSON and rejects malformed stored trades', () => {
    const trade = closeTrade(ethLong(), dec('3140'));
    const restored = JSON.parse(JSON.stringify(trade));
    expect(isTrade(restored)).toBe(true);
    expect(formatSignedMoney(tradePnl(restored)!)).toBe('+$198.80');
    expect(isTrade({ ...restored, size: 'abc' })).toBe(false);
    expect(isTrade({ ...restored, instrument: 'DOGE-PERP' })).toBe(false);
    expect(isTrade({ ...restored, exit: null })).toBe(false);
    expect(isTrade({ ...restored, stop: restored.entry })).toBe(false);
    expect(isTrade(null)).toBe(false);
  });

  it('stores prices exactly', () => {
    expect(toPlain(dec('60000'))).toBe('60000');
    expect(toPlain(dec('0.00012300'))).toBe('0.000123');
  });
});

describe('CR-1 trading fee per side', () => {
  it('AC-23 fee defaults to 0% and must be between 0% and 0.1%', () => {
    for (const text of ['-0.01', '0.11', '1', 'abc', '']) {
      expect(validateFee(text)).toEqual({ ok: false, error: 'Fee must be between 0% and 0.1%' });
    }
    for (const text of ['0', '0.05', '0.1']) {
      expect(validateFee(text).ok).toBe(true);
    }
    const evaluation = calc({ fee: '0.5' }, { entry: '60000', stop: '59000' });
    expect(evaluation.errors.fee).toBe('Fee must be between 0% and 0.1%');
    expect(evaluation.result.kind).toBe('invalid');
  });

  it('AC-24/AC-25 ETH long with a 0.05% fee', () => {
    const r = sized({ fee: '0.05' }, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
    expect(r.size).toBe('1.37');
    expect(r.actualRisk).toBe('$99.96');
    // AC-07 still holds, including fees.
    if (r.evaluation.result.kind === 'sized') {
      expect(cmp(r.evaluation.result.sizing.actualRisk, r.evaluation.result.sizing.riskAmount)).toBeLessThanOrEqual(0);
    }
    // AC-06 still holds unchanged when fee is 0.
    const zero = sized({ fee: '0' }, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
    expect(zero.size).toBe('1.42');
    expect(zero.actualRisk).toBe('$99.40');
  });

  it('AC-26 BTC long with a 0.05% fee', () => {
    const r = sized({ fee: '0.05' }, { instrumentId: 'BTC-PERP', side: 'long', entry: '60000', stop: '59000' });
    expect(r.size).toBe('0.094');
    expect(r.actualRisk).toBe('$99.59');
  });

  it('AC-27 journal P&L and R are net of entry and exit fees', () => {
    const trade = closeTrade(
      sized({ fee: '0.05' }, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' }).tradeFor(),
      dec('3140'),
    );
    expect(formatSignedMoney(tradePnl(trade)!)).toBe('+$187.59');
    expect(formatR(tradeR(trade)!)).toBe('+1.88R');
  });

  it('AC-28 a logged trade keeps its own fee rate', () => {
    const trade = sized({ fee: '0.05' }, { instrumentId: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' }).tradeFor();
    expect(trade.fee).toBe('0.05');
    const closed = closeTrade(trade, dec('3140'));
    expect(formatR(tradeR(closed)!)).toBe('+1.88R');
    // Round-trip through JSON preserves the fee rate.
    const restored = JSON.parse(JSON.stringify(closed));
    expect(isTrade(restored)).toBe(true);
    expect(formatSignedMoney(tradePnl(restored)!)).toBe('+$187.59');
  });

  it('a legacy trade with no fee field is read as 0%', () => {
    const legacy = {
      id: 'x', instrument: 'ETH-PERP', side: 'long', size: '1.42', entry: '3000', stop: '2930',
      leverage: '10', status: 'closed', exit: '3140', openedAt: '2026-01-01T00:00:00.000Z', closedAt: '2026-01-01T00:00:00.000Z',
    };
    expect(isTrade(legacy)).toBe(true);
    expect(formatSignedMoney(tradePnl(legacy as Trade)!)).toBe('+$198.80');
    // A fee of 'abc' is rejected; a fee of '-0.1' is rejected.
    expect(isTrade({ ...legacy, fee: 'abc' })).toBe(false);
    expect(isTrade({ ...legacy, fee: '-0.1' })).toBe(false);
    expect(isTrade({ ...legacy, fee: '0.05' })).toBe(true);
  });
});

describe('CR-2 XRP-PERP', () => {
  it('AC-29 whole-number sizes with lot step 1', () => {
    const xrp = getInstrument('XRP-PERP')!;
    expect(xrp.sizeDecimals).toBe(0);
    expect(xrp.maxLeverage).toBe(25);
    const r = sized({}, { instrumentId: 'XRP-PERP', side: 'long', entry: '0.50', stop: '0.48' });
    expect(r.size).toBe('5,000');
    expect(r.actualRisk).toBe('$100.00');
  });

  it('AC-30 the minimum size (10) is not the lot step (1)', () => {
    const evaluation = calc({ balance: '100', risk: '0.1' }, { instrumentId: 'XRP-PERP', side: 'long', entry: '0.50', stop: '0.48' });
    if (evaluation.result.kind !== 'sized') throw new Error('expected a sized result');
    expect(evaluation.result.sizing.belowMinimum).toBe(true);
  });

  it('AC-31 leverage above 25x on XRP-PERP is an error', () => {
    const evaluation = calc({}, { instrumentId: 'XRP-PERP', side: 'long', entry: '0.50', stop: '0.48', leverage: '26' });
    expect(evaluation.errors.leverage).toBe('Max leverage for XRP-PERP is 25x');
    expect(evaluation.result.kind).toBe('invalid');
    expect(calc({}, { instrumentId: 'XRP-PERP', side: 'long', entry: '0.50', stop: '0.48', leverage: '25' }).errors.leverage).toBeUndefined();
  });
});

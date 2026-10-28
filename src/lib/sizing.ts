import { abs, add, cmp, div, floor, fromInt, mul, sub, type Ratio } from './decimal';
import type { Instrument } from './instruments';

export type Side = 'long' | 'short';

export interface SizingInput {
  instrument: Instrument;
  balance: Ratio;
  /** Percent of balance, e.g. 1 for 1%. */
  riskPct: Ratio;
  entry: Ratio;
  stop: Ratio;
  leverage: Ratio;
  /** Fee per side as a fraction of price, e.g. 0.0005 for 0.05%. */
  feeRate: Ratio;
}

export interface Sizing {
  riskAmount: Ratio;
  riskPerUnit: Ratio;
  /** Price distance plus fees on entry and stop: what one unit costs if stopped out. */
  costPerUnit: Ratio;
  size: Ratio;
  actualRisk: Ratio;
  notional: Ratio;
  margin: Ratio;
  belowMinimum: boolean;
}

/** The stop must sit on the losing side of entry. */
export function stopSideError(side: Side, entry: Ratio, stop: Ratio): string | null {
  if (side === 'long' && cmp(stop, entry) >= 0) return 'Stop loss must be below entry for a long';
  if (side === 'short' && cmp(stop, entry) <= 0) return 'Stop loss must be above entry for a short';
  return null;
}

export function riskAmountOf(balance: Ratio, riskPct: Ratio): Ratio {
  return div(mul(balance, riskPct), fromInt(100));
}

/** A fee typed as a percent, e.g. 0.05, as a fraction of price: 0.0005. */
export function feeRateOf(feePct: Ratio): Ratio {
  return div(feePct, fromInt(100));
}

/** Price distance plus the fee on entry and on stop. The fee is charged on both legs. */
export function costPerUnitOf(entry: Ratio, stop: Ratio, feeRate: Ratio): Ratio {
  return add(abs(sub(entry, stop)), mul(feeRate, add(entry, stop)));
}

/** Sizes a position. The caller guarantees entry ≠ stop and leverage > 0. */
export function sizePosition({ instrument, balance, riskPct, entry, stop, leverage, feeRate }: SizingInput): Sizing {
  const riskAmount = riskAmountOf(balance, riskPct);
  const riskPerUnit = abs(sub(entry, stop));
  const costPerUnit = costPerUnitOf(entry, stop, feeRate);
  // Round DOWN to a whole number of lots — never to nearest, never up — so
  // actual risk can never exceed the risk amount.
  const lots = floor(div(riskAmount, mul(costPerUnit, instrument.lotStep)));
  const size = mul(fromInt(lots), instrument.lotStep);
  const notional = mul(size, entry);
  return {
    riskAmount,
    riskPerUnit,
    costPerUnit,
    size,
    actualRisk: mul(size, costPerUnit),
    notional,
    margin: div(notional, leverage),
    belowMinimum: cmp(size, instrument.minSize) < 0,
  };
}

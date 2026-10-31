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
  /** Fee per side, as a percent (e.g. 0.05 for 0.05%). Defaults to 0%. */
  feePct: Ratio;
}

export interface Sizing {
  riskAmount: Ratio;
  /** Price distance |entry − stop|, for display only. */
  riskPerUnit: Ratio;
  /** Risk per unit plus the round-trip fee: |entry − stop| + f × (entry + stop). */
  costPerUnit: Ratio;
  size: Ratio;
  /** size × costPerUnit — the full loss on a stop-out, including fees. */
  actualRisk: Ratio;
  notional: Ratio;
  margin: Ratio;
  belowMinimum: boolean;
}

const HUNDRED = fromInt(100);
export const feeRateOf = (feePct: Ratio): Ratio => div(feePct, HUNDRED);

/** The stop must sit on the losing side of entry. */
export function stopSideError(side: Side, entry: Ratio, stop: Ratio): string | null {
  if (side === 'long' && cmp(stop, entry) >= 0) return 'Stop loss must be below entry for a long';
  if (side === 'short' && cmp(stop, entry) <= 0) return 'Stop loss must be above entry for a short';
  return null;
}

export function riskAmountOf(balance: Ratio, riskPct: Ratio): Ratio {
  return div(mul(balance, riskPct), fromInt(100));
}

/** Sizes a position. The caller guarantees entry ≠ stop and leverage > 0. */
export function sizePosition({ instrument, balance, riskPct, entry, stop, leverage, feePct }: SizingInput): Sizing {
  const riskAmount = riskAmountOf(balance, riskPct);
  const riskPerUnit = abs(sub(entry, stop));
  // Fees on entry and exit eat into the same risk budget as price slippage,
  // so include them in the per-unit cost that sizing divides into.
  const costPerUnit = add(riskPerUnit, mul(feeRateOf(feePct), add(entry, stop)));
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

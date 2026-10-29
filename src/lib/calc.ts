import type { Instrument } from './instruments';

export type Side = 'long' | 'short';

export interface SizingInput {
  balance: number;
  riskPct: number;
  feePct: number;
  instrument: Instrument;
  entry: number;
  stop: number;
  leverage: number;
}

export interface Sizing {
  size: number;
  riskAmount: number;
  costPerUnit: number;
  actualRisk: number;
  notional: number;
  marginRequired: number;
  tooSmall: boolean;
}

// Size is rounded DOWN to the lot step, so actual risk never exceeds the risk amount.
// The fee is charged on entry and on stop, so it counts against the risk budget (AC-24).
// Float noise is relative to the magnitude: 0.5 − 0.48 is not exactly 0.02, so 100 ÷ cost can land a hair under 5000.
const RELATIVE_TOLERANCE = 1e-9;
// Absolute slack for the money check, far below a cent.
const MONEY_TOLERANCE = 1e-9;

export function sizePosition({ balance, riskPct, feePct, instrument, entry, stop, leverage }: SizingInput): Sizing {
  const riskAmount = (balance * riskPct) / 100;
  const feeRate = feePct / 100;
  const costPerUnit = Math.abs(entry - stop) + feeRate * (entry + stop);
  const rawSize = riskAmount / costPerUnit;
  const lots = (steps: number) => Number((steps * instrument.lotStep).toFixed(instrument.decimals));
  const steps = Math.floor((rawSize / instrument.lotStep) * (1 + RELATIVE_TOLERANCE));
  let size = lots(steps);
  if (size * costPerUnit > riskAmount + MONEY_TOLERANCE) size = lots(steps - 1);
  const notional = size * entry;
  return {
    size,
    riskAmount,
    costPerUnit,
    actualRisk: size * costPerUnit,
    notional,
    marginRequired: notional / leverage,
    tooSmall: size < instrument.minSize,
  };
}

export function realizedPnl(side: Side, entry: number, exit: number, size: number): number {
  return side === 'long' ? (exit - entry) * size : (entry - exit) * size;
}

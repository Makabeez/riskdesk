import type { Instrument } from './instruments';

export type Side = 'long' | 'short';

export interface SizingInput {
  balance: number;
  riskPct: number;
  instrument: Instrument;
  entry: number;
  stop: number;
  leverage: number;
}

export interface Sizing {
  size: number;
  riskAmount: number;
  riskPerUnit: number;
  actualRisk: number;
  notional: number;
  marginRequired: number;
  tooSmall: boolean;
}

// Size is rounded DOWN to the lot step, so actual risk never exceeds the risk amount.
export function sizePosition({ balance, riskPct, instrument, entry, stop, leverage }: SizingInput): Sizing {
  const riskAmount = (balance * riskPct) / 100;
  const riskPerUnit = Math.abs(entry - stop);
  const rawSize = riskAmount / riskPerUnit;
  const steps = Math.floor(rawSize / instrument.lotStep);
  const size = Number((steps * instrument.lotStep).toFixed(instrument.decimals));
  const notional = size * entry;
  return {
    size,
    riskAmount,
    riskPerUnit,
    actualRisk: size * riskPerUnit,
    notional,
    marginRequired: notional / leverage,
    tooSmall: size < instrument.minSize,
  };
}

export function realizedPnl(side: Side, entry: number, exit: number, size: number): number {
  return side === 'long' ? (exit - entry) * size : (entry - exit) * size;
}

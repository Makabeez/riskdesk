import { INSTRUMENTS } from './instruments';
import type { Instrument, Side } from '../types';

export interface CalcInput {
  instrument: Instrument;
  side: Side;
  entry: number;
  stop: number;
  leverage: number;
  balance: number;
  riskPct: number;
}

export interface CalcResult {
  size: number;
  actualRisk: number;
  notional: number;
  marginRequired: number;
  tooSmall: boolean;
}

function floorToLotStep(value: number, lotStep: number): number {
  const factor = Math.round(1 / lotStep);
  return Math.floor(value * factor) / factor;
}

export function calculate(input: CalcInput): CalcResult {
  const cfg = INSTRUMENTS[input.instrument];
  const riskAmount = (input.balance * input.riskPct) / 100;
  const riskPerUnit = Math.abs(input.entry - input.stop);
  const rawSize = riskAmount / riskPerUnit;
  const size = floorToLotStep(rawSize, cfg.lotStep);
  const actualRisk = size * riskPerUnit;
  const notional = size * input.entry;
  const marginRequired = notional / input.leverage;
  const tooSmall = size < cfg.minSize;
  return { size, actualRisk, notional, marginRequired, tooSmall };
}

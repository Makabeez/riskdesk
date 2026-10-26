import { parseDecimal, type Ratio } from './decimal';

export type InstrumentId = 'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP';

export interface Instrument {
  id: InstrumentId;
  /** Asset the position size is quoted in. */
  base: string;
  lotStep: Ratio;
  minSize: Ratio;
  maxLeverage: number;
  /** Sizes are displayed with the lot step's number of decimals. */
  sizeDecimals: number;
}

function define(id: InstrumentId, base: string, lotStep: string, minSize: string, maxLeverage: number): Instrument {
  return {
    id,
    base,
    lotStep: parseDecimal(lotStep)!,
    minSize: parseDecimal(minSize)!,
    maxLeverage,
    sizeDecimals: lotStep.split('.')[1]?.length ?? 0,
  };
}

export const INSTRUMENTS: readonly Instrument[] = [
  define('BTC-PERP', 'BTC', '0.001', '0.001', 50),
  define('ETH-PERP', 'ETH', '0.01', '0.01', 50),
  define('SOL-PERP', 'SOL', '0.1', '0.1', 20),
];

export const DEFAULT_LEVERAGE = 10;

export function getInstrument(id: string): Instrument | undefined {
  return INSTRUMENTS.find((instrument) => instrument.id === id);
}

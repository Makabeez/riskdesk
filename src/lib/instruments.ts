import type { Instrument } from '../types';

export interface InstrumentConfig {
  lotStep: number;
  minSize: number;
  maxLeverage: number;
  decimals: number;
  unit: string;
}

export const INSTRUMENTS: Record<Instrument, InstrumentConfig> = {
  'BTC-PERP': { lotStep: 0.001, minSize: 0.001, maxLeverage: 50, decimals: 3, unit: 'BTC' },
  'ETH-PERP': { lotStep: 0.01,  minSize: 0.01,  maxLeverage: 50, decimals: 2, unit: 'ETH' },
  'SOL-PERP': { lotStep: 0.1,   minSize: 0.1,   maxLeverage: 20, decimals: 1, unit: 'SOL' },
};

export const INSTRUMENT_NAMES: Instrument[] = ['BTC-PERP', 'ETH-PERP', 'SOL-PERP'];

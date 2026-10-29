export type InstrumentId = 'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP' | 'XRP-PERP';

export interface Instrument {
  id: InstrumentId;
  base: string;
  lotStep: number;
  minSize: number;
  maxLeverage: number;
  decimals: number;
}

export const INSTRUMENTS: Instrument[] = [
  { id: 'BTC-PERP', base: 'BTC', lotStep: 0.001, minSize: 0.001, maxLeverage: 50, decimals: 3 },
  { id: 'ETH-PERP', base: 'ETH', lotStep: 0.01, minSize: 0.01, maxLeverage: 50, decimals: 2 },
  { id: 'SOL-PERP', base: 'SOL', lotStep: 0.1, minSize: 0.1, maxLeverage: 20, decimals: 1 },
  { id: 'XRP-PERP', base: 'XRP', lotStep: 1, minSize: 10, maxLeverage: 25, decimals: 0 },
];

export const DEFAULT_LEVERAGE = 10;

export function getInstrument(id: InstrumentId): Instrument {
  const found = INSTRUMENTS.find((instrument) => instrument.id === id);
  if (!found) throw new Error(`Unknown instrument: ${id}`);
  return found;
}

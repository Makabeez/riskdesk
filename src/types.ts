export type Instrument = 'BTC-PERP' | 'ETH-PERP' | 'SOL-PERP';
export type Side = 'Long' | 'Short';

export interface AccountSettings {
  balance: number;
  riskPct: number;
}

export interface Trade {
  id: string;
  instrument: Instrument;
  side: Side;
  size: number;
  entry: number;
  stop: number;
  leverage: number;
  actualRisk: number;
  status: 'Open' | 'Closed';
  exitPrice?: number;
  pnl?: number;
  rMultiple?: number;
  loggedAt: number;
}

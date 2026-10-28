import { parsePositive } from './parse';

export const RISK_MIN = 0.1;
export const RISK_MAX = 5;

export interface AccountSettings {
  balance: string;
  riskPct: string;
}

export interface AccountValues {
  balance: number;
  riskPct: number;
}

export function balanceError(text: string): string | null {
  return parsePositive(text) === null ? 'Balance must be a positive number' : null;
}

export function riskError(text: string): string | null {
  const value = parsePositive(text);
  return value === null || value < RISK_MIN || value > RISK_MAX ? 'Risk must be between 0.1% and 5%' : null;
}

// Null when either account field is invalid, which means the calculator shows no result.
export function accountValues(account: AccountSettings): AccountValues | null {
  if (balanceError(account.balance) !== null || riskError(account.riskPct) !== null) return null;
  return {
    balance: parsePositive(account.balance) as number,
    riskPct: parsePositive(account.riskPct) as number,
  };
}

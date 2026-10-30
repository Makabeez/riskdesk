import type { AccountSettings, Trade } from '../types';

const ACCOUNT_KEY = 'riskdesk:account';
const TRADES_KEY = 'riskdesk:trades';

const DEFAULT_ACCOUNT: AccountSettings = { balance: 10000, riskPct: 1 };

export function loadAccount(): AccountSettings {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return DEFAULT_ACCOUNT;
    const parsed = JSON.parse(raw) as AccountSettings;
    if (typeof parsed.balance === 'number' && typeof parsed.riskPct === 'number') return parsed;
  } catch {
    // ignore
  }
  return DEFAULT_ACCOUNT;
}

export function saveAccount(settings: AccountSettings): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(settings));
}

export function loadTrades(): Trade[] {
  try {
    const raw = localStorage.getItem(TRADES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Trade[];
  } catch {
    return [];
  }
}

export function saveTrades(trades: Trade[]): void {
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
}

import { INSTRUMENTS } from './instruments';
import type { Trade } from './journal';
import type { AccountSettings } from './validate';

const ACCOUNT_KEY = 'riskdesk.account';
const TRADES_KEY = 'riskdesk.trades';

export const DEFAULT_ACCOUNT: AccountSettings = { balance: '10000', riskPct: '1', feePct: '0' };

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the app keeps working for this session.
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTrade(value: unknown): value is Trade {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  const base =
    typeof t.id === 'string' &&
    INSTRUMENTS.some((instrument) => instrument.id === t.instrument) &&
    (t.side === 'long' || t.side === 'short') &&
    isFiniteNumber(t.size) &&
    isFiniteNumber(t.entry) &&
    isFiniteNumber(t.stop) &&
    isFiniteNumber(t.actualRisk) &&
    (t.feePct === undefined || isFiniteNumber(t.feePct));
  if (!base) return false;
  if (t.status === 'open') return true;
  return t.status === 'closed' && isFiniteNumber(t.exit) && isFiniteNumber(t.pnl) && isFiniteNumber(t.r);
}

export function loadAccount(): AccountSettings {
  const value = read(ACCOUNT_KEY) as Partial<AccountSettings> | null;
  if (value && typeof value.balance === 'string' && typeof value.riskPct === 'string') {
    // Accounts saved before fees existed have no feePct; they get the default 0%.
    const feePct = typeof value.feePct === 'string' ? value.feePct : DEFAULT_ACCOUNT.feePct;
    return { balance: value.balance, riskPct: value.riskPct, feePct };
  }
  return DEFAULT_ACCOUNT;
}

export function saveAccount(account: AccountSettings): void {
  write(ACCOUNT_KEY, account);
}

export function loadTrades(): Trade[] {
  const value = read(TRADES_KEY);
  return Array.isArray(value) ? value.filter(isTrade) : [];
}

export function saveTrades(trades: Trade[]): void {
  write(TRADES_KEY, trades);
}

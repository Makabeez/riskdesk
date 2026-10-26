import type { AccountInputs } from './calculator';
import { isTrade, type Trade } from './journal';

export const ACCOUNT_KEY = 'riskdesk.account.v1';
export const JOURNAL_KEY = 'riskdesk.journal.v1';

export const DEFAULT_ACCOUNT: AccountInputs = { balance: '10,000.00', risk: '1' };

// Storage can be unavailable (private mode, blocked site data) or full; the
// app keeps working in memory either way.
function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Nothing useful to do; the in-memory state is still correct.
  }
}

export function loadAccount(): AccountInputs {
  const stored = read(ACCOUNT_KEY) as Partial<AccountInputs> | undefined;
  return {
    balance: typeof stored?.balance === 'string' ? stored.balance : DEFAULT_ACCOUNT.balance,
    risk: typeof stored?.risk === 'string' ? stored.risk : DEFAULT_ACCOUNT.risk,
  };
}

export function saveAccount(account: AccountInputs): void {
  write(ACCOUNT_KEY, account);
}

export function loadJournal(): Trade[] {
  const stored = read(JOURNAL_KEY);
  return Array.isArray(stored) ? stored.filter(isTrade) : [];
}

export function saveJournal(trades: readonly Trade[]): void {
  write(JOURNAL_KEY, trades);
}

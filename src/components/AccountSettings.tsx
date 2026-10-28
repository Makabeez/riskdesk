import { balanceError, riskError, type AccountSettings as Account } from '../lib/validate';

interface AccountSettingsProps {
  account: Account;
  onChange: (account: Account) => void;
}

export function AccountSettings({ account, onChange }: AccountSettingsProps) {
  const balanceMessage = balanceError(account.balance);
  const riskMessage = riskError(account.riskPct);

  return (
    <section className="panel" aria-labelledby="account-title">
      <h2 id="account-title">Account</h2>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="balance">Account balance (USD)</label>
          <input
            id="balance"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={account.balance}
            aria-invalid={balanceMessage !== null}
            aria-describedby={balanceMessage ? 'balance-error' : undefined}
            onChange={(event) => onChange({ ...account, balance: event.target.value })}
          />
          {balanceMessage && (
            <p id="balance-error" className="field-error" role="alert">
              {balanceMessage}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="risk">Risk per trade (%)</label>
          <input
            id="risk"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={account.riskPct}
            aria-invalid={riskMessage !== null}
            aria-describedby={riskMessage ? 'risk-error' : undefined}
            onChange={(event) => onChange({ ...account, riskPct: event.target.value })}
          />
          {riskMessage && (
            <p id="risk-error" className="field-error" role="alert">
              {riskMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

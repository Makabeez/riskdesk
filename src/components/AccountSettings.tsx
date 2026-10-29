import { formatMoney } from '../lib/format';
import { parsePositive } from '../lib/parse';
import { balanceError, feeError, riskError, type AccountSettings as Account } from '../lib/validate';

interface AccountSettingsProps {
  account: Account;
  onChange: (account: Account) => void;
}

export function AccountSettings({ account, onChange }: AccountSettingsProps) {
  const balanceMessage = balanceError(account.balance);
  const riskMessage = riskError(account.riskPct);
  const feeMessage = feeError(account.feePct);
  const balance = parsePositive(account.balance);
  const riskPct = parsePositive(account.riskPct);
  const riskBudget = balance !== null && riskPct !== null && riskMessage === null ? formatMoney((balance * riskPct) / 100) : null;

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
          {riskBudget && <p className="hint">{`Risk budget: ${riskBudget} per trade`}</p>}
        </div>
        <div className="field">
          <label htmlFor="fee">Fee per side (%)</label>
          <input
            id="fee"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={account.feePct}
            aria-invalid={feeMessage !== null}
            aria-describedby={feeMessage ? 'fee-error' : undefined}
            onChange={(event) => onChange({ ...account, feePct: event.target.value })}
          />
          {feeMessage && (
            <p id="fee-error" className="field-error" role="alert">
              {feeMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

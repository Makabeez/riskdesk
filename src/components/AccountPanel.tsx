import type { AccountInputs, FieldErrors } from '../lib/calculator';
import type { Ratio } from '../lib/decimal';
import { formatMoney, formatPrice } from '../lib/format';
import { validateBalance } from '../lib/validation';
import { NumberField } from './NumberField';

interface AccountPanelProps {
  account: AccountInputs;
  errors: FieldErrors;
  riskAmount: Ratio | null;
  onChange: (update: (account: AccountInputs) => AccountInputs) => void;
}

export function AccountPanel({ account, errors, riskAmount, onChange }: AccountPanelProps) {
  // Tidy a valid balance into "10,000.00" once the trader leaves the field.
  const tidyBalance = () =>
    onChange((current) => {
      const balance = validateBalance(current.balance);
      return balance.ok ? { ...current, balance: formatPrice(balance.value) } : current;
    });

  return (
    <section className="panel" aria-labelledby="account-title">
      <header className="panel__head">
        <h2 id="account-title">Account</h2>
        <span className="panel__meta">Saved in this browser</span>
      </header>
      <div className="field-row">
        <NumberField
          id="balance"
          label="Account balance"
          prefix="$"
          value={account.balance}
          error={errors.balance}
          onChange={(balance) => onChange((current) => ({ ...current, balance }))}
          onBlur={tidyBalance}
        />
        <NumberField
          id="risk"
          label="Risk per trade"
          suffix="%"
          value={account.risk}
          error={errors.risk}
          hint={riskAmount ? <>Risk budget {formatMoney(riskAmount)} per trade</> : 'Between 0.1% and 5%'}
          onChange={(risk) => onChange((current) => ({ ...current, risk }))}
        />
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import type { AccountSettings } from '../types';

interface Props {
  initial: AccountSettings;
  onChange: (settings: AccountSettings | null) => void;
}

function validateBalance(raw: string): string | null {
  const v = parseFloat(raw);
  if (raw.trim() === '' || isNaN(v) || !isFinite(v) || v <= 0) {
    return 'Balance must be a positive number';
  }
  return null;
}

function validateRisk(raw: string): string | null {
  const v = parseFloat(raw);
  if (raw.trim() === '' || isNaN(v) || !isFinite(v) || v < 0.1 || v > 5) {
    return 'Risk must be between 0.1% and 5%';
  }
  return null;
}

export function AccountSettings({ initial, onChange }: Props) {
  const [balance, setBalance] = useState(String(initial.balance));
  const [riskPct, setRiskPct] = useState(String(initial.riskPct));

  const balanceErr = validateBalance(balance);
  const riskErr = validateRisk(riskPct);

  useEffect(() => {
    if (!balanceErr && !riskErr) {
      onChange({ balance: parseFloat(balance), riskPct: parseFloat(riskPct) });
    } else {
      onChange(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, riskPct]);

  return (
    <section className="card" aria-label="Account Settings">
      <h2 className="section-title">Account Settings</h2>
      <div className="account-row">
        <div className="field">
          <label htmlFor="balance">Balance (USD)</label>
          <input
            id="balance"
            type="number"
            min="0"
            step="any"
            value={balance}
            onChange={e => setBalance(e.target.value)}
            aria-describedby={balanceErr ? 'balance-err' : undefined}
            aria-invalid={!!balanceErr}
          />
          {balanceErr && <span id="balance-err" className="field-error" role="alert">{balanceErr}</span>}
        </div>
        <div className="field">
          <label htmlFor="risk-pct">Risk per trade (%)</label>
          <input
            id="risk-pct"
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={riskPct}
            onChange={e => setRiskPct(e.target.value)}
            aria-describedby={riskErr ? 'risk-err' : undefined}
            aria-invalid={!!riskErr}
          />
          {riskErr && <span id="risk-err" className="field-error" role="alert">{riskErr}</span>}
        </div>
      </div>
    </section>
  );
}

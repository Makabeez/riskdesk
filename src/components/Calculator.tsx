import { useMemo, useState } from 'react';
import { calculate } from '../lib/calc';
import { formatMoney, formatSize } from '../lib/format';
import { INSTRUMENTS, INSTRUMENT_NAMES } from '../lib/instruments';
import type { AccountSettings, Instrument, Side, Trade } from '../types';

interface Props {
  account: AccountSettings | null;
  onLogTrade: (trade: Trade) => void;
}

function parsePositive(raw: string): number | null {
  const v = parseFloat(raw);
  if (raw.trim() === '' || isNaN(v) || !isFinite(v) || v <= 0) return null;
  return v;
}

export function Calculator({ account, onLogTrade }: Props) {
  const [instrument, setInstrument] = useState<Instrument>('BTC-PERP');
  const [side, setSide] = useState<Side>('Long');
  const [entryRaw, setEntryRaw] = useState('');
  const [stopRaw, setStopRaw] = useState('');
  const [leverageRaw, setLeverageRaw] = useState('10');

  const cfg = INSTRUMENTS[instrument];

  // field-level errors
  const entryErr = entryRaw !== '' && parsePositive(entryRaw) === null
    ? 'Enter a valid positive number'
    : null;

  const entry = parsePositive(entryRaw);
  const stop = parsePositive(stopRaw);
  const leverage = parsePositive(leverageRaw);

  const stopErr: string | null = (() => {
    if (stopRaw !== '' && parsePositive(stopRaw) === null) return 'Enter a valid positive number';
    if (entry !== null && stop !== null) {
      if (side === 'Long' && stop >= entry) return 'Stop loss must be below entry for a long';
      if (side === 'Short' && stop <= entry) return 'Stop loss must be above entry for a short';
    }
    return null;
  })();

  const leverageErr: string | null = (() => {
    if (leverageRaw !== '' && (parsePositive(leverageRaw) === null)) return 'Enter a valid positive number';
    if (leverage !== null && leverage > cfg.maxLeverage) {
      return `Max leverage for ${instrument} is ${cfg.maxLeverage}x`;
    }
    return null;
  })();

  const result = useMemo(() => {
    if (!account || !entry || !stop || !leverage) return null;
    if (entryErr || stopErr || leverageErr) return null;
    return calculate({ instrument, side, entry, stop, leverage, balance: account.balance, riskPct: account.riskPct });
  }, [account, instrument, side, entry, stop, leverage, entryErr, stopErr, leverageErr]);

  const hasValidResult = result !== null && !result.tooSmall;
  const canLog = hasValidResult && account !== null;

  function handleLog() {
    if (!result || !account || !entry || !stop || !leverage) return;
    const trade: Trade = {
      id: crypto.randomUUID(),
      instrument,
      side,
      size: result.size,
      entry,
      stop,
      leverage,
      actualRisk: result.actualRisk,
      status: 'Open',
      loggedAt: Date.now(),
    };
    onLogTrade(trade);
  }

  return (
    <section className="card" aria-label="Position Calculator">
      <h2 className="section-title">Position Calculator</h2>

      <div className="calc-form">
        <div className="field">
          <label htmlFor="instrument">Instrument</label>
          <select
            id="instrument"
            value={instrument}
            onChange={e => setInstrument(e.target.value as Instrument)}
          >
            {INSTRUMENT_NAMES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="field">
          <span className="field-label">Side</span>
          <div className="side-toggle" role="group" aria-label="Trade side">
            <button
              type="button"
              className={`side-btn ${side === 'Long' ? 'side-btn--active side-btn--long' : ''}`}
              onClick={() => setSide('Long')}
              aria-pressed={side === 'Long'}
            >Long</button>
            <button
              type="button"
              className={`side-btn ${side === 'Short' ? 'side-btn--active side-btn--short' : ''}`}
              onClick={() => setSide('Short')}
              aria-pressed={side === 'Short'}
            >Short</button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="entry">Entry price</label>
          <input
            id="entry"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60000"
            value={entryRaw}
            onChange={e => setEntryRaw(e.target.value)}
            aria-describedby={entryErr ? 'entry-err' : undefined}
            aria-invalid={!!entryErr}
          />
          {entryErr && <span id="entry-err" className="field-error" role="alert">{entryErr}</span>}
        </div>

        <div className="field">
          <label htmlFor="stop">Stop loss</label>
          <input
            id="stop"
            type="number"
            min="0"
            step="any"
            placeholder={side === 'Long' ? 'Below entry' : 'Above entry'}
            value={stopRaw}
            onChange={e => setStopRaw(e.target.value)}
            aria-describedby={stopErr ? 'stop-err' : undefined}
            aria-invalid={!!stopErr}
          />
          {stopErr && <span id="stop-err" className="field-error" role="alert">{stopErr}</span>}
        </div>

        <div className="field">
          <label htmlFor="leverage">Leverage (max {cfg.maxLeverage}x)</label>
          <input
            id="leverage"
            type="number"
            min="1"
            max={cfg.maxLeverage}
            step="1"
            value={leverageRaw}
            onChange={e => setLeverageRaw(e.target.value)}
            aria-describedby={leverageErr ? 'leverage-err' : undefined}
            aria-invalid={!!leverageErr}
          />
          {leverageErr && <span id="leverage-err" className="field-error" role="alert">{leverageErr}</span>}
        </div>
      </div>

      {!account && (
        <p className="info-msg">Configure account settings above to see results.</p>
      )}

      {result && (
        <div className="calc-result">
          {result.tooSmall ? (
            <p className="field-error result-error" role="alert">Position too small for minimum lot size</p>
          ) : (
            <dl className="result-grid">
              <dt>Size</dt>
              <dd className="mono">{formatSize(result.size, cfg.decimals)} {cfg.unit}</dd>
              <dt>Actual risk</dt>
              <dd className="mono">{formatMoney(result.actualRisk)}</dd>
              <dt>Notional</dt>
              <dd className="mono">{formatMoney(result.notional)}</dd>
              <dt>Margin required</dt>
              <dd className="mono">{formatMoney(result.marginRequired)}</dd>
            </dl>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary"
        disabled={!canLog}
        onClick={handleLog}
      >
        Log trade
      </button>
    </section>
  );
}

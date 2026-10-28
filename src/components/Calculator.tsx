import { useState } from 'react';
import { sizePosition, type Side, type Sizing } from '../lib/calc';
import { DEFAULT_LEVERAGE, INSTRUMENTS, getInstrument, type InstrumentId } from '../lib/instruments';
import { formatMoney, formatSize } from '../lib/format';
import type { OpenTrade } from '../lib/journal';
import { parsePositive } from '../lib/parse';
import type { AccountValues } from '../lib/validate';

interface CalculatorProps {
  account: AccountValues | null;
  onLog: (trade: OpenTrade) => void;
}

const STOP_RULE_MESSAGE: Record<Side, string> = {
  long: 'Stop loss must be below entry for a long',
  short: 'Stop loss must be above entry for a short',
};

const STOP_RULE_VALID: Record<Side, (entry: number, stop: number) => boolean> = {
  long: (entry, stop) => stop < entry,
  short: (entry, stop) => stop > entry,
};

let tradeCounter = 0;

function newTradeId(): string {
  tradeCounter += 1;
  return `${Date.now().toString(36)}-${tradeCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function Calculator({ account, onLog }: CalculatorProps) {
  const [instrumentId, setInstrumentId] = useState<InstrumentId>('BTC-PERP');
  const [side, setSide] = useState<Side>('long');
  const [entryText, setEntryText] = useState('');
  const [stopText, setStopText] = useState('');
  const [leverageText, setLeverageText] = useState(String(DEFAULT_LEVERAGE));

  const instrument = getInstrument(instrumentId);
  const entry = parsePositive(entryText);
  const stop = parsePositive(stopText);
  const leverage = parsePositive(leverageText);

  const entryError = entryText.trim() !== '' && entry === null ? 'Enter a positive price' : null;
  const stopInvalid = stopText.trim() !== '' && stop === null ? 'Enter a positive price' : null;
  const stopRuleError =
    entry !== null && stop !== null && !STOP_RULE_VALID[side](entry, stop) ? STOP_RULE_MESSAGE[side] : null;
  const stopError = stopInvalid ?? stopRuleError;

  let leverageError: string | null = null;
  if (leverage === null) {
    leverageError = 'Leverage must be a positive number';
  } else if (leverage > instrument.maxLeverage) {
    leverageError = `Max leverage for ${instrument.id} is ${instrument.maxLeverage}x`;
  }

  const canSize =
    account !== null && entry !== null && stop !== null && leverage !== null && stopError === null && leverageError === null;
  const sizing: Sizing | null = canSize
    ? sizePosition({ ...account, instrument, entry, stop, leverage })
    : null;
  const canLog = sizing !== null && !sizing.tooSmall;

  function handleLog() {
    if (!sizing || !canLog || entry === null || stop === null) return;
    onLog({
      id: newTradeId(),
      instrument: instrument.id,
      side,
      size: sizing.size,
      entry,
      stop,
      actualRisk: sizing.actualRisk,
      status: 'open',
    });
  }

  return (
    <section className="panel" aria-labelledby="calc-title">
      <h2 id="calc-title">Position size</h2>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="instrument">Instrument</label>
          <select id="instrument" value={instrumentId} onChange={(event) => setInstrumentId(event.target.value as InstrumentId)}>
            {INSTRUMENTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="field">
          <legend>Side</legend>
          <div className="radio-row">
            <label className="radio">
              <input type="radio" name="side" value="long" checked={side === 'long'} onChange={() => setSide('long')} />
              Long
            </label>
            <label className="radio">
              <input type="radio" name="side" value="short" checked={side === 'short'} onChange={() => setSide('short')} />
              Short
            </label>
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="entry">Entry price</label>
          <input
            id="entry"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={entryText}
            aria-invalid={entryError !== null}
            aria-describedby={entryError ? 'entry-error' : undefined}
            onChange={(event) => setEntryText(event.target.value)}
          />
          {entryError && (
            <p id="entry-error" className="field-error" role="alert">
              {entryError}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="stop">Stop loss</label>
          <input
            id="stop"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={stopText}
            aria-invalid={stopError !== null}
            aria-describedby={stopError ? 'stop-error' : undefined}
            onChange={(event) => setStopText(event.target.value)}
          />
          {stopError && (
            <p id="stop-error" className="field-error" role="alert">
              {stopError}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="leverage">Leverage (x)</label>
          <input
            id="leverage"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={leverageText}
            aria-invalid={leverageError !== null}
            aria-describedby={leverageError ? 'leverage-error' : undefined}
            onChange={(event) => setLeverageText(event.target.value)}
          />
          {leverageError && (
            <p id="leverage-error" className="field-error" role="alert">
              {leverageError}
            </p>
          )}
        </div>
      </div>

      <div className="result" aria-live="polite">
        {account === null && <p className="hint">Fix the account settings to see a result.</p>}
        {account !== null && sizing === null && <p className="hint">Enter entry and stop loss to size a position.</p>}
        {sizing?.tooSmall && <p className="field-error" role="alert">Position too small for minimum lot size</p>}
        {sizing && !sizing.tooSmall && (
          <dl className="stats">
            <div>
              <dt>Position size</dt>
              <dd>{`${formatSize(sizing.size, instrument.decimals)} ${instrument.base}`}</dd>
            </div>
            <div>
              <dt>Actual risk</dt>
              <dd>{formatMoney(sizing.actualRisk)}</dd>
            </div>
            <div>
              <dt>Notional</dt>
              <dd>{formatMoney(sizing.notional)}</dd>
            </div>
            <div>
              <dt>Margin required</dt>
              <dd>{formatMoney(sizing.marginRequired)}</dd>
            </div>
          </dl>
        )}
      </div>

      <button type="button" onClick={handleLog} disabled={!canLog}>
        Log trade
      </button>
    </section>
  );
}

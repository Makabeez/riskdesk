import { useState } from 'react';
import { getInstrument } from '../lib/instruments';
import { formatMoney, formatR, formatSignedMoney, formatSize } from '../lib/format';
import type { Trade } from '../lib/journal';
import { parsePositive } from '../lib/parse';

interface TradeJournalProps {
  trades: Trade[];
  onClose: (id: string, exit: number) => void;
  onDelete: (id: string) => void;
}

export function TradeJournal({ trades, onClose, onDelete }: TradeJournalProps) {
  return (
    <section className="panel" aria-labelledby="journal-title">
      <h2 id="journal-title">Trade journal</h2>
      {trades.length === 0 ? (
        <p className="hint">No trades logged yet.</p>
      ) : (
        <ul className="trades">
          {trades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} onClose={onClose} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface TradeCardProps {
  trade: Trade;
  onClose: (id: string, exit: number) => void;
  onDelete: (id: string) => void;
}

function TradeCard({ trade, onClose, onDelete }: TradeCardProps) {
  const [exitText, setExitText] = useState('');
  const [confirming, setConfirming] = useState(false);

  const instrument = getInstrument(trade.instrument);
  const sideLabel = trade.side === 'long' ? 'Long' : 'Short';
  const exit = parsePositive(exitText);
  const exitError = exitText.trim() !== '' && exit === null ? 'Enter a positive exit price' : null;

  return (
    <li className="trade">
      <div className="trade-head">
        <h3>{`${trade.instrument} · ${sideLabel}`}</h3>
        <span className={`badge ${trade.status}`}>{trade.status === 'open' ? 'Open' : 'Closed'}</span>
      </div>

      <dl className="details">
        <div>
          <dt>Size</dt>
          <dd>{`${formatSize(trade.size, instrument.decimals)} ${instrument.base}`}</dd>
        </div>
        <div>
          <dt>Entry</dt>
          <dd>{trade.entry}</dd>
        </div>
        <div>
          <dt>Stop</dt>
          <dd>{trade.stop}</dd>
        </div>
        <div>
          <dt>Actual risk</dt>
          <dd>{formatMoney(trade.actualRisk)}</dd>
        </div>
        {trade.status === 'closed' && (
          <>
            <div>
              <dt>Exit</dt>
              <dd>{trade.exit}</dd>
            </div>
            <div>
              <dt>P&amp;L</dt>
              <dd className={trade.pnl >= 0 ? 'positive' : 'negative'}>{formatSignedMoney(trade.pnl)}</dd>
            </div>
            <div>
              <dt>R multiple</dt>
              <dd className={trade.r >= 0 ? 'positive' : 'negative'}>{formatR(trade.r)}</dd>
            </div>
          </>
        )}
      </dl>

      {trade.status === 'open' && (
        <div className="actions">
          <div className="field grow">
            <label htmlFor={`exit-${trade.id}`}>Exit price</label>
            <input
              id={`exit-${trade.id}`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={exitText}
              aria-invalid={exitError !== null}
              aria-describedby={exitError ? `exit-error-${trade.id}` : undefined}
              onChange={(event) => setExitText(event.target.value)}
            />
            {exitError && (
              <p id={`exit-error-${trade.id}`} className="field-error" role="alert">
                {exitError}
              </p>
            )}
          </div>
          <button type="button" onClick={() => exit !== null && onClose(trade.id, exit)} disabled={exit === null}>
            Close
          </button>
        </div>
      )}

      <div className="actions">
        {confirming ? (
          <>
            <span className="hint">Delete this trade?</span>
            <button type="button" className="danger" onClick={() => onDelete(trade.id)}>
              Confirm delete
            </button>
            <button type="button" className="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="secondary" onClick={() => setConfirming(true)}>
            Delete
          </button>
        )}
      </div>
    </li>
  );
}

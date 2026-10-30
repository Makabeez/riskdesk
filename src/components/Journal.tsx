import { useState } from 'react';
import { formatMoney, formatR, formatSignedMoney, formatSize } from '../lib/format';
import { INSTRUMENTS } from '../lib/instruments';
import type { Trade } from '../types';

interface Props {
  trades: Trade[];
  onClose: (id: string, exitPrice: number) => void;
  onDelete: (id: string) => void;
}

function parseExit(raw: string): number | null {
  const v = parseFloat(raw);
  if (raw.trim() === '' || isNaN(v) || !isFinite(v) || v <= 0) return null;
  return v;
}

function CloseForm({ trade, onClose }: { trade: Trade; onClose: (exitPrice: number) => void }) {
  const [exitRaw, setExitRaw] = useState('');
  const exitVal = parseExit(exitRaw);
  const exitErr = exitRaw !== '' && exitVal === null ? 'Enter a valid positive number' : null;

  return (
    <div className="close-form">
      <label htmlFor={`exit-${trade.id}`} className="close-label">Exit price</label>
      <input
        id={`exit-${trade.id}`}
        type="number"
        min="0"
        step="any"
        placeholder="Exit price"
        value={exitRaw}
        onChange={e => setExitRaw(e.target.value)}
        aria-invalid={!!exitErr}
      />
      {exitErr && <span className="field-error" role="alert">{exitErr}</span>}
      <button
        type="button"
        className="btn btn--sm btn--primary"
        disabled={!exitVal}
        onClick={() => exitVal && onClose(exitVal)}
      >Close</button>
    </div>
  );
}

export function Journal({ trades, onClose, onDelete }: Props) {
  const [closingId, setClosingId] = useState<string | null>(null);

  const sorted = [...trades].sort((a, b) => b.loggedAt - a.loggedAt);

  function handleDelete(id: string) {
    if (window.confirm('Delete this trade?')) onDelete(id);
  }

  function handleClose(id: string, exitPrice: number) {
    onClose(id, exitPrice);
    setClosingId(null);
  }

  return (
    <section className="card" aria-label="Trade Journal">
      <h2 className="section-title">Trade Journal</h2>

      {sorted.length === 0 ? (
        <p className="empty-msg">No trades logged yet.</p>
      ) : (
        <div className="journal-list">
          {sorted.map(trade => {
            const cfg = INSTRUMENTS[trade.instrument];
            const isClosing = closingId === trade.id;
            return (
              <div key={trade.id} className={`trade-card ${trade.status === 'Closed' ? 'trade-card--closed' : ''}`}>
                <div className="trade-header">
                  <span className="trade-instrument">{trade.instrument}</span>
                  <span className={`side-badge ${trade.side === 'Long' ? 'side-badge--long' : 'side-badge--short'}`}>
                    {trade.side}
                  </span>
                  <span className={`status-badge ${trade.status === 'Open' ? 'status-badge--open' : 'status-badge--closed'}`}>
                    {trade.status}
                  </span>
                </div>

                <dl className="trade-details">
                  <dt>Size</dt>
                  <dd className="mono">{formatSize(trade.size, cfg.decimals)} {cfg.unit}</dd>
                  <dt>Entry</dt>
                  <dd className="mono">{formatMoney(trade.entry)}</dd>
                  <dt>Stop</dt>
                  <dd className="mono">{formatMoney(trade.stop)}</dd>
                  <dt>Risk</dt>
                  <dd className="mono">{formatMoney(trade.actualRisk)}</dd>

                  {trade.status === 'Closed' && trade.exitPrice !== undefined && trade.pnl !== undefined && trade.rMultiple !== undefined && (
                    <>
                      <dt>Exit</dt>
                      <dd className="mono">{formatMoney(trade.exitPrice)}</dd>
                      <dt>P&amp;L</dt>
                      <dd className={`mono pnl ${trade.pnl >= 0 ? 'pnl--pos' : 'pnl--neg'}`}>
                        {formatSignedMoney(trade.pnl)}
                      </dd>
                      <dt>R</dt>
                      <dd className={`mono pnl ${trade.rMultiple >= 0 ? 'pnl--pos' : 'pnl--neg'}`}>
                        {formatR(trade.rMultiple)}
                      </dd>
                    </>
                  )}
                </dl>

                {trade.status === 'Open' && isClosing && (
                  <CloseForm
                    trade={trade}
                    onClose={exitPrice => handleClose(trade.id, exitPrice)}
                  />
                )}

                <div className="trade-actions">
                  {trade.status === 'Open' && !isClosing && (
                    <button
                      type="button"
                      className="btn btn--sm btn--secondary"
                      onClick={() => setClosingId(trade.id)}
                    >Close trade</button>
                  )}
                  {trade.status === 'Open' && isClosing && (
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      onClick={() => setClosingId(null)}
                    >Cancel</button>
                  )}
                  <button
                    type="button"
                    className="btn btn--sm btn--danger"
                    onClick={() => handleDelete(trade.id)}
                  >Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

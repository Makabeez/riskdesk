import { formatR, formatSignedMoney } from '../lib/format';
import type { Trade } from '../types';

interface Props {
  trades: Trade[];
}

export function Summary({ trades }: Props) {
  const closed = trades.filter(t => t.status === 'Closed' && t.pnl !== undefined && t.rMultiple !== undefined);

  return (
    <section className="card" aria-label="Performance Summary">
      <h2 className="section-title">Performance</h2>

      {closed.length === 0 ? (
        <p className="empty-msg">No closed trades yet.</p>
      ) : (
        <dl className="summary-grid">
          <dt>Closed trades</dt>
          <dd className="mono">{closed.length}</dd>

          <dt>Win rate</dt>
          <dd className="mono">
            {Math.round((closed.filter(t => (t.pnl ?? 0) > 0).length / closed.length) * 100)}%
          </dd>

          <dt>Total P&amp;L</dt>
          <dd className={`mono pnl ${closed.reduce((s, t) => s + (t.pnl ?? 0), 0) >= 0 ? 'pnl--pos' : 'pnl--neg'}`}>
            {formatSignedMoney(closed.reduce((s, t) => s + (t.pnl ?? 0), 0))}
          </dd>

          <dt>Average R</dt>
          <dd className={`mono pnl ${closed.reduce((s, t) => s + (t.rMultiple ?? 0), 0) / closed.length >= 0 ? 'pnl--pos' : 'pnl--neg'}`}>
            {formatR(closed.reduce((s, t) => s + (t.rMultiple ?? 0), 0) / closed.length)}
          </dd>
        </dl>
      )}
    </section>
  );
}

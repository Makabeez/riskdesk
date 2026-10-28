import { formatPercent, formatR, formatSignedMoney } from '../lib/format';
import { summarize, type Trade } from '../lib/journal';

interface SummaryProps {
  trades: Trade[];
}

export function Summary({ trades }: SummaryProps) {
  const summary = summarize(trades);

  return (
    <section className="panel" aria-labelledby="summary-title">
      <h2 id="summary-title">Performance</h2>
      {summary === null ? (
        <p className="hint">No closed trades yet</p>
      ) : (
        <dl className="stats">
          <div>
            <dt>Closed trades</dt>
            <dd>{summary.closedCount}</dd>
          </div>
          <div>
            <dt>Win rate</dt>
            <dd>{formatPercent(summary.winRate)}</dd>
          </div>
          <div>
            <dt>Total P&amp;L</dt>
            <dd>{formatSignedMoney(summary.totalPnl)}</dd>
          </div>
          <div>
            <dt>Average R</dt>
            <dd>{formatR(summary.averageR)}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

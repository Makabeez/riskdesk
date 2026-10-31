import { formatPercent, formatR, formatSignedMoney, toneOf } from '../lib/format';
import type { JournalSummary } from '../lib/journal';

export function SummaryPanel({ summary }: { summary: JournalSummary | null }) {
  return (
    <section className="summary" aria-labelledby="summary-title">
      <h3 id="summary-title" className="summary__title">
        Performance
        {summary && summary.openCount > 0 && (
          <span className="summary__meta">
            {summary.openCount} open {summary.openCount === 1 ? 'trade' : 'trades'} not included
          </span>
        )}
      </h3>
      {summary ? (
        <dl className="stats">
          <div className="stat">
            <dt>Closed trades</dt>
            <dd className="num" data-testid="summary-closed">
              {summary.closedCount}
            </dd>
          </div>
          <div className="stat">
            <dt>Win rate</dt>
            <dd className="num" data-testid="summary-win-rate">
              {formatPercent(summary.winRate)}
            </dd>
          </div>
          <div className="stat">
            <dt>Total P&amp;L</dt>
            <dd className="num" data-tone={toneOf(summary.totalPnl)} data-testid="summary-total-pnl">
              {formatSignedMoney(summary.totalPnl)}
            </dd>
          </div>
          <div className="stat">
            <dt>Average R</dt>
            <dd className="num" data-tone={toneOf(summary.averageR)} data-testid="summary-average-r">
              {formatR(summary.averageR)}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="summary__empty">No closed trades yet</p>
      )}
    </section>
  );
}

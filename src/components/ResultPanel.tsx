import type { AccountInputs, Evaluation } from '../lib/calculator';
import { cmp } from '../lib/decimal';
import { formatMoney, formatPlain, formatPrice, formatSize } from '../lib/format';
import type { Side } from '../lib/sizing';
import { validateBalance } from '../lib/validation';

interface ResultPanelProps {
  evaluation: Evaluation;
  account: AccountInputs;
  side: Side;
  notice: string | null;
  onLog: () => void;
}

export function ResultPanel({ evaluation, account, side, notice, onLog }: ResultPanelProps) {
  const { instrument, result } = evaluation;
  const canLog = result.kind === 'sized' && !result.sizing.belowMinimum;

  return (
    <section className="panel result" aria-labelledby="result-title">
      <header className="panel__head">
        <h2 id="result-title">Result</h2>
        <span className={`side-tag side-tag--${side}`}>
          {instrument.id} · {side === 'long' ? 'Long' : 'Short'}
        </span>
      </header>

      <div className="result__body" aria-live="polite">
        {result.kind === 'incomplete' && (
          <p className="result__empty">Enter an entry price and stop loss to size this position.</p>
        )}

        {result.kind === 'invalid' && (
          <p className="result__empty result__empty--invalid">No result. Fix the highlighted fields to size this position.</p>
        )}

        {result.kind === 'sized' && result.sizing.belowMinimum && (
          <div className="result__blocked" data-testid="too-small">
            <p className="result__blocked-title">Position too small for minimum lot size</p>
            <p>
              Your {formatMoney(result.sizing.riskAmount)} risk budget buys less than the {instrument.id} minimum of{' '}
              {formatSize(instrument.minSize, instrument.sizeDecimals)} {instrument.base}. Raise your risk or move the stop
              closer to entry.
            </p>
          </div>
        )}

        {result.kind === 'sized' && !result.sizing.belowMinimum && (
          <>
            <div className="result__hero">
              <span className="result__label">Position size</span>
              <p className="result__size" data-testid="position-size">
                <span className="num">{formatSize(result.sizing.size, instrument.sizeDecimals)}</span>{' '}
                <span className="result__unit">{instrument.base}</span>
              </p>
            </div>
            <dl className="metrics">
              <div className="metrics__row metrics__row--key">
                <dt>Actual risk</dt>
                <dd className="num" data-testid="actual-risk">
                  {formatMoney(result.sizing.actualRisk)}
                </dd>
              </div>
              <div className="metrics__row">
                <dt>Notional</dt>
                <dd className="num" data-testid="notional">
                  {formatMoney(result.sizing.notional)}
                </dd>
              </div>
              <div className="metrics__row">
                <dt>Margin required</dt>
                <dd className="num" data-testid="margin">
                  {formatMoney(result.sizing.margin)}
                </dd>
              </div>
            </dl>
            <p className="result__note">
              Rounded down to the {formatSize(instrument.lotStep, instrument.sizeDecimals)} {instrument.base} lot step, so
              risk stays within your {formatMoney(result.sizing.riskAmount)} budget. Risk per unit $
              {formatPrice(result.sizing.riskPerUnit)}, leverage {formatPlain(result.leverage)}x.
            </p>
            <MarginWarning account={account} evaluation={evaluation} />
          </>
        )}
      </div>

      <button type="button" className="btn btn--primary btn--block" disabled={!canLog} onClick={onLog}>
        Log trade
      </button>
      <p className="result__notice" role="status">
        {notice && (
          <>
            {notice} <a href="#journal">View journal</a>
          </>
        )}
      </p>
    </section>
  );
}

function MarginWarning({ account, evaluation }: { account: AccountInputs; evaluation: Evaluation }) {
  const balance = validateBalance(account.balance);
  if (evaluation.result.kind !== 'sized' || !balance.ok) return null;
  if (cmp(evaluation.result.sizing.margin, balance.value) <= 0) return null;
  return (
    <p className="result__warn">
      Margin required is more than your {formatMoney(balance.value)} balance at this leverage.
    </p>
  );
}

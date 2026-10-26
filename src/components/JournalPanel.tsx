import { useState, type FormEvent } from 'react';
import type { Ratio } from '../lib/decimal';
import { formatMoney, formatPrice, formatR, formatSignedMoney, formatSize, toneOf } from '../lib/format';
import { getInstrument } from '../lib/instruments';
import { num, summarize, tradePnl, tradeR, tradeRisk, type Trade } from '../lib/journal';
import { validatePrice } from '../lib/validation';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorIcon } from './NumberField';
import { SummaryPanel } from './SummaryPanel';

interface JournalPanelProps {
  trades: readonly Trade[];
  onClose: (id: string, exit: Ratio) => void;
  onDelete: (id: string) => void;
}

const sideLabel = (trade: Trade) => (trade.side === 'long' ? 'Long' : 'Short');

function describe(trade: Trade): string {
  const instrument = getInstrument(trade.instrument)!;
  const size = formatSize(num(trade.size), instrument.sizeDecimals);
  return `${trade.instrument} ${sideLabel(trade)} · ${size} ${instrument.base} at ${formatPrice(num(trade.entry))}`;
}

export function JournalPanel({ trades, onClose, onDelete }: JournalPanelProps) {
  // Kept after confirming so the dialog text doesn't vanish while it closes.
  const [pending, setPending] = useState<Trade | null>(null);
  const [confirming, setConfirming] = useState(false);
  const openCount = trades.filter((trade) => trade.status === 'open').length;

  return (
    <section className="panel journal" id="journal" aria-labelledby="journal-title">
      <header className="panel__head">
        <h2 id="journal-title">Journal</h2>
        {trades.length > 0 && (
          <span className="panel__meta">
            {trades.length} {trades.length === 1 ? 'trade' : 'trades'} · {openCount} open
          </span>
        )}
      </header>

      <SummaryPanel summary={summarize(trades)} />

      {trades.length === 0 ? (
        <div className="journal__empty">
          <p className="journal__empty-title">No trades logged yet</p>
          <p>Size a position above and select “Log trade” to start your journal.</p>
        </div>
      ) : (
        <table className="trades">
          <caption className="sr-only">Logged trades, newest first</caption>
          <thead>
            <tr>
              <th scope="col">Instrument</th>
              <th scope="col">Side</th>
              <th scope="col" className="trades__num">Size</th>
              <th scope="col" className="trades__num">Entry</th>
              <th scope="col" className="trades__num">Stop</th>
              <th scope="col" className="trades__num">Actual risk</th>
              <th scope="col">Status</th>
              <th scope="col">Exit</th>
              <th scope="col" className="trades__num">P&amp;L</th>
              <th scope="col" className="trades__num">R</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <TradeRow
                key={trade.id}
                trade={trade}
                onClose={onClose}
                onDelete={() => {
                  setPending(trade);
                  setConfirming(true);
                }}
              />
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={confirming}
        title="Delete this trade?"
        confirmLabel="Delete trade"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          if (pending) onDelete(pending.id);
          setConfirming(false);
        }}
      >
        <p>{pending && describe(pending)} will be permanently removed from your journal.</p>
      </ConfirmDialog>
    </section>
  );
}

interface TradeRowProps {
  trade: Trade;
  onClose: (id: string, exit: Ratio) => void;
  onDelete: () => void;
}

function TradeRow({ trade, onClose, onDelete }: TradeRowProps) {
  const instrument = getInstrument(trade.instrument)!;
  const pnl = tradePnl(trade);
  const r = tradeR(trade);
  const open = trade.status === 'open';

  return (
    <tr className={`trades__row trades__row--${trade.status}`} data-testid="trade-row">
      <td data-label="Instrument" className="trades__instrument">
        {trade.instrument}
      </td>
      <td data-label="Side">
        <span className={`side-tag side-tag--${trade.side}`}>{sideLabel(trade)}</span>
      </td>
      <td data-label="Size" className="trades__num num">
        {formatSize(num(trade.size), instrument.sizeDecimals)} {instrument.base}
      </td>
      <td data-label="Entry" className="trades__num num">
        {formatPrice(num(trade.entry))}
      </td>
      <td data-label="Stop" className="trades__num num">
        {formatPrice(num(trade.stop))}
      </td>
      <td data-label="Actual risk" className="trades__num num">
        {formatMoney(tradeRisk(trade))}
      </td>
      <td data-label="Status">
        <span className={`status status--${trade.status}`}>{open ? 'Open' : 'Closed'}</span>
      </td>
      <td data-label="Exit" className={open ? 'trades__close' : 'num'}>
        {open ? <CloseForm trade={trade} onClose={onClose} /> : formatPrice(num(trade.exit!))}
      </td>
      <td data-label="P&L" className="trades__num num" data-tone={pnl ? toneOf(pnl) : undefined}>
        {pnl ? formatSignedMoney(pnl) : '—'}
      </td>
      <td data-label="R" className="trades__num num" data-tone={r ? toneOf(r) : undefined}>
        {r ? formatR(r) : '—'}
      </td>
      <td className="trades__actions">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={onDelete}
          aria-label={`Delete ${trade.instrument} ${sideLabel(trade)} trade`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function CloseForm({ trade, onClose }: { trade: Trade; onClose: (id: string, exit: Ratio) => void }) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const exit = validatePrice(value, 'Exit price');
  const error = !exit.ok && (submitted || value.trim() !== '') ? exit.error : undefined;
  const id = `exit-${trade.id}`;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (exit.ok) onClose(trade.id, exit.value);
  };

  return (
    <form className="close-form" noValidate onSubmit={submit}>
      <label className="close-form__label" htmlFor={id}>
        Exit price
      </label>
      <div className="close-form__row">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          maxLength={24}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button type="submit" className="btn btn--secondary btn--small">
          Close
        </button>
      </div>
      {error && (
        <p className="field__error" id={`${id}-error`}>
          <ErrorIcon />
          {error}
        </p>
      )}
    </form>
  );
}

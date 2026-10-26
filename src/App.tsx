import { useEffect, useMemo, useRef, useState } from 'react';
import { AccountPanel } from './components/AccountPanel';
import { JournalPanel } from './components/JournalPanel';
import { PositionPanel } from './components/PositionPanel';
import { ResultPanel } from './components/ResultPanel';
import { evaluate, type CalculatorInputs } from './lib/calculator';
import type { Ratio } from './lib/decimal';
import { formatSize } from './lib/format';
import { DEFAULT_LEVERAGE } from './lib/instruments';
import { closeTrade, createTrade, type Trade } from './lib/journal';
import { ACCOUNT_KEY, JOURNAL_KEY, loadAccount, loadJournal, saveAccount, saveJournal } from './lib/storage';

const INITIAL_INPUTS: CalculatorInputs = {
  instrumentId: 'BTC-PERP',
  side: 'long',
  entry: '',
  stop: '',
  leverage: String(DEFAULT_LEVERAGE),
};

export default function App() {
  const [account, setAccount] = useState(loadAccount);
  const [trades, setTrades] = useState<Trade[]>(loadJournal);
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => saveAccount(account), [account]);
  useEffect(() => saveJournal(trades), [trades]);

  // Another tab changed the stored data: adopt it rather than overwrite it later.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === JOURNAL_KEY) setTrades(loadJournal());
      if (event.key === ACCOUNT_KEY) setAccount(loadAccount());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const evaluation = useMemo(() => evaluate(account, inputs), [account, inputs]);

  const announce = (message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 6000);
  };

  const logTrade = () => {
    const { result, instrument } = evaluation;
    if (result.kind !== 'sized' || result.sizing.belowMinimum) return;
    const trade = createTrade(instrument, inputs.side, result.sizing, result.entry, result.stop, result.leverage);
    setTrades((current) => [trade, ...current]);
    const size = formatSize(result.sizing.size, instrument.sizeDecimals);
    announce(`Logged ${instrument.id} ${inputs.side === 'long' ? 'Long' : 'Short'} · ${size} ${instrument.base}.`);
  };

  const close = (id: string, exit: Ratio) =>
    setTrades((current) => current.map((trade) => (trade.id === id ? closeTrade(trade, exit) : trade)));

  const remove = (id: string) => setTrades((current) => current.filter((trade) => trade.id !== id));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <div>
            <h1 className="brand__name">RiskDesk</h1>
            <p className="brand__tagline">Position sizing that never rounds your risk up</p>
          </div>
        </div>
        <p className="topbar__note">USD · stored only in this browser</p>
      </header>

      <main>
        <div className="workspace">
          <div className="workspace__inputs">
            <AccountPanel account={account} errors={evaluation.errors} riskAmount={evaluation.riskAmount} onChange={setAccount} />
            <PositionPanel
              inputs={inputs}
              instrument={evaluation.instrument}
              errors={evaluation.errors}
              onChange={(patch) => setInputs((current) => ({ ...current, ...patch }))}
            />
          </div>
          <ResultPanel evaluation={evaluation} account={account} side={inputs.side} notice={notice} onLog={logTrade} />
        </div>

        <JournalPanel trades={trades} onClose={close} onDelete={remove} />
      </main>
    </div>
  );
}

function Logo() {
  return (
    <svg className="brand__logo" viewBox="0 0 32 32" width="36" height="36" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path d="M8 21.5 13 16l4 3.5 7-8.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 24.5h16" stroke="#fff" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

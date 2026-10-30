import { useState } from 'react';
import './App.css';
import { AccountSettings } from './components/AccountSettings';
import { Calculator } from './components/Calculator';
import { Journal } from './components/Journal';
import { Summary } from './components/Summary';
import { loadAccount, loadTrades, saveAccount, saveTrades } from './lib/storage';
import type { AccountSettings as AccountSettingsType, Trade } from './types';

const initialAccount = loadAccount();
const initialTrades = loadTrades();

export default function App() {
  const [account, setAccount] = useState<AccountSettingsType>(initialAccount);
  const [validAccount, setValidAccount] = useState<AccountSettingsType | null>(initialAccount);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);

  function handleAccountChange(settings: AccountSettingsType | null) {
    setValidAccount(settings);
    if (settings) {
      setAccount(settings);
      saveAccount(settings);
    }
  }

  function handleLogTrade(trade: Trade) {
    const updated = [...trades, trade];
    setTrades(updated);
    saveTrades(updated);
  }

  function handleCloseTrade(id: string, exitPrice: number) {
    const updated = trades.map(t => {
      if (t.id !== id) return t;
      const pnl = t.side === 'Long'
        ? (exitPrice - t.entry) * t.size
        : (t.entry - exitPrice) * t.size;
      const rMultiple = pnl / t.actualRisk;
      return { ...t, status: 'Closed' as const, exitPrice, pnl, rMultiple };
    });
    setTrades(updated);
    saveTrades(updated);
  }

  function handleDeleteTrade(id: string) {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated);
    saveTrades(updated);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">RiskDesk</h1>
        <p className="app-subtitle">Position sizing &amp; trade journal</p>
      </header>

      <main className="app-main">
        <AccountSettings initial={account} onChange={handleAccountChange} />

        <div className="main-grid">
          <Calculator account={validAccount} onLogTrade={handleLogTrade} />
          <div className="right-col">
            <Summary trades={trades} />
            <Journal
              trades={trades}
              onClose={handleCloseTrade}
              onDelete={handleDeleteTrade}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

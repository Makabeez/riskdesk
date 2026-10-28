import { useEffect, useState } from 'react';
import { AccountSettings } from './components/AccountSettings';
import { Calculator } from './components/Calculator';
import { Summary } from './components/Summary';
import { TradeJournal } from './components/TradeJournal';
import { closeTrade, type OpenTrade, type Trade } from './lib/journal';
import { loadAccount, loadTrades, saveAccount, saveTrades } from './lib/storage';
import { accountValues, type AccountSettings as Account } from './lib/validate';

export default function App() {
  const [account, setAccount] = useState<Account>(loadAccount);
  const [trades, setTrades] = useState<Trade[]>(loadTrades);

  useEffect(() => saveAccount(account), [account]);
  useEffect(() => saveTrades(trades), [trades]);

  function logTrade(trade: OpenTrade) {
    setTrades((previous) => [trade, ...previous]);
  }

  function closeOpenTrade(id: string, exit: number) {
    setTrades((previous) =>
      previous.map((trade) => (trade.id === id && trade.status === 'open' ? closeTrade(trade, exit) : trade)),
    );
  }

  function deleteTrade(id: string) {
    setTrades((previous) => previous.filter((trade) => trade.id !== id));
  }

  return (
    <main className="container">
      <header>
        <h1>RiskDesk</h1>
        <p className="hint">Size every trade so the risk never exceeds your limit.</p>
      </header>
      <AccountSettings account={account} onChange={setAccount} />
      <Calculator account={accountValues(account)} onLog={logTrade} />
      <Summary trades={trades} />
      <TradeJournal trades={trades} onClose={closeOpenTrade} onDelete={deleteTrade} />
    </main>
  );
}

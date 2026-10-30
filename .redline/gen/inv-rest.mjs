#!/usr/bin/env node
// Redline case generator for INV-02..INV-06 (PRD v1.0): leverage cap, stop side,
// P&L sign and summary, robustness, persistence. Same contract as inv01.mjs:
// exact inputs, exact expected display, one short Kane _test.md per case.
// Journal cases clean up the trades they log, so they never leak into other cases.
//
// Usage: node .redline/gen/inv-rest.mjs   (writes .redline/cases/INV-02 .. INV-06)

import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { size, money, Frac } from './exact.mjs';

const FRONT = '---\nmode: testing\nurl: http://localhost:5176\nheadless: true\n---\n';
const MINUS = '−';

const fill = (c) => [
  `In the Account panel, clear the "Account balance" field and type ${c.balance ?? 10000}.`,
  `Clear the "Risk per trade" field and type ${c.risk ?? 1}.`,
  c.instrument && `In the Position panel, click "${c.instrument}", then click "${c.side ?? 'Long'}".`,
  c.leverage !== undefined && `Clear the "Leverage" field and type ${c.leverage}.`,
  c.entry !== undefined && `Clear the "Entry price" field and type ${c.entry}.`,
  c.stop !== undefined && `Clear the "Stop loss" field and type ${c.stop}.`,
].filter(Boolean).join(' ');

const signedMoney = (fr) => {
  const s = fr.toFixedHalfUp(2);
  return s.startsWith('-') ? `${MINUS}${money(s.slice(1))}` : `+${money(s)}`;
};
const signedR = (fr) => {
  const s = fr.toFixedHalfUp(2);
  return s.startsWith('-') ? `${MINUS}${s.slice(1)}R` : `+${s}R`;
};
const NO_JUNK = 'Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.';
const CLEAR_JOURNAL = '## Start from an empty journal\nScroll to the Journal panel. If it lists any trades, delete each one, confirming each deletion, until it shows no trades.\n';

function trade(c, exit) {
  const x = size(c);
  const E = Frac.of(c.entry), X = Frac.of(exit);
  const pnl = (c.side === 'Short' ? E.sub(X) : X.sub(E)).mul(x.size);
  return { x, pnl, r: pnl.div(x.actual) };
}

const suites = {
  'INV-02': [
    { id: 'L01', ac: 'AC-11', title: 'Leverage one above the BTC cap is refused',
      why: 'An unchecked field accepts 51x on a 50x instrument; a clamping field silently changes it to 50.',
      body: `## Enter the trade\n${fill({ instrument: 'BTC-PERP', leverage: 51, entry: 60000, stop: 59000 })}\n\n## Check the leverage is refused, not clamped\nVerify that the page shows the message "Max leverage for BTC-PERP is 50x", that the Result panel shows no position size, and that the "Leverage" field still shows 51.\n` },
    { id: 'L02', ac: 'AC-11', title: 'Switching to a lower-cap instrument re-checks leverage',
      why: '30x is valid on BTC-PERP (50x) but not on SOL-PERP (20x); an app that only validates on typing keeps the stale result.',
      body: `## Enter a valid BTC trade\n${fill({ instrument: 'BTC-PERP', leverage: 30, entry: 60000, stop: 59000 })} Verify that the Result panel shows a position size of 0.100 BTC.\n\n## Switch instrument without touching leverage\nIn the Position panel, click "SOL-PERP". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 140. Do not change the "Leverage" field.\n\n## Check the cap of the new instrument applies\nVerify that the page shows the message "Max leverage for SOL-PERP is 20x", that the Result panel shows no position size, and that the "Leverage" field still shows 30.\n` },
    { id: 'L03', ac: 'AC-11', title: 'Leverage exactly at the cap is allowed',
      why: 'An off-by-one on the cap (> vs >=) refuses 50x on a 50x instrument.',
      body: (() => {
        const c = { instrument: 'ETH-PERP', side: 'Long', leverage: 50, entry: '3000', stop: '2930', balance: '10000', risk: '1' };
        const x = size(c), margin = x.size.mul(Frac.of(c.entry)).div(new Frac(50n));
        return `## Enter the trade\n${fill(c)}\n\n## Check the cap itself is accepted\nVerify that no leverage error is shown, that the Result panel shows a position size of 1.42 ETH, and that the margin required shown is ${money(margin.toFixedHalfUp(2))}.\n`;
      })() },
  ],
  'INV-03': [
    { id: 'S01', ac: 'AC-08', title: 'Long with the stop above entry is refused',
      why: 'Sizing with |entry - stop| happily sizes a long whose stop is above entry.',
      body: `## Enter the trade\n${fill({ instrument: 'ETH-PERP', side: 'Long', entry: 3000, stop: 3050 })}\n\n## Check it is refused\nVerify that the page shows the message "Stop loss must be below entry for a long" and that the Result panel shows no position size.\n` },
    { id: 'S02', ac: 'AC-10', title: 'Short with the stop below entry is refused',
      why: 'The mirror case of S01 for shorts.',
      body: `## Enter the trade\n${fill({ instrument: 'SOL-PERP', side: 'Short', entry: 150, stop: 145 })}\n\n## Check it is refused\nVerify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel shows no position size.\n` },
    { id: 'S03', ac: 'AC-08', title: 'Stop equal to entry is refused',
      why: 'Risk per unit is zero; a naive division shows Infinity or a huge size.',
      body: `## Enter the trade\n${fill({ instrument: 'ETH-PERP', side: 'Long', entry: 3000, stop: 3000 })}\n\n## Check it is refused\nVerify that the page shows the message "Stop loss must be below entry for a long" and that the Result panel shows no position size. ${NO_JUNK}\n` },
    { id: 'S04', ac: 'AC-08, AC-10', title: 'Flipping side after a result re-validates the stop',
      why: 'A valid long becomes an invalid short when only the side changes; a stale result stays on screen.',
      body: `## Enter a valid long\n${fill({ instrument: 'ETH-PERP', side: 'Long', entry: 3000, stop: 2930 })} Verify that the Result panel shows a position size of 1.42 ETH.\n\n## Flip to short without touching the prices\nIn the Position panel, click "Short".\n\n## Check the result is withdrawn\nVerify that the page shows the message "Stop loss must be above entry for a short" and that the Result panel no longer shows a position size.\n` },
  ],
  'INV-04': (() => {
    const shortWin = { instrument: 'SOL-PERP', side: 'Short', entry: '150', stop: '156', balance: '10000', risk: '1' };
    const longLoss = { instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2930', balance: '10000', risk: '1' };
    const a = trade(shortWin, '141'), b = trade(longLoss, '2965');
    const w = trade(longLoss, '3140'), l = trade(shortWin, '159');
    const total = w.pnl.add(l.pnl), avgR = w.r.add(l.r).div(new Frac(2n));
    const logClose = (c, t, exit, label) =>
      `## Log the ${label}\n${fill(c)} Verify the Result panel shows a position size of ${t.x.sizeStr} ${t.x.unit}, then click "Log trade".\n\n## Close it\nIn the Journal, find the open ${c.instrument} ${c.side} trade with size ${t.x.sizeStr}. Enter ${exit} as its exit price and close it.\n`;
    return [
      { id: 'P01', ac: 'AC-16', title: 'Short closed below entry is a winner',
        why: 'Using (exit - entry) for every side turns a winning short into a loss.',
        body: `${logClose(shortWin, a, '141', 'short')}\n## Check the sign\nVerify that this closed trade shows a realized P&L of ${signedMoney(a.pnl)} and an R multiple of ${signedR(a.r)}.\n\n## Clean up\nDelete this trade from the Journal, confirming the deletion.\n` },
      { id: 'P02', ac: 'AC-15', title: 'Long closed below entry is a loser',
        why: 'The long-side mirror: P&L and R must both be negative.',
        body: `${logClose(longLoss, b, '2965', 'long')}\n## Check the sign\nVerify that this closed trade shows a realized P&L of ${signedMoney(b.pnl)} and an R multiple of ${signedR(b.r)}, both negative.\n\n## Clean up\nDelete this trade from the Journal, confirming the deletion.\n` },
      { id: 'P03', ac: 'AC-19', title: 'Summary of one winner and one loser',
        why: 'Averages over the wrong set (open trades, or R vs $) give the wrong win rate or average R.',
        body: `${CLEAR_JOURNAL}\n${logClose(longLoss, w, '3140', 'winning long')}\n${logClose(shortWin, l, '159', 'losing short')}\n## Check the summary\nVerify that the performance summary shows 2 closed trades, a win rate of 50%, a total realized P&L of ${signedMoney(total)} and an average R of ${signedR(avgR)}.\n\n## Clean up\nDelete both trades from the Journal, confirming each deletion.\n` },
    ];
  })(),
  'INV-05': [
    { id: 'N01', ac: 'AC-02', title: 'Risk above 5% is refused',
      why: 'An unchecked risk field sizes a 5.1% trade.',
      body: `## Enter the trade\n${fill({ risk: '5.1', instrument: 'ETH-PERP', entry: 3000, stop: 2930 })}\n\n## Check it is refused\nVerify that the page shows the message "Risk must be between 0.1% and 5%" and that the Result panel shows no position size. ${NO_JUNK}\n` },
    { id: 'N02', ac: 'AC-03', title: 'Zero balance is refused',
      why: 'A zero balance gives a zero budget and a 0.00 size that looks valid.',
      body: `## Enter the trade\n${fill({ balance: 0, instrument: 'ETH-PERP', entry: 3000, stop: 2930 })}\n\n## Check it is refused\nVerify that the page shows the message "Balance must be a positive number" and that the Result panel shows no position size. ${NO_JUNK}\n\n## Restore the balance\nClear the "Account balance" field and type 10000.\n` },
    { id: 'N03', ac: 'AC-21, AC-22', title: '1e9 and letters in price fields',
      why: 'parseFloat("1e9") is a valid number and parseFloat("abc") is NaN; both must be inline errors.',
      body: `## Enter an absurd entry\n${fill({ instrument: 'ETH-PERP', entry: '1e9', stop: 2930 })}\n\n## Check it is refused\nVerify that an error is shown next to the "Entry price" field and that the Result panel shows no position size. ${NO_JUNK}\n\n## Enter letters as the stop\nClear the "Entry price" field and type 3000. Clear the "Stop loss" field and type abc.\n\n## Check it is refused\nVerify that an error is shown next to the "Stop loss" field, that the Result panel shows no position size, and that the page has not gone blank. ${NO_JUNK}\n` },
  ],
  'INV-06': [
    { id: 'R01', ac: 'AC-04', title: 'Account settings survive a reload',
      why: 'Settings kept only in component state are lost on reload.',
      body: `## Change the settings\n${fill({ balance: '12500.50', risk: 2 })}\n\n## Reload\nReload the page.\n\n## Check they persisted\nVerify that the "Account balance" field shows 12500.50 (written 12,500.50 or 12500.50) and the "Risk per trade" field shows 2.\n\n## Restore the defaults\nClear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1.\n` },
    { id: 'R02', ac: 'AC-17, AC-18', title: 'Logged trade survives reload; deleted trade stays deleted',
      why: 'Journal writes that skip storage, or deletes that only touch state, come back after a reload.',
      body: `${CLEAR_JOURNAL}\n## Log a trade\n${fill({ instrument: 'ETH-PERP', side: 'Long', entry: 3000, stop: 2930 })} Click "Log trade".\n\n## Reload and check it is still there\nReload the page. Verify that the Journal lists an open ETH-PERP Long trade with size 1.42.\n\n## Delete, reload and check it is gone\nDelete that trade, confirming the deletion. Reload the page. Verify that the Journal no longer lists any ETH-PERP trade with size 1.42.\n` },
  ],
};

for (const [inv, cases] of Object.entries(suites)) {
  const out = join('.redline/cases', inv);
  mkdirSync(out, { recursive: true });
  for (const f of readdirSync(out)) if (/_test\.md$/.test(f)) unlinkSync(join(out, f));
  const manifest = cases.map((c) => {
    const file = `${c.id}-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}_test.md`;
    writeFileSync(join(out, file), `${FRONT}\n${c.body}`);
    return { id: c.id, invariant: inv, ac: c.ac, file, title: c.title, why: c.why };
  });
  writeFileSync(join(out, 'cases.json'), JSON.stringify(manifest, null, 2) + '\n');
  for (const m of manifest) console.log(`${inv}  ${m.id}  ${m.ac.padEnd(12)} ${m.title}`);
}

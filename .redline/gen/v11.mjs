#!/usr/bin/env node
// Redline case generator for change request v1.1 (fees per side, XRP-PERP).
// Same contract as inv01.mjs: exact inputs, exact expected display, one short Kane _test.md per case.
// Every case that sets a fee ends by resetting it to 0, so a persisted setting can never leak
// into the v1.0 cases and fake a regression.
//
// Usage: node .redline/gen/v11.mjs [--out .redline/cases/V11]

import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { size, money, Frac, INSTRUMENTS } from './exact.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = opt('--out', '.redline/cases/V11');
const FRONT = '---\nmode: testing\nurl: http://localhost:5176\nheadless: true\n---\n';

const fill = (c) => [
  `In the Account panel, clear the "Account balance" field and type ${c.balance}.`,
  `Clear the "Risk per trade" field and type ${c.risk}.`,
  `Clear the "Fee per side" field and type ${c.fee}.`,
  `In the Position panel, click "${c.instrument}", then click "${c.side}".`,
  `Clear the "Leverage" field and type ${c.leverage ?? 10}.`,
  `Clear the "Entry price" field and type ${c.entry}.`,
  `Clear the "Stop loss" field and type ${c.stop}.`,
].join(' ');
const RESET = `## Reset the fee\nIn the Account panel, clear the "Fee per side" field and type 0.\n`;
const sizeWords = (x) => {
  if (x.unit !== 'XRP') return `exactly ${x.sizeStr} ${x.unit}`;
  const grouped = x.sizeStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return grouped === x.sizeStr ? `exactly ${x.sizeStr} XRP` : `exactly ${grouped} XRP (written ${grouped} or ${x.sizeStr})`;
};

function sized(id, ac, title, why, c) {
  const x = size(c);
  const risk = money(x.actual.toFixedHalfUp(2)); // CR v1.1: display rounds half-up to the cent
  return { id, ac, title, why, inputs: c, expect: { size: `${x.sizeStr} ${x.unit}`, actualRisk: risk, costPerUnit: x.perUnit.toFixedExact(6) },
    body:
`## Enter the trade
${fill(c)}

## Check the size and the risk
Verify that the Result panel shows a position size of ${sizeWords(x)}, that the actual risk shown is exactly ${risk}, which is within the ${money(x.budget.toFixedHalfUp(2))} risk budget (balance ${c.balance} multiplied by ${c.risk}%). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

${c.fee !== '0' ? RESET : ''}` };
}

function refused(id, ac, title, why, c, message, extra = '') {
  return { id, ac, title, why, inputs: c, expect: { message, result: 'none' },
    body:
`## Enter the trade
${fill(c)}

## Check that it is refused
Verify that the page shows the message "${message}"${extra} and that the Result panel shows no position size. Store the displayed message as displayed_message.

${c.fee !== '0' ? RESET : ''}` };
}

function journalCase(id, ac, title, why, c, exit) {
  const x = size(c);
  const f = Frac.of(c.fee).div(new Frac(100n));
  const E = Frac.of(c.entry), X = Frac.of(exit);
  const gross = c.side === 'Long' ? X.sub(E).mul(x.size) : E.sub(X).mul(x.size);
  const net = gross.sub(f.mul(x.size).mul(E.add(X)));
  const pnl = money((net.cmp(new Frac(0n)) >= 0 ? '+' : '') + net.toFixedHalfUp(2)).replace('$+', '+$');
  const r = net.div(x.actual).toFixedHalfUp(2);
  const rStr = (r.startsWith('-') ? '−' + r.slice(1) : '+' + r) + 'R';
  return { id, ac, title, why, inputs: { ...c, exit }, expect: { size: `${x.sizeStr} ${x.unit}`, pnl, r: rStr },
    body:
`## Enter and log the trade
${fill(c)} Verify the Result panel shows a position size of exactly ${x.sizeStr} ${x.unit}, then click "Log trade".

## Close the trade
In the Journal, find the open ${c.instrument} ${c.side} trade you just logged with size ${x.sizeStr}. Enter ${exit} as its exit price and close it.

## Check net P&L and R
Verify that this closed trade shows a realized P&L of ${pnl} and an R multiple of ${rStr}. Store the displayed P&L as pnl_before and the displayed R multiple as r_before.

## Change the fee and check the trade did not change
In the Account panel, clear the "Fee per side" field and type 0. Verify that the same closed trade in the Journal still shows a realized P&L of ${pnl} and an R multiple of ${rStr}.
` };
}

const cases = [
  sized('V01', 'AC-25', 'Fee example on ETH: 1.37, not 1.42',
    '', // filled from exact math below
    { balance: '10000', risk: '1', fee: '0.05', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2930' }),
  sized('V02', 'AC-26', 'Fee example on BTC: 0.094',
    '', // filled from exact math below
    { balance: '10000', risk: '1', fee: '0.05', instrument: 'BTC-PERP', side: 'Long', entry: '60000', stop: '59000' }),
  sized('V03', 'AC-24', 'Fee charged on both sides, not entry only',
    '', { balance: '10000', risk: '1', fee: '0.05', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2980' }),
  sized('V04', 'AC-24', 'Fees on a short',
    'Cost per unit is |entry - stop| + f x (entry + stop) whatever the side.',
    { balance: '10000', risk: '1', fee: '0.05', instrument: 'ETH-PERP', side: 'Short', entry: '3000', stop: '3020' }),
  refused('V05', 'AC-23', 'Fee above 0.1% is refused',
    'An unchecked fee field accepts 0.11% and sizes anyway.',
    { balance: '10000', risk: '1', fee: '0.11', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2930' },
    'Fee must be between 0% and 0.1%'),
  sized('V06', 'AC-29', 'XRP sizes in whole units',
    'Lot step 1: the size must be a whole number with no decimals.',
    { balance: '10000', risk: '1', fee: '0', instrument: 'XRP-PERP', side: 'Long', entry: '0.50', stop: '0.48' }),
  refused('V07', 'AC-30', 'XRP below the minimum of 10 (not the lot step of 1)',
    'Raw size is 5 XRP: valid for the lot step, below the minimum. Checking the lot step instead of the minimum lets it through.',
    { balance: '100', risk: '0.1', fee: '0', instrument: 'XRP-PERP', side: 'Long', entry: '0.50', stop: '0.48' },
    'Position too small for minimum lot size', ', that the "Log trade" button is disabled'),
  refused('V08', 'AC-31', 'XRP leverage cap is 25x',
    'A new instrument added without its own cap falls back to another instrument\'s 50x.',
    { balance: '10000', risk: '1', fee: '0', instrument: 'XRP-PERP', side: 'Long', entry: '0.50', stop: '0.48', leverage: 26 },
    'Max leverage for XRP-PERP is 25x'),
  journalCase('V09', 'AC-27, AC-28', 'Net P&L after fees, pinned to the trade',
    'P&L must subtract fees on entry and exit, and keep the fee rate the trade was logged with.',
    { balance: '10000', risk: '1', fee: '0.05', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2930' }, '3140'),
];

// V01/V02: what an app that ignores the fee sizes, and what that really risks once fees are paid.
for (const i of [0, 1]) {
  const c = cases[i].inputs, ok = size(c), noFee = size({ ...c, fee: '0' });
  const real = noFee.size.mul(ok.perUnit);
  cases[i].why = `Ignoring the fee sizes ${noFee.sizeStr} ${noFee.unit}, which really risks ${money(real.toFixedHalfUp(2))} once fees are paid; the budget is ${money(ok.budget.toFixedHalfUp(2))}.`;
}
// Fill in V03's "why" from the exact numbers: what an entry-only fee would size and really risk.
{
  const c = cases[2].inputs, ok = size(c);
  const f = Frac.of(c.fee).div(new Frac(100n)), lot = Frac.of(INSTRUMENTS[c.instrument].lot);
  const lotsEntryOnly = ok.budget.div(Frac.of(c.entry).sub(Frac.of(c.stop)).add(f.mul(Frac.of(c.entry)))).div(lot).floor();
  const realRisk = new Frac(lotsEntryOnly).mul(lot).mul(ok.perUnit);
  cases[2].why = `Correct size ${ok.sizeStr} ETH; charging the fee on entry only sizes ${new Frac(lotsEntryOnly).mul(lot).toFixedExact(2)} ETH, which really risks ${money(realRisk.toFixedHalfUp(2))} on a $100.00 budget.`;
}

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (/^V\d+.*_test\.md$/.test(f)) unlinkSync(join(OUT, f));
const manifest = cases.map((c) => {
  const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const file = `${c.id}-${slug}_test.md`;
  writeFileSync(join(OUT, file), `${FRONT}\n${c.body}`.replace(/\n{3,}/g, '\n\n'));
  return { id: c.id, invariant: 'V1.1', ac: c.ac, file, title: c.title, why: c.why, inputs: c.inputs, expect: c.expect };
});
writeFileSync(join(OUT, 'cases.json'), JSON.stringify(manifest, null, 2) + '\n');
for (const m of manifest) console.log(`${m.id}  ${m.ac.padEnd(12)} ${JSON.stringify(m.expect)}\n     ${m.why}`);

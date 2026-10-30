#!/usr/bin/env node
// Redline case generator for INV-01 (PRD AC-05..07, AC-09, AC-12..14).
// Writes one short Kane _test.md per adversarial case into .redline/cases/INV-01/.
// Each case carries exact inputs and the exact expected display, computed with
// BigInt fractions, so a failing case IS the frozen exploit: nothing to recover.
//
// Usage: node .redline/gen/inv01.mjs [--out .redline/cases/INV-01] [--only C01,C09]

import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { size, money, naiveFloatLots, nearestLots, Frac, INSTRUMENTS } from './exact.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = opt('--out', '.redline/cases/INV-01');
const ONLY = opt('--only', '')?.split(',').filter(Boolean);

// The URL is a placeholder: the runner always passes --url for the build under attack.
const FRONT = '---\nmode: testing\nurl: http://localhost:5176\nheadless: true\n---\n';

const fill = (c) => [
  `In the Account panel, clear the "Account balance" field and type ${c.balance}.`,
  `Clear the "Risk per trade" field and type ${c.risk}.`,
  `In the Position panel, click "${c.instrument}", then click "${c.side}".`,
  `Clear the "Leverage" field and type ${c.leverage ?? 10}.`,
  `Clear the "Entry price" field and type ${c.entry}.`,
  `Clear the "Stop loss" field and type ${c.stop}.`,
].join(' ');

function sizedCase(id, title, why, c) {
  const x = size(c);
  const exactRisk = x.actual.toFixedExact(2);
  const budgetStr = x.budget.toFixedExact(6) ?? x.budget.toNumber().toString();
  const riskLine = exactRisk
    ? `the actual risk shown is exactly ${money(exactRisk)}`
    : `the actual risk shown is at most ${money(x.budget.toFixedHalfUp(2))}`;
  return {
    id, title, why, inputs: c,
    expect: { size: `${x.sizeStr} ${x.unit}`, actualRisk: exactRisk, budget: budgetStr },
    body:
`## Enter the trade
${fill(c)}

## Check the size and the risk
Verify that the Result panel shows a position size of exactly ${x.sizeStr} ${x.unit} and that ${riskLine}. The risk budget here is ${c.balance} multiplied by ${c.risk}%, which is ${money(x.budget.toFixedHalfUp(2))} to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.
`,
  };
}

function belowMinCase(id, title, why, c) {
  return {
    id, title, why, inputs: c, expect: { message: 'Position too small for minimum lot size', logTrade: 'disabled' },
    body:
`## Enter the trade
${fill(c)}

## Check that the trade cannot be logged
Verify that the page shows the message "Position too small for minimum lot size" and that the "Log trade" button is disabled and cannot be clicked. Store the displayed message as displayed_message.
`,
  };
}

function emptyLogCase(id, title, why) {
  return {
    id, title, why, inputs: { entry: '', stop: '' }, expect: { journalRows: 'unchanged' },
    body:
`## Count the journal before
Scroll to the Journal panel. Store the number of trade rows in the journal as rows_before (0 if it shows "No trades logged yet").

## Try to log without a position
In the Position panel, clear the "Entry price" field and the "Stop loss" field so both are empty. Click the "Log trade" button if it can be clicked.

## Check that nothing was logged
Verify that the number of trade rows in the Journal panel is still equal to rows_before, and that no new trade row appeared.
`,
  };
}

// Display trap: budget has a third decimal >= 5, actual risk lands between x.xx5 and the budget.
// An app that truncates the budget but rounds the risk shows risk > budget on screen.
function findDisplayTrap() {
  for (const balance of ['10000.75', '20000.5', '7500.85']) for (const risk of ['1', '0.5', '2']) {
    const budget = Frac.of(balance).mul(Frac.of(risk)).div(new Frac(100n));
    const cents = budget.toFixedHalfUp(2);
    if (Frac.of(cents).cmp(budget) <= 0) continue; // need a budget that rounds UP to the cent
    for (const entry of ['3000', '2500']) for (let k = 6000; k >= 100; k--) {
      const stop = Frac.of(entry).sub(new Frac(BigInt(k), 100n)).toFixedExact(2);
      const c = { balance, risk, instrument: 'ETH-PERP', side: 'Long', entry, stop };
      const x = size(c); if (x.belowMin) continue;
      const lowCut = Frac.of(cents).sub(new Frac(5n, 1000n)); // x.xx5 below the half-up budget
      if (x.actual.cmp(lowCut) > 0 && x.actual.cmp(budget) <= 0 && budget.toFixedExact(2) === null) return c;
    }
  }
  return null;
}

const cases = [];
cases.push(sizedCase('C01', 'PRD AC-06 worked example: round down, not to nearest',
  'Round-to-nearest gives 1.43 ETH and $100.10 risk, over the $100.00 budget.',
  { balance: '10000', risk: '1', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2930' }));
cases.push(sizedCase('C02', 'PRD AC-05 worked example: risk exactly equal to budget',
  'Raw size lands exactly on a lot step; actual risk must equal the budget, not exceed it.',
  { balance: '10000', risk: '1', instrument: 'BTC-PERP', side: 'Long', entry: '60000', stop: '59000' }));
cases.push(sizedCase('C03', 'PRD AC-09 worked example: short on SOL',
  'Short sizing uses |entry - stop| with the stop above entry.',
  { balance: '10000', risk: '1', instrument: 'SOL-PERP', side: 'Short', entry: '150', stop: '156' }));

// Float trap: exact answer is an integer number of lots, binary floats land one lot short.
const floatC = { balance: '10000', risk: '0.3', instrument: 'SOL-PERP', side: 'Long', entry: '150', stop: '149.7' };
const fl = naiveFloatLots(floatC);
cases.push(sizedCase('C04', 'Float trap on SOL: exact lot count, floats undershoot',
  `Exact size is ${size(floatC).sizeStr} SOL; Math.floor on doubles gives ${fl} lots (${(fl * 0.1).toFixed(1)} SOL).`,
  floatC));
const floatE = { balance: '2500', risk: '0.3', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2999.7' };
cases.push(sizedCase('C05', 'Float trap on ETH with a 30-cent stop',
  `Exact size is ${size(floatE).sizeStr} ETH; Math.floor on doubles gives ${naiveFloatLots(floatE)} lots.`,
  floatE));

// Cents trap: budget with fractional cents, round-to-nearest lands over it by a fraction of a cent.
const centsC = { balance: '10000.37', risk: '1', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2999.7' };
cases.push(sizedCase('C06', 'Fractional-cent budget: nearest lot overshoots by $0.0013',
  `Budget is $${size(centsC).budget.toFixedExact(4)}; round-to-nearest gives ${nearestLots(centsC)} lots, $0.0013 over budget.`,
  centsC));

const disp = findDisplayTrap();
if (disp) cases.push(sizedCase('C07', 'Display trap: actual risk within a half cent of the budget',
  'Budget has a third decimal; an app that truncates the budget but rounds the risk shows risk > budget on screen.',
  disp));

cases.push(belowMinCase('C08', 'PRD AC-12: below the minimum lot',
  'Raw size rounds down to 0.00 ETH; the trade must be refused, not logged as an empty position.',
  { balance: '100', risk: '0.1', instrument: 'ETH-PERP', side: 'Long', entry: '3000', stop: '2000' }));
cases.push(sizedCase('C09', 'Exactly the minimum lot is allowed',
  'Raw size is exactly 0.001 BTC; an off-by-one on the minimum refuses a valid trade.',
  { balance: '10000', risk: '0.1', instrument: 'BTC-PERP', side: 'Long', entry: '60000', stop: '50000' }));
cases.push(emptyLogCase('C10', 'Log trade with no position sized (AC-14)',
  'AC-14 logs a trade only from a valid calculation; an always-enabled button can log an empty trade.'));

// ---- write
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (/^C\d+.*_test\.md$/.test(f)) unlinkSync(join(OUT, f));
const manifest = [];
for (const c of cases) {
  if (ONLY.length && !ONLY.includes(c.id)) continue;
  const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const file = `${c.id}-${slug}_test.md`;
  writeFileSync(join(OUT, file), `${FRONT}\n${c.body}`);
  manifest.push({ id: c.id, invariant: 'INV-01', file, title: c.title, why: c.why, inputs: c.inputs, expect: c.expect });
}
writeFileSync(join(OUT, 'cases.json'), JSON.stringify(manifest, null, 2) + '\n');
for (const m of manifest) console.log(`${m.id}  ${m.file}\n     ${m.why}`);

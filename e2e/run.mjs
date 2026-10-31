// End-to-end check of RiskDesk against the PRD acceptance criteria, in real Chrome.
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:5199/';
const SHOTS = new URL('./', import.meta.url).pathname;

const results = [];
const problems = []; // console errors, failed requests, forbidden text
function check(id, label, pass, detail = '') {
  results.push({ id, label, pass: !!pass, detail });
}

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function newPage(width = 1280, height = 900) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width, height });
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') problems.push(`console.${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('response', (res) => {
    if (res.status() >= 400) problems.push(`HTTP ${res.status()} ${res.url()}`);
  });
  page.on('requestfailed', (req) => problems.push(`request failed: ${req.url()} ${req.failure()?.errorText}`));
  page.on('dialog', (d) => {
    problems.push(`unexpected native dialog: ${d.message()}`);
    d.dismiss();
  });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  return { page, context };
}

const val = (page, sel) => page.$eval(sel, (el) => el.value);
const text = (page, sel) => page.$eval(sel, (el) => el.textContent.replace(/\s+/g, ' ').trim()).catch(() => null);
const exists = async (page, sel) => (await page.$(sel)) !== null;

async function fill(page, sel, value) {
  await page.click(sel, { clickCount: 3 });
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  if (value !== '') await page.type(sel, value);
}
const pick = (page, value) => page.click(`label.segmented__option[data-value="${value}"]`);
const fieldError = (page, id) => text(page, `#${id}-message.field__error`);

async function forbiddenText(page, where) {
  const body = await page.evaluate(() => document.body.innerText);
  for (const word of ['NaN', 'Infinity', 'undefined']) {
    if (body.includes(word)) problems.push(`"${word}" visible on page (${where})`);
  }
}

async function setup(page, { balance = '10000', risk = '1', instrument = 'BTC-PERP', side = 'long', entry, stop, leverage = '10' }) {
  await fill(page, '#balance', balance);
  await fill(page, '#risk', risk);
  await pick(page, instrument);
  await pick(page, side);
  await fill(page, '#entry', entry);
  await fill(page, '#stop', stop);
  await fill(page, '#leverage', leverage);
}

async function readResult(page) {
  return {
    size: await text(page, '[data-testid=position-size]'),
    risk: await text(page, '[data-testid=actual-risk]'),
    notional: await text(page, '[data-testid=notional]'),
    margin: await text(page, '[data-testid=margin]'),
  };
}

const rowCells = (page, index = 0) =>
  page.$$eval('tr[data-testid=trade-row]', (rows, i) => {
    const row = rows[i];
    if (!row) return null;
    return Object.fromEntries([...row.querySelectorAll('td[data-label]')].map((td) => [td.dataset.label, td.textContent.replace(/\s+/g, ' ').trim()]));
  }, index);
const rowCount = (page) => page.$$eval('tr[data-testid=trade-row]', (rows) => rows.length);

// ---------------- Desktop flows ----------------
{
  // NFR-03: LCP on a fresh load.
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  await page.click('h1'); // LCP is finalized on first input
  const lcp = await page.evaluate(() => window.__lcp);
  check('NFR-03', `LCP ${Math.round(lcp)} ms (< 2500)`, lcp > 0 && lcp < 2500);
  await context.close();
}

const { page, context } = await newPage();

// AC-01
check('AC-01', 'default balance', (await val(page, '#balance')) === '10,000.00', await val(page, '#balance'));
check('AC-01', 'default risk', (await val(page, '#risk')) === '1', await val(page, '#risk'));
check('AC-01', 'default leverage 10x', (await val(page, '#leverage')) === '10');
check('AC-20', 'empty summary text', (await text(page, '.summary__empty')) === 'No closed trades yet');
await forbiddenText(page, 'initial');

// AC-02
await setup(page, { instrument: 'BTC-PERP', entry: '60000', stop: '59000' });
for (const risk of ['6', '0.05', '5.1', 'abc']) {
  await fill(page, '#risk', risk);
  const err = await fieldError(page, 'risk');
  check('AC-02', `risk "${risk}" → error, no result`, err === 'Risk must be between 0.1% and 5%' && !(await exists(page, '[data-testid=position-size]')), err);
}
for (const risk of ['0.1', '5']) {
  await fill(page, '#risk', risk);
  check('AC-02', `risk "${risk}" accepted`, (await fieldError(page, 'risk')) === null && (await exists(page, '[data-testid=position-size]')));
}
await fill(page, '#risk', '1');

// AC-03
for (const balance of ['0', '-500', 'abc', '']) {
  await fill(page, '#balance', balance);
  const err = await fieldError(page, 'balance');
  check('AC-03', `balance "${balance}" → error, no result`, err === 'Balance must be a positive number' && !(await exists(page, '[data-testid=position-size]')), err);
  await forbiddenText(page, `balance ${balance}`);
}
await fill(page, '#balance', '10000');
await page.click('#risk'); // blur balance
check('AC-01', 'balance tidies to 10,000.00 on blur', (await val(page, '#balance')) === '10,000.00', await val(page, '#balance'));

// AC-04
await fill(page, '#balance', '25000');
await fill(page, '#risk', '2');
await page.reload({ waitUntil: 'networkidle0' });
check('AC-04', 'balance persisted across reload', ['25000', '25,000.00'].includes(await val(page, '#balance')), await val(page, '#balance'));
check('AC-04', 'risk persisted across reload', (await val(page, '#risk')) === '2', await val(page, '#risk'));

// AC-05
await setup(page, { instrument: 'BTC-PERP', side: 'long', entry: '60,000', stop: '59,000', leverage: '10' });
let r = await readResult(page);
check('AC-05', 'BTC long result', r.size === '0.100 BTC' && r.risk === '$100.00' && r.notional === '$6,000.00' && r.margin === '$600.00', JSON.stringify(r));

// AC-06
await setup(page, { instrument: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
r = await readResult(page);
check('AC-06', 'ETH rounds down', r.size === '1.42 ETH' && r.risk === '$99.40', JSON.stringify(r));
const resultText = await text(page, '.result');
check('AC-06', 'never shows 1.43', !resultText.includes('1.43'));

// AC-08
for (const stop of ['3000', '3100']) {
  await setup(page, { instrument: 'ETH-PERP', side: 'long', entry: '3000', stop });
  const err = await fieldError(page, 'stop');
  check('AC-08', `long stop ${stop} ≥ entry → error`, err === 'Stop loss must be below entry for a long' && !(await exists(page, '[data-testid=position-size]')), err);
}

// AC-09
await setup(page, { instrument: 'SOL-PERP', side: 'short', entry: '150', stop: '156' });
r = await readResult(page);
check('AC-09', 'SOL short result', r.size === '16.6 SOL' && r.risk === '$99.60' && r.notional === '$2,490.00', JSON.stringify(r));

// AC-10
for (const stop of ['150', '140']) {
  await setup(page, { instrument: 'SOL-PERP', side: 'short', entry: '150', stop });
  const err = await fieldError(page, 'stop');
  check('AC-10', `short stop ${stop} ≤ entry → error`, err === 'Stop loss must be above entry for a short' && !(await exists(page, '[data-testid=position-size]')), err);
}

// AC-11
await setup(page, { instrument: 'SOL-PERP', side: 'short', entry: '150', stop: '156', leverage: '25' });
let err = await fieldError(page, 'leverage');
check('AC-11', 'SOL 25x → error, no result', err === 'Max leverage for SOL-PERP is 20x' && !(await exists(page, '[data-testid=position-size]')), err);
check('AC-11', 'leverage not clamped', (await val(page, '#leverage')) === '25');
await pick(page, 'BTC-PERP');
check('AC-11', 'same 25x valid on BTC-PERP', (await fieldError(page, 'leverage')) === null);
await fill(page, '#leverage', '60');
err = await fieldError(page, 'leverage');
check('AC-11', 'BTC 60x → its own cap', err === 'Max leverage for BTC-PERP is 50x', err);

// AC-12
await setup(page, { balance: '100', risk: '0.1', instrument: 'ETH-PERP', side: 'long', entry: '3000', stop: '2000' });
const tooSmall = await text(page, '[data-testid=too-small]');
const logDisabled = await page.$eval('.result .btn--primary', (b) => b.disabled);
check('AC-12', 'too small message + Log disabled', tooSmall?.includes('Position too small for minimum lot size') && logDisabled, tooSmall);

// AC-13 (BTC 3, ETH 2, SOL 1 decimals) covered by AC-05/06/09 strings
check('AC-13', 'lot-step decimals', results.filter((x) => ['AC-05', 'AC-06', 'AC-09'].includes(x.id)).every((x) => x.pass));

// AC-14
await setup(page, { instrument: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
await page.click('.result .btn--primary');
let row = await rowCells(page, 0);
check('AC-14', 'logged row', row && row.Instrument === 'ETH-PERP' && row.Side === 'Long' && row.Size === '1.42 ETH' && row.Entry === '3,000.00' && row.Stop === '2,930.00' && row['Actual risk'] === '$99.40' && row.Status === 'Open', JSON.stringify(row));

// AC-15
const closeFirstRow = async (exit) => {
  const input = await page.$('tr[data-testid=trade-row] .close-form input');
  await input.click({ clickCount: 3 });
  await input.type(exit);
  await page.click('tr[data-testid=trade-row] .close-form button[type=submit]');
};
await closeFirstRow('3140');
row = await rowCells(page, 0);
check('AC-15', 'long winner closed', row.Status === 'Closed' && row['P&L'] === '+$198.80' && row.R === '+2.00R', JSON.stringify(row));

// AC-16
await setup(page, { instrument: 'SOL-PERP', side: 'short', entry: '150', stop: '156' });
await page.click('.result .btn--primary');
await closeFirstRow('159');
row = await rowCells(page, 0);
check('AC-16', 'short loser closed', row.Status === 'Closed' && row['P&L'] === '−$149.40' && row.R === '−1.50R' && row.Size === '16.6 SOL', JSON.stringify(row));

// AC-19
const summary = async () => ({
  closed: await text(page, '[data-testid=summary-closed]'),
  winRate: await text(page, '[data-testid=summary-win-rate]'),
  total: await text(page, '[data-testid=summary-total-pnl]'),
  avgR: await text(page, '[data-testid=summary-average-r]'),
});
let s = await summary();
check('AC-19', 'summary of 2 closed', s.closed === '2' && s.winRate === '50%' && s.total === '+$49.40' && s.avgR === '+0.25R', JSON.stringify(s));

// AC-19: an open trade is excluded
await setup(page, { instrument: 'BTC-PERP', side: 'long', entry: '60000', stop: '59000' });
await page.click('.result .btn--primary');
s = await summary();
check('AC-19', 'open trade excluded', s.closed === '2' && s.total === '+$49.40' && s.avgR === '+0.25R', JSON.stringify(s));

// AC-17
const before = await page.$$eval('tr[data-testid=trade-row]', (rows) => rows.map((r) => r.innerText));
await page.reload({ waitUntil: 'networkidle0' });
const after = await page.$$eval('tr[data-testid=trade-row]', (rows) => rows.map((r) => r.innerText));
check('AC-17', 'journal unchanged after reload', JSON.stringify(before) === JSON.stringify(after) && after.length === 3, `${after.length} rows`);

// AC-21 for the exit field
for (const bad of ['0', '-5', '1e9', 'abc']) {
  const input = await page.$('tr[data-testid=trade-row] .close-form input');
  await input.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await input.type(bad);
  await page.click('tr[data-testid=trade-row] .close-form button[type=submit]');
  const msg = await text(page, 'tr[data-testid=trade-row] .close-form .field__error');
  const status = (await rowCells(page, 0)).Status;
  check('AC-21', `exit "${bad}" → inline error, stays open`, msg && status === 'Open', msg);
  await forbiddenText(page, `exit ${bad}`);
}
const emptyInput = await page.$('tr[data-testid=trade-row] .close-form input');
await emptyInput.click({ clickCount: 3 });
await page.keyboard.press('Backspace');
await page.click('tr[data-testid=trade-row] .close-form button[type=submit]');
check('AC-21', 'empty exit → inline error', await text(page, 'tr[data-testid=trade-row] .close-form .field__error'));

// AC-18
const deleteFirst = () => page.click('tr[data-testid=trade-row] .trades__actions button');
await deleteFirst();
const dialogOpen = await page.$eval('dialog.dialog', (d) => d.open);
check('AC-18', 'delete asks for confirmation', dialogOpen && (await text(page, 'dialog.dialog'))?.includes('Delete this trade?'));
await page.click('dialog.dialog .btn--secondary'); // Cancel
check('AC-18', 'cancel keeps the trade', (await rowCount(page)) === 3 && !(await page.$eval('dialog.dialog', (d) => d.open)));
await deleteFirst();
await page.keyboard.press('Escape');
check('AC-18', 'Esc keeps the trade', (await rowCount(page)) === 3);
await deleteFirst();
await page.click('dialog.dialog .btn--danger'); // Delete trade
check('AC-18', 'confirm deletes', (await rowCount(page)) === 2);
await page.reload({ waitUntil: 'networkidle0' });
check('AC-18', 'stays deleted after reload', (await rowCount(page)) === 2);

// AC-21 for calculator fields
await setup(page, { instrument: 'BTC-PERP', side: 'long', entry: '60000', stop: '59000' });
for (const id of ['balance', 'risk', 'entry', 'stop', 'leverage']) {
  for (const bad of ['0', '-5', '1e9', 'abc']) {
    await fill(page, `#${id}`, bad);
    const msg = await fieldError(page, id);
    // The error must be inside the same .field wrapper as the input (NFR-04).
    const nextToField = await page.$eval(`#${id}`, (el) => !!el.closest('.field')?.querySelector('.field__error'));
    check('AC-21', `${id} "${bad}" → inline error`, msg && nextToField && !(await exists(page, '[data-testid=position-size]')), msg);
    await forbiddenText(page, `${id} ${bad}`);
  }
  await setup(page, { instrument: 'BTC-PERP', side: 'long', entry: '60000', stop: '59000' });
}

// NFR-04: every input has a visible label
const unlabeled = await page.$$eval('input', (inputs) =>
  inputs
    .filter((i) => {
      if (i.type === 'radio') {
        const label = i.closest('label');
        return !(label && label.innerText.trim() && label.getBoundingClientRect().width > 0);
      }
      const label = document.querySelector(`label[for="${i.id}"]`);
      return !(label && label.innerText.trim() && label.getBoundingClientRect().width > 0);
    })
    .map((i) => i.id || i.name),
);
check('NFR-04', 'every input has a visible label', unlabeled.length === 0, unlabeled.join(','));

await page.screenshot({ path: `${SHOTS}desktop.png`, fullPage: true });
await forbiddenText(page, 'desktop end');
await context.close();

// ---------------- Mobile 375 px ----------------
{
  const { page, context } = await newPage(375, 812);
  const overflow = async (where) => {
    const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    check('NFR-05', `no horizontal scroll at 375px (${where}: ${sw}/${cw})`, sw <= cw);
  };
  await overflow('initial');
  await setup(page, { instrument: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
  await overflow('result');
  await page.click('.result .btn--primary');
  await setup(page, { instrument: 'SOL-PERP', side: 'short', entry: '150', stop: '156' });
  await page.click('.result .btn--primary');
  await closeFirstRowOn(page, '159');
  await overflow('journal');
  await fill(page, '#leverage', '25');
  await fill(page, '#balance', 'abc');
  await overflow('errors');
  await setup(page, { balance: '100000000', risk: '5', instrument: 'BTC-PERP', side: 'long', entry: '9999999.99', stop: '9999999.98' });
  await overflow('huge numbers');
  await forbiddenText(page, 'huge numbers');
  await setup(page, { instrument: 'ETH-PERP', side: 'long', entry: '3000', stop: '2930' });
  await page.screenshot({ path: `${SHOTS}mobile.png`, fullPage: true });
  await page.click('tr[data-testid=trade-row] .trades__actions button');
  await page.screenshot({ path: `${SHOTS}mobile-dialog.png` });
  await context.close();
}

async function closeFirstRowOn(p, exit) {
  const input = await p.$('tr[data-testid=trade-row] .close-form input');
  await input.click({ clickCount: 3 });
  await input.type(exit);
  await p.click('tr[data-testid=trade-row] .close-form button[type=submit]');
}

await browser.close();

for (const x of results) console.log(`${x.pass ? 'PASS' : 'FAIL'}  ${x.id.padEnd(7)} ${x.label}${x.pass ? '' : `  → ${x.detail}`}`);
console.log(`\n${results.filter((x) => x.pass).length}/${results.length} checks passed`);
console.log(problems.length ? `\nNFR-01/02/AC-22 problems:\n${problems.join('\n')}` : '\nNFR-01 / NFR-02 / AC-22: no console errors, no 4xx/5xx, no NaN/Infinity/undefined');
process.exit(results.every((x) => x.pass) && problems.length === 0 ? 0 : 1);

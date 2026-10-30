# RiskDesk — Product Requirements

**Version:** 1.0 · **Status:** Draft for build week (26 Oct – 2 Nov 2026)

## 1. Problem

Retail and prop-firm traders size positions by hand or in spreadsheets. The two most common mistakes are both silent:

1. **Rounding up the lot size**, which pushes the real risk above the trader's limit.
2. **Logging trades inconsistently**, so P&L in R-multiples is never measured.

A prop-firm evaluation can be lost to a single oversized trade.

RiskDesk is a single-page web app that sizes a position so that risk **never** exceeds the trader's limit. It also keeps a trade journal that measures every closed trade in R.

## 2. Users

- **Primary:** a solo trader on perpetual futures who risks a fixed % of balance per trade.
- **Secondary:** a prop-firm candidate who must never breach a per-trade risk rule.

## 3. Scope

**In scope**
- Account settings: balance and risk per trade.
- A position-size calculator for three instruments.
- A trade journal: log, close and delete trades.
- A summary of journal performance.
- All data stored in the browser (localStorage). No backend, no login.

**Out of scope**
- Live prices, exchange connections, order placement.
- User accounts, sync between devices.
- Currencies other than USD.
- A native mobile app. The web app must still work in a mobile browser.

## 4. Instruments

| Instrument | Lot step | Minimum size | Max leverage |
|---|---|---|---|
| BTC-PERP | 0.001 | 0.001 | 50x |
| ETH-PERP | 0.01 | 0.01 | 50x |
| SOL-PERP | 0.1 | 0.1 | 20x |

Default leverage is 10x.

## 5. Definitions

- **Risk amount** = balance × risk %.
- **Risk per unit** = |entry − stop loss|.
- **Raw size** = risk amount ÷ risk per unit.
- **Position size** = raw size rounded **down** to the instrument's lot step. Never rounded to nearest, never rounded up.
- **Actual risk** = position size × risk per unit.
- **Notional** = position size × entry.
- **Margin required** = notional ÷ leverage.
- **Realized P&L:**
  - long = (exit − entry) × size
  - short = (entry − exit) × size
- **R multiple** = realized P&L ÷ actual risk, shown with 2 decimals and a sign (for example "+2.00R", "−1.50R").
- **Money format:** "$1,234.56". Always 2 decimals with thousands separators. Negative values shown as "−$149.40".

## 6. Use cases and acceptance criteria

Each acceptance criterion (AC) has an ID and a worked example. The examples are the test oracles: given those inputs, the app must show exactly those outputs.

### UC-1 — Set up the account

The trader enters an account balance and a risk % per trade. The values are used by the calculator and persist across reloads.

- **AC-01** — Default values on first visit are balance $10,000.00 and risk 1%.
- **AC-02** — Risk % accepts values from 0.1 to 5 inclusive. A value outside this range shows the inline error "Risk must be between 0.1% and 5%" and the calculator shows no result.
- **AC-03** — Balance must be greater than 0. Zero, a negative number or a non-number shows the inline error "Balance must be a positive number" and the calculator shows no result.
- **AC-04** — After a page reload, the balance and risk % previously entered are still shown.

### UC-2 — Size a long position

The trader picks an instrument, chooses Long, and enters the entry and stop loss. RiskDesk shows the position size, actual risk, notional and margin required.

- **AC-05** — Example. Balance $10,000, risk 1%, BTC-PERP, Long, entry 60,000, stop 59,000, leverage 10x. The app shows:
  - size 0.100 BTC
  - actual risk $100.00
  - notional $6,000.00
  - margin required $600.00
- **AC-06** — Rounding is always down. Example: balance $10,000, risk 1%, ETH-PERP, Long, entry 3,000, stop 2,930.
  - The app shows size 1.42 ETH and actual risk $99.40.
  - Showing 1.43 ETH or a risk above $100.00 is a failure.
- **AC-07** — Actual risk never exceeds the risk amount, for any valid input.
- **AC-08** — For a Long, a stop loss equal to or above entry shows the inline error "Stop loss must be below entry for a long" and no result.

### UC-3 — Size a short position

- **AC-09** — Example. Balance $10,000, risk 1%, SOL-PERP, Short, entry 150, stop 156. The app shows:
  - size 16.6 SOL
  - actual risk $99.60
  - notional $2,490.00
- **AC-10** — For a Short, a stop loss equal to or below entry shows the inline error "Stop loss must be above entry for a short" and no result.

### UC-4 — Respect instrument limits

- **AC-11** — Leverage above the instrument's maximum shows the inline error "Max leverage for SOL-PERP is 20x" (with the instrument's own name and cap) and no result. The value is **never** silently clamped to the cap.
- **AC-12** — If the rounded size is below the instrument's minimum, the app shows "Position too small for minimum lot size" and the "Log trade" button is disabled.
  - Example: balance $100, risk 0.1%, ETH-PERP, Long, entry 3,000, stop 2,000.
- **AC-13** — Sizes are displayed with the instrument's lot-step decimals:
  - BTC: 3 decimals
  - ETH: 2 decimals
  - SOL: 1 decimal

### UC-5 — Log and close a trade

From a valid calculation, the trader clicks "Log trade". The trade appears in the journal as Open. Later the trader enters an exit price and clicks "Close". The journal shows realized P&L and R multiple.

- **AC-14** — "Log trade" adds a row with:
  - instrument
  - side
  - size
  - entry
  - stop
  - actual risk
  - status Open
- **AC-15** — Example, long winner. Log the AC-06 trade (ETH-PERP Long, 1.42 at 3,000), then close it at 3,140. The row shows:
  - status Closed
  - P&L +$198.80
  - R multiple +2.00R
- **AC-16** — Example, short loser. Log the AC-09 trade (SOL-PERP Short, 16.6 at 150), then close it at 159. The row shows:
  - status Closed
  - P&L −$149.40
  - R multiple −1.50R
- **AC-17** — The journal, including open and closed trades, is unchanged after a page reload.
- **AC-18** — "Delete" removes a trade after a confirmation. After a reload it stays deleted.

### UC-6 — Review performance

- **AC-19** — The summary shows closed-trade count, win rate, total realized P&L and average R. Open trades are excluded.
  - Example: with only the AC-15 and AC-16 trades closed, the summary shows:
    - closed trades 2
    - win rate 50%
    - total P&L +$49.40
    - average R +0.25R
- **AC-20** — With no closed trades, the summary shows "No closed trades yet" instead of zeros, NaN or blanks.

### UC-7 — Robustness

- **AC-21** — Entering 0, a negative number, 1e9 or letters in any numeric field shows an inline error. The page does not crash.
- **AC-22** — The texts "NaN", "Infinity" and "undefined" never appear anywhere on the page.

## 7. Non-functional requirements

- **NFR-01** — No console errors during any flow in UC-1 to UC-7.
- **NFR-02** — No network request returns a 4xx or 5xx status during any flow.
- **NFR-03** — The main page has a Largest Contentful Paint under 2,500 ms on desktop Chrome.
- **NFR-04** — Every input has a visible label, and every error is shown next to the field it concerns.
- **NFR-05** — The layout works at 375 px width with no horizontal scroll.

## 8. Release criteria

RiskDesk is releasable when every AC and NFR above has a passing Kane CLI run in the evidence pack. Any AC without a passing run is reported as owed, not assumed.

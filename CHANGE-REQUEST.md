# RiskDesk — Change Request v1.1

**Applies to:** RiskDesk PRD v1.0 (`docs/prd.md`) · **Status:** Ready for build

## Why

Traders size positions with fees ignored, so a stopped-out trade loses more than the budget. And a fourth market is needed.

## Rule that does not change

**Every acceptance criterion in v1.0 stays in force.** With the fee rate at its default of 0%, RiskDesk must behave exactly as v1.0: same sizes, same risks, same messages, same journal.

## CR-1 — Trading fee per side

The Account panel gets a third setting, **"Fee per side"**, in percent.

- **AC-23** — Default is 0%. Valid range is 0 to 0.1 inclusive. A value outside it shows the inline error "Fee must be between 0% and 0.1%" and the calculator shows no result. It persists across reloads like the other settings (AC-04).
- **AC-24** — Fees count against the risk budget. With fee rate *f*:
  - **Cost per unit** = |entry − stop| + f × (entry + stop)
  - **Raw size** = risk amount ÷ cost per unit
  - **Position size** = raw size rounded **down** to the lot step
  - **Actual risk** = position size × cost per unit
  - Actual risk never exceeds the risk amount (AC-07 still holds, now including fees).
- **AC-25** — Example. Balance $10,000, risk 1%, fee 0.05%, ETH-PERP, Long, entry 3,000, stop 2,930. The app shows size **1.37 ETH** and actual risk **$99.96**. (With fee 0% the same trade still shows 1.42 ETH and $99.40, AC-06.)
- **AC-26** — Example. Balance $10,000, risk 1%, fee 0.05%, BTC-PERP, Long, entry 60,000, stop 59,000. The app shows size **0.094 BTC** and actual risk **$99.59**.
- **AC-27** — Realized P&L in the journal is net of fees on entry and exit: fee rate × size × (entry + exit) is subtracted. R multiple = net P&L ÷ actual risk. Example: log the AC-25 trade, close it at 3,140. The row shows P&L **+$187.59** and **+1.88R**.
- **AC-28** — A trade keeps the fee rate it was logged with. Changing "Fee per side" later does not change P&L or R of trades already in the journal.

## CR-2 — Fourth instrument: XRP-PERP

| Instrument | Lot step | Minimum size | Max leverage |
|---|---|---|---|
| XRP-PERP | 1 | 10 | 25x |

- **AC-29** — Sizes for XRP-PERP are whole numbers (0 decimals). Example: balance $10,000, risk 1%, fee 0%, Long, entry 0.50, stop 0.48 → size **5,000 XRP**, actual risk **$100.00**.
- **AC-30** — The minimum size (10) is not the lot step (1). Example: balance $100, risk 0.1%, fee 0%, Long, entry 0.50, stop 0.48 → raw size 5 XRP, below the minimum: the app shows "Position too small for minimum lot size" and "Log trade" is disabled.
- **AC-31** — Leverage above 25x on XRP-PERP shows "Max leverage for XRP-PERP is 25x" and no result (AC-11 applies to the new instrument).

## Rounding

Money and R are rounded half-up to 2 decimals for display only. Sizing and the risk check always use exact values.

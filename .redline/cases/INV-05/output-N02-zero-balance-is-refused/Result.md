---
test: ../N02-zero-balance-is-refused_test.md
status: passed
started: 2026-10-31T01:52:08.315Z
duration_s: 85
session_id: 0a6255dd-7150-43ff-a8bf-441273b43254
---

# N02-zero-balance-is-refused_test.md — Result

## Enter the trade ✓ passed (43.1s)
md5: ffb800215b06b2a2b5e968feb1d692a7
In the Account panel, clear the "Account balance" field and type 0. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2930.

## Check it is refused ✓ passed (24.7s)
md5: 966b15c2cb1c3d1651522b722ebf66de
Verify that the page shows the message "Balance must be a positive number" and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.

## Restore the balance ✓ passed (14.2s)
md5: f96f8029f4cb1384a69d17b6cd65942d
Clear the "Account balance" field and type 10000.

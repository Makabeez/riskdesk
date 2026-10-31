---
test: ../L02-switching-to-a-lower-cap-instrument-re-c_test.md
status: passed
started: 2026-10-31T01:33:29.054Z
duration_s: 93
session_id: a17e9cd0-dda9-4c77-a363-f04549ed1acb
---

# L02-switching-to-a-lower-cap-instrument-re-c_test.md — Result

## Enter a valid BTC trade ✓ passed (42.5s)
md5: c7d88bdf8ad759347899cc8c10219e37
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "BTC-PERP", then click "Long". Clear the "Leverage" field and type 30. Clear the "Entry price" field and type 60000. Clear the "Stop loss" field and type 59000. Verify that the Result panel shows a position size of 0.100 BTC.

## Switch instrument without touching leverage ✓ passed (24.7s)
md5: cf29b6c1fb7a7e35d1cdafc0b71d78b9
In the Position panel, click "SOL-PERP". Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 140. Do not change the "Leverage" field.

## Check the cap of the new instrument applies ✓ passed (22s)
md5: ee1d2abadf9280911e65ca2d62ca4110
Verify that the page shows the message "Max leverage for SOL-PERP is 20x", that the Result panel shows no position size, and that the "Leverage" field still shows 30.

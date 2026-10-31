---
test: ../N03-1e9-and-letters-in-price-fields_test.md
status: passed
started: 2026-10-31T01:53:47.808Z
duration_s: 113
session_id: b95089a7-d368-4e04-8673-f334efa4a487
---

# N03-1e9-and-letters-in-price-fields_test.md — Result

## Enter an absurd entry ✓ passed (33.9s)
md5: 97c5e3bf3fc5cb6f4efef0d5030f4480
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 1. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Entry price" field and type 1e9. Clear the "Stop loss" field and type 2930.

## Check it is refused ✓ passed (22s)
md5: e4acd11234273c123cb607392f8f1d0e
Verify that an error is shown next to the "Entry price" field and that the Result panel shows no position size. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.

## Enter letters as the stop ✓ passed (16.3s)
md5: 1ec6dcfae7a3ef533fac89a9a03609ab
Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type abc.

## Check it is refused ✓ passed (37.1s)
md5: f8799b3a05a3d2ba976edeaf483950f9
Verify that an error is shown next to the "Stop loss" field, that the Result panel shows no position size, and that the page has not gone blank. Verify that the texts "NaN", "Infinity" and "undefined" do not appear anywhere on the page.

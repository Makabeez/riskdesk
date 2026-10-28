---
test: ../C04-float-trap-on-sol-exact-lot-count-floats_test.md
status: failed
started: 2026-10-28T22:29:36.416Z
duration_s: 46
session_id: 5b0ac55f-68a8-4ad0-bba2-06ff1eb294bf
---

# C04-float-trap-on-sol-exact-lot-count-floats_test.md — Result

## Enter the trade ✓ passed (4.15s)
md5: 020582b584cd87dd8f5b06aff1564b94
In the Account panel, clear the "Account balance" field and type 10000. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "SOL-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 150. Clear the "Stop loss" field and type 149.7.

## Check the size and the risk ✗ failed (37.6s)
md5: 1e8cae7c5bb65c96b1416075a7523fb0
Reason: Checkpoint assertion failed: "the Result panel shows a position size of exactly 100.0 SOL, the actual risk shown is exactly $30.00, and the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 0.3% is $30.00 rounded to the cent)" — bug verdict: Agent asserted target values while Result panel showed rounded-down sizing [automation_bug/agent_misstep, confidence 0.94]
Verify that the Result panel shows a position size of exactly 100.0 SOL, that the actual risk shown is exactly $30.00, and that the actual risk shown is not greater than the risk budget the page shows under the "Risk per trade" field (balance 10000 multiplied by 0.3% is $30.00 rounded to the cent). Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

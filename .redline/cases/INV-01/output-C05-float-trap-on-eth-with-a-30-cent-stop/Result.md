---
test: ../C05-float-trap-on-eth-with-a-30-cent-stop_test.md
status: passed
started: 2026-10-31T01:23:53.141Z
duration_s: 76
session_id: d65478d4-99c7-4543-b18b-ded35d49f23a
---

# C05-float-trap-on-eth-with-a-30-cent-stop_test.md — Result

## Enter the trade ✓ passed (40s)
md5: b01b3dc51c0d96d8e3da05f22f89aff9
In the Account panel, clear the "Account balance" field and type 2500. Clear the "Risk per trade" field and type 0.3. In the Position panel, click "ETH-PERP", then click "Long". Clear the "Leverage" field and type 10. Clear the "Entry price" field and type 3000. Clear the "Stop loss" field and type 2999.7.

## Check the size and the risk ✓ passed (25.5s)
md5: 7af3605fc8f3bc0d79cf4551a82ff9c8
Verify that the Result panel shows a position size of exactly 25.00 ETH and that the actual risk shown is exactly $7.50. The risk budget here is 2500 multiplied by 0.3%, which is $7.50 to the cent: the actual risk shown must not be greater than that. Store the displayed position size as displayed_size and the displayed actual risk as displayed_risk.

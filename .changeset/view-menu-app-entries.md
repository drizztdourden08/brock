---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-input': patch
---

An app can add entries to the title bar View menu. An app menu item keyed `view` with `children` hands them to Tessera 0.54 `WindowTitleBar` as `viewItems`, drawn after Tessera's own View rows with a separator. The item still works as the placement marker for View, and the search palette lists the entries under View. `brock-react` now requires Tessera `^0.54.0`.

Tessera 0.54 removes the controller composites and the `stickPosition` and `calibrated` strings. The input module's StickPlot owns those two labels, and the guide registers ControllerLayout, PressedGrid and StickPlot as Brock parts.

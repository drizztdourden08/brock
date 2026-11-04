---
"@drizztdourden08/brock-build": patch
---

The splash inks, the brand gradient and the installer theme read short hex colours from Tessera's `tokens.json`. Tessera 0.102.0 writes `#000` and `#fff`, so the splash lost the palette's dim text and the installer fell back to its built-in dark colours.

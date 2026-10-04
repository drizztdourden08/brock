---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': patch
---

The review watchdog starts in main at launch. When no tour progress (a capture or a check) arrives within 60 s, for example because the renderer failed to load, main writes a partial report with a failed `tour-started` check and exits 1, instead of waiting for minutes. Main also exits 5 s after the report when something holds the quit. brock-core exports `GLOBAL_STEP` from its review entry.

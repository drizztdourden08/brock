---
'@drizztdourden08/brock-electron': patch
---

Every `--review` run captures the splash mid-boot as step 00 (`00-splash.png`, or `00-splash-failed.png` when the boot stops first) and adds a `splash-captured` check, without `--screenshot-splash`. The reveal waits for the capture, at most 5 s. `--screenshot-splash` works as before.

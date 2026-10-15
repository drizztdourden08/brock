---
'@drizztdourden08/brock-electron': patch
---

The `--screenshot` watchdog now waits at least as long as the boot watchdog: 120 s on a dev launch (or `product.boot.devWatchdogMs`), where a cold start took longer than 20 s and left a black picture, and still 20 s in production unless the production boot watchdog is longer. `screenshotTimeoutMs` of `bootstrapApp` and `--screenshot-timeout` still override it.

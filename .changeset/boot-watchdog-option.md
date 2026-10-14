---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

The boot watchdog is configurable: `product.boot.devWatchdogMs` (default 120000) and `product.boot.watchdogMs` (default 8000) in `brock.config.ts`, and the `BROCK_BOOT_WATCHDOG_MS` environment variable, which overrides whichever applies.

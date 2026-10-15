---
'@drizztdourden08/brock-electron': minor
---

The `--screenshot` watchdog is configurable and fails loudly: `--screenshot-timeout=<seconds>` or `bootstrapApp({ screenshotTimeoutMs })` sets how long it waits (20 s by default), and when it fires it still captures, logs whether the window never revealed or how many screenshot holds were open, and exits 2 instead of 0.

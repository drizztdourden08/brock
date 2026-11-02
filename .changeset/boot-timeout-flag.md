---
'@drizztdourden08/brock-core': patch
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-react': patch
---

Add `--boot-timeout=<seconds>`, the time a boot task may run when it sets no `timeoutMs`. The default stays 20 s for a normal launch and is 60 s for an automated one (a `--screenshot` or other automation flag, or a headless launch), so a loaded machine no longer stops the boot at "Drawing the first frame". The flag always wins, and a bad value logs a warning and keeps the default. `runBootTasks` takes a `defaultTimeoutMs` option, main applies it to its own tasks and forwards it to the renderer as `--startup-boot-timeout`.

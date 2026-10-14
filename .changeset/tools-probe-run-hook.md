---
'@drizztdourden08/brock-tools': minor
---

A registered tool can carry a `probe` and an `aroundRun` hook. `probe: { binary?, args?, timeoutMs?, read? }` runs the found binary (`--version` by default) and reads the result; the default reader passes on exit code 0 and takes the first dotted number as the version. `probe` can also be a function of the found paths. A copy that fails its probe counts as not found, so the lookup moves on to the next folder, and a passing one puts its `version` on `ToolState` and `ToolLocation`. A result is kept until the binary's size or time changes. `aroundRun(call, next)` wraps every run of the tool, the probe included, and may change the call or the result. `systemPath()` and `readVersion` are exported.

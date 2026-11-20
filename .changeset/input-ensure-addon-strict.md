---
'@drizztdourden08/brock-input': minor
---

`bin/ensure-addon.mjs --strict` exits 1 unless the SDL3 addon is current, installed or built, so a packaging step stops on a stale or missing addon. `ensureAddon` and `addonReady` are exported from `@drizztdourden08/brock-input/ensure-addon`.

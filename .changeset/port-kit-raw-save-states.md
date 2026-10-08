---
'@drizztdourden08/brock-port-kit': minor
---

Port kit loads raw save states. A `.sav` that does not start with the `PKSV` header is no longer refused with `magic`: `decodeSaveSlot` reads it as the core's raw state, and `loadStateBytes`, `load` and `loadNamed` hand it to the core, so states and fixtures written before the kit keep loading. The decode result now carries `format` (`'pksv'` or `'raw'`), and `decodeSaveSlot(bytes, port, { acceptRaw: false })` keeps the strict check. A container cut inside its header is now `corrupt` instead of `magic`. Saving still writes the `PKSV` container.

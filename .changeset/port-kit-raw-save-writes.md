---
'@drizztdourden08/brock-port-kit': minor
---

Save slots can write raw states: `createSaveSlots({ format: 'raw' })` and `createPortSession({ saveFormat: 'raw' })` write the core's state bytes as they are (after the save transform) instead of the PKSV container. Loading already took both.

---
'@drizztdourden08/brock-port-kit': minor
---

Save transform hooks: `createSaveSlots({ transform })` and `createPortSession({ saveTransform })` take `save(state, kind)`, which may be async, to change the core's state bytes before they are stored, and `load(state)` to change them back before the core loads them.

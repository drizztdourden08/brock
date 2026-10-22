---
'@drizztdourden08/brock-input': minor
---

Report each controller's state by physical place. `onPadState` and `usePadState` give a `PadState` keyed by slot (`face.south`, `stick.left`, `trigger.right`, and so on), with stick Y up positive. Each ready `DeviceEntry` now has a `family` hint (`xbox`, `playstation`, `nintendo` or `generic`).

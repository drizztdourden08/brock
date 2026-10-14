---
'@drizztdourden08/brock-input': minor
---

Apps can add their own buttons to the input module's device cards. `registerDeviceCardActions(actions)` (or the `useDeviceCardActions` hook) adds them to every card, the module's Controllers screen included, and `InputTester` (`deviceActions`) and `DeviceCard` (`actions`, now exported) take them as a prop too. Each `DeviceCardAction` has an `id`, a `label`, an optional `icon` and `variant`, `disabled` and `visible` checks on the `DeviceEntry`, and `onSelect(entry)`.

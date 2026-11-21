---
'@drizztdourden08/brock-input': minor
'@drizztdourden08/brock-display': patch
'@drizztdourden08/brock-updater': patch
---

The input, display and updater modules ship their strings as `input:*`, `display:*` and `updater:*` message keys. In input, `DeviceCardAction.label` and `RumbleTest.label` are `Text`, and `formatKeyCode`, `formatKeyBinding`, `getBindingLabel` and `newProfile` take a `text` function.

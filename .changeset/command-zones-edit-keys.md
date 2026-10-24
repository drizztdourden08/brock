---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

feat: focus zones for commands, and app-owned edit keys

`CommandDef` gains `zone`. A zoned command fires only while the focused element sits inside an element marked with `{...commandZone('canvas')}`, and it ranks above a scoped and an unscoped command with the same chord. The same chord in different zones is not a conflict.

The Edit menu asks the renderer first (ask channel `command:runEdit`) and runs a command bound to Cmd+Z, Shift+Cmd+Z, Cmd+X, Cmd+C, Cmd+V or Cmd+A when one is enabled for the focus, so an app can own these keys on macOS. With none, it runs the native role. The edit items are plain items with accelerators on every platform instead of roles.

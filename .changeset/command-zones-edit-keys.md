---
'@drizztdourden08/brock-react': minor
---

feat: focus zones for commands

`CommandDef` gains `zone`. A zoned command fires only while the focused element sits inside an element marked with `{...commandZone('canvas')}`, and it ranks above a scoped and an unscoped command with the same chord. The same chord in different zones is not a conflict. A command bound to Mod+C, X, V, A or Z already wins over the native Edit menu, since it runs on keydown and prevents the default.

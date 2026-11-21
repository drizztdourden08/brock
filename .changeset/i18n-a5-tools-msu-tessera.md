---
'@drizztdourden08/brock-tools': minor
'@drizztdourden08/brock-catalog': minor
'@drizztdourden08/brock-secrets': patch
'@drizztdourden08/brock-msu': minor
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-build': patch
---

The tools, catalog, secrets and msu modules ship their strings as message keys in their own namespaces. `ToolDef.installHint`, `ToolState.hint` and the catalog install bar text are `Text`. Tessera object entries such as `anchor.names` and `toolbars.sides` render one key per sub-key and are read back the same way.

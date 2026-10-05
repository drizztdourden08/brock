---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.19.0: the workspace catalog and brock-react's peer range are `^0.19.0`. Tessera 0.19 puts rename and delete on every row of `ManagedList` (`actionVisibility`, default `'hover'`) and adds `onActivate`, so the arrow keys, Home and End can move focus without picking (MIGRATION §169). It renames nothing, so `brock upgrade` from 0.20.0 has no rename to replay.

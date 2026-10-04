---
'@drizztdourden08/brock-thread': patch
---

`brock upgrade` passes each app its own `--from` and `--tessera-from`: the app's `brock.version` and `brock.tessera`, else the root's, read in the main checkout so a resumed upgrade starts from the same versions. Before, it took the Tessera start from the root and skipped the app's pin.

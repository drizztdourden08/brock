---
'@drizztdourden08/brock-build': patch
---

The managed workflows reach git. The `.*/` rule of the standard `.gitignore` hid `.github`, so an upgrade committed green without its workflows. `brock adopt` and `brock sync` keep `!.github/` right after the rule that hides it in the repo's `.gitignore`, the `workflows-tracked` migration (0.37.0) adds it to an existing repo, and `brock check` (which the upgrade now runs) fails while git ignores a managed workflow it does not track.

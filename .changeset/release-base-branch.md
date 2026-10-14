---
'@drizztdourden08/brock-build': patch
---

The managed release workflow moves the repo's `base` branch (from `brock.workspace.mjs`, else `main`) to the release commit, where it moved GitHub's default branch before, so a repo that releases from an integration branch keeps its version bump there.

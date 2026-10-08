---
'@drizztdourden08/brock-build': patch
---

A failed release build leaves no tag behind. The managed release workflow's `prepare` job no longer commits or tags: every build runs from the commit it checked with the version set, and the `release` job commits the version, tags it and moves the default branch only once every build succeeded, so the same version can run again. The builds still fetch the previous release for the Velopack delta.

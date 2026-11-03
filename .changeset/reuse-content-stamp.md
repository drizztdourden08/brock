---
'@drizztdourden08/brock-build': patch
---

Fix the main bundle of an app that imports compiled `@drizztdourden08` packages never being reused in a fresh worktree. Those copies in `node_modules/.build-cache` are made per worktree and do not exist yet when the check runs, so the build reuse record now lists them by the content hash of their cache entry and no longer as files. Files outside the repository are keyed by content (SHA-1, hashed once per process for each time and size) and their folders by the names in them, so no key depends on a file time. The record format is 4, so old records read as a miss once.

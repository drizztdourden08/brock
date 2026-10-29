---
'@drizztdourden08/brock-input': patch
'@drizztdourden08/build-cache': patch
---

Keep the installed SDL3 addon in the build cache too, so a fresh worktree in local mode gets its controller addon without any download. A new `addon-installed` entry kind holds the extracted files with a SHA-256 for each. It is stored after an install, or when the addon on disk is current, and restored when the archive is not cached. `addon:seed` stores an installed copy by hand.

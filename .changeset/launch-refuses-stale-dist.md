---
'@drizztdourden08/brock-build': patch
---

`launchAppForTest` and `assertLaunchable` now refuse a dist that is older than the app's sources, and say which input changed, instead of running the old build with no warning. The staleness check also notices an install that is newer than the build (`node_modules/.modules.yaml`, else `pnpm-lock.yaml`, found by walking up to the workspace root). Pass `allowStale: true` to skip only this check.

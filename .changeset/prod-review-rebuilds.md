---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': minor
---

A production launch reviews the current sources. `brock build --if-stale` builds only when `dist` is missing, half built or older than the app's sources (its own and those of the workspace packages it depends on), and `launch --prod` (with `--review` too) runs it first instead of reusing whatever `dist` holds.

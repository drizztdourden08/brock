---
'@drizztdourden08/brock-build': minor
---

The renderer dev server pre-bundles the Brock packages an app links from outside its workspace, such as a Brock checkout linked with `link:`, so a dev start loads a few chunks instead of about 1,900 source files. A stamp of the files those packages carry goes into the optimizer hash, so a branch switch or an edit there re-bundles them on the next start. `build.optimizeDeps.liveBrock: true`, `brock dev --live-brock` or `BROCK_LIVE_BROCK=1` keeps them as source with hot reload.

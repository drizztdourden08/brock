---
'@drizztdourden08/create-brock': patch
'@drizztdourden08/brock-build': patch
---

A Brock app scaffolded inside a workspace no longer keeps the template's brock.workspace.mjs. Only the workspace root owns one. The app also drops the brock-thread and stylelint-config-standard dev dependencies and the root-only knip entries, which nothing in the app uses. The Tessera range that create-brock puts in the workspace catalog now comes from the range brock-react peers on, so it follows each release instead of a copy that goes stale. `brock adopt` now writes a root workspace in knip.json, with the lint configs and brock.workspace.mjs as entries and the lint binaries ignored. A fresh workspace passes `brock knip` without a hand-written entry.

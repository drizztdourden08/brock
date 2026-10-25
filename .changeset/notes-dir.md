---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

An app keeps its release notes in the `release-notes/` folder beside its `brock.config.ts`, as the scaffold and the app README say. Before, an app in `apps/desktop` of a workspace had `brock release` and `brock release-notes check` read the repo root instead. Now `brock release`, `brock release-notes check` and the generated workflows all read the app folder (`NOTES_DIR` is `apps/desktop/release-notes`). When the app folder has no `release-notes/` and the repo root has one, they read the root and print one line saying so, so a repo that moved its notes to the root keeps working. The generated workflows follow that choice, so run `brock sync` after moving the notes into the app folder. An app of several keeps its own folder only.

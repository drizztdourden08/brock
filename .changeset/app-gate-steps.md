---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': minor
---

An app adds its own checks to the gate with `gate.scripts` in `brock.config.ts`: `package.json` scripts, taken from the app's `package.json` when it has the script, else from the workspace root's, and a script neither declares fails. `brock gate` runs them in order (after the C format check of `gate.clangFormat`), runs every step even after a failure, and exits 1 naming the ones that failed; an app that declares none passes. The managed CI `quality` job of each app (standalone or in a workspace) runs `brock gate` after the release note check, and `<repo> upgrade` runs it in each app after the gate scripts.

---
'@drizztdourden08/brock-build': patch
---

Run `brock knip` from an app folder against the workspace config. A run from `apps/desktop` read only the app folder, so it had no test entries: it flagged test-only exports and unused files that the run from the repo root accepts. When the repo above lists the folder under `workspaces` in its `knip.json`, the command now runs knip from that repo with `--workspace` set to the folder, so the app run and the root run give the same answer. A run that passes its own `--workspace` is left alone.

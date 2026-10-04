---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/create-brock': minor
---

Brock takes Tessera 0.10.0. The catalog and the brock-react peer move to `^0.10.0`.

- `brock migrate` replays the new `configKeys` group of Tessera's `RENAMES.json`: dotted setting paths moved inside JSON files a project keeps, by file name, where `*` stands for any one key such as an app folder. The step edits `tessera.config.json` and `package.json` at the app root, the repo root and every workspace package in place. A key whose parent stays the same is renamed where it stands, an object whose every key moves to the same new sibling is renamed whole, and any other key is cut and pasted at the indentation of its new place, with an emptied parent removed. Order, layout and indentation are kept, a second run changes nothing, and a target that is already set is never overwritten: it becomes a to-do. For Tessera 0.10.0 that moves the usage settings object to `guide`, at the top level and under each `apps` entry, and the `package.json` guide script to `guide`.
- Brock's own `tessera.config.json` holds `guide`, and the prose exception for the old key is gone.

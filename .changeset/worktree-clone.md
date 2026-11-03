---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-thread': patch
---

A new worktree starts from what another checkout of the same lockfile already has, instead of installing and building again.

- `worktree create` links `node_modules` from the main checkout, or the newest other worktree, when its installed lockfile equals the new one byte for byte. Packages point into a shared copy of that checkout's package store, built once per lockfile; workspace packages point into the new worktree. On Archipelia this took 1.4 s instead of two minutes of `pnpm install`, after a one-time copy of the package store (184 s). Any mismatch or failure runs `pnpm install` as before, and `--no-clone` always does.
- A plain `pnpm install` in a cloned worktree asks to recreate `node_modules` and never writes into the shared store. `worktree remove` deletes the links only.
- `worktree create` also copies the build records, and the generated outputs (`dist`, `guide`, brand icons) when the source's app folder matches the new commit. It skips the background prewarm when the records came over.
- The main and preload build records key repository files on their git content instead of their path and file time, so a record written in one checkout is reused in another checkout of the same tree. Records written by an older Brock are built once again.
- The shared renderer dependency cache stores sources relative to the package store, so it seeds a cloned worktree too, and the renderer dev server may serve files from the package store wherever pnpm keeps it.
- A cloned worktree is locked until `worktree remove` has removed its links. The shared store records what each package folder holds, so a damaged store is detected and reported at start and prewarm; the next create builds a fresh entry beside it and never deletes the old one. A store holds only links inside its entry, a source whose `node_modules` is a link is refused, and Electron in a shared store is never repaired from a worktree.
- Each clone records itself in the store entry (`users/<hash>.json`), so Argus can tell which entries are in use.

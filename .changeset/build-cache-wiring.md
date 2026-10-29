---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': minor
---

Use the per-user build cache, so a fresh worktree stops rebuilding and re-extracting what the machine already has.

- The Electron main build of `brock dev` and `worktree launch` no longer compiles installed `@drizztdourden08` packages. Each version is compiled once per machine, copied to `node_modules/.build-cache` and imported at runtime. Linked packages, UI packages and anything that depends on one stay compiled in as before. Production builds, the preload and the renderer are unchanged.
- `brock dev`, `brock start` and `worktree launch` copy the Electron binary from the cache into a fresh install, checked against its hash, instead of extracting it again, and add each new version to the cache.
- `brock cache list` prints the cache entries. Brock never deletes from the cache; Argus prunes it.
- `worktree create` installs a workspace once. It ran `pnpm install` again in the app folder, once per target, even when the root install had already filled it.

---
'@drizztdourden08/brock-build': minor
---

Migrations may hold a workspace step, `workspace({ rootDir })`, for a change no single file can make; it returns `{ touched, moved, todos }`, runs after the file steps of its version, and earlier to-dos follow the files it moves. The 0.1.3 `design-package` migration uses it: a monorepo gets `packages/design` (`@<scope>/design`), a root `tessera.config.json` that points at it with one `apps` entry per app, and every app compound whose imports it can rewrite moved there and imported from `@<scope>/design`; a compound it cannot move, and a component outside the parts folders, becomes a to-do. A single-app repo gets a `tessera.config.json` with `$schema` alone.

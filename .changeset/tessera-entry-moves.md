---
'@drizztdourden08/brock-build': minor
---

`brock upgrade` and `brock migrate --tessera-from` replay the entry point moves Tessera's `RENAMES.json` records in each release's `moves` map:

- After a release's renames, its moves are grouped by `from` and `to` (package.json `exports` subpaths) and every import or re-export of a moved name through `@drizztdourden08/tessera/<from>` takes it from `@drizztdourden08/tessera/<to>`. A part renamed in the same release moves under its new name. The root import never moves.
- `importMoves` reads any exports subpath, not only `primitives`, `composites` and `brand`, so `data`, `field-kits` and the others move too.
- `importMoves` moves `export { … } from` re-exports as well, and moves the named imports out of an import that also takes a default, which stays where it is. It takes an optional `ts`, a TypeScript compiler already loaded.
- A name the new entry already imports is dropped from the old import, never written twice, so the published `tessera-part-moves` (0.19.0) and `tessera-tier-moves` (0.23.0) migrations and the moves replay give the same imports in either order and on any rerun.

---
'@drizztdourden08/brock-build': patch
---

`brock migrate` replays Tessera's `RENAMES.json` over every workspace package that depends on Tessera, found from the `pnpm-workspace.yaml` globs, instead of every folder under `apps/` and `packages/`. A Tessera package in another folder (`tooling/*`, say) is covered now, and a package that does not use Tessera is no longer touched by a class or custom property rename.

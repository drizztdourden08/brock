---
'@drizztdourden08/brock-thread': minor
---

`replay` regenerates consumer lockfiles and refuses localpkg ones. When localpkg is on for the repo, or a package.json depends on a package localpkg moved, the plan starts with a lockfile step: `localpkg off`, a normal `pnpm install` against the registry, a check that `pnpm-lock.yaml` holds no `file:` outside the repo and no `.coord/localpkg`, and a commit `chore: lockfile for the replayed versions` on the integration branch. The step is BLOCKED while a version it needs is not on the registry. Before any push, `replay` scans every commit to push and stops with exit 1, naming the commit and file, when a committed `pnpm-lock.yaml` points at `.coord/localpkg` or at a `file:` path outside the repo.

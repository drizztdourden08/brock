---
'@drizztdourden08/brock-thread': patch
---

The thread README lists `--skip-install` on `worktree create`: the worktree is added and provisioned with no `pnpm install`, for a thread that only writes a file such as a release note. A new page, `docs/launch-suite.md`, says how an app keeps its launch suite (`tests/launch-suite.md`, a numbered table of cases per group, each confirmed by the owner or from output, run in one pass in a fresh worktree), its kept end-to-end tests (`tests/e2e/<name>.e2e.ts`) and its coverage registry (`tests/COVERAGE.md`).

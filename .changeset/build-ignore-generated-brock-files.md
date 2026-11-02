---
'@drizztdourden08/brock-build': patch
---

The shared build check no longer counts `.brock/tessera-parts.ts` when it compares the files of `.brock/`. The launch writes that file in one checkout and not in a fresh worktree, so the check called the main and preload bundles stale with "files added or removed". The names of such files now sit in one list, `GENERATED_AT_LAUNCH`, in `build-reuse.constants.mjs`.

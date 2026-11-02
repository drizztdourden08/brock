---
'@drizztdourden08/brock-thread': patch
---

The pnpm installs that `worktree create` and `upgrade` run no longer stop on the purge question. pnpm asks before it rebuilds a node_modules folder it cannot reuse, and with no terminal that ask aborted the install with ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY and left a tree without vitest. The CLI now passes `--config.confirmModulesPurge=false`. When an install still fails, `worktree create` stops with a non-zero exit and an error that names the folder and the pnpm exit code, next to pnpm's own output.

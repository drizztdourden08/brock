---
'@drizztdourden08/brock-build': minor
---

New `brock lint` runs eslint cheaply. A local run lints only the files changed since the merge base with the default branch, uncommitted and untracked files included. CI or `--all` lints the whole tree, `--changed` forces the changed mode, and files named on the command line lint just those. A changed eslint, tsconfig, package or lint-config file lints the whole tree. The first line says which mode ran and how many files. Local runs use eslint's content cache under `node_modules/.cache/brock` (`--no-cache` skips it, CI never uses it). The eslint child and `brock knip` start with `--max-old-space-size=2048` in `NODE_OPTIONS`, set `BROCK_LINT_MEMORY_MB` for another size; a heap flag you already set wins. `brock adopt`, the app template and the server template now use `brock lint` in the `lint` script instead of `eslint .`.

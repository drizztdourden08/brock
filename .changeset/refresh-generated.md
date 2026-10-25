---
'@drizztdourden08/brock-thread': patch
---

`worktree refresh` no longer refuses a fresh worktree because of the files the setup writes itself. Untracked `CLAUDE.md`, `.ai-config.json`, `.mcp.json`, `.brock-port-slot` and `.user-data/` do not count as local changes, for `refresh`, `finish`, `remove` and the dirty warning of `pr push`. A tracked file with changes, or any other untracked file, still blocks.

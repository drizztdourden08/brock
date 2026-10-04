---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-thread": patch
"@drizztdourden08/brock-lint-config": patch
"@drizztdourden08/create-brock": patch
---

Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.

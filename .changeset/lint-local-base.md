---
"@drizztdourden08/brock-build": patch
---

`brock lint` compares with the local default branch when `origin/HEAD` names a branch the local one has moved past, so a local-first repo lints only its own changes. `BROCK_LINT_BASE` still wins.

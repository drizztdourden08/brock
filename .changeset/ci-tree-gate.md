---
'@drizztdourden08/brock-thread': minor
'@drizztdourden08/brock-build': patch
---

Make the local check run cheap and bounded. A step that passed for the same git tree is reused, every step has a hard time limit that stops its process tree, a queued run treats a holder past its own budget as hung, GitHub-only jobs are left out of the plan, and the steps run cheap first. The tests cover only files changed since the merge base (the last release tag on a release), and `brock lint` reads `BROCK_LINT_MODE` (all or changed) so the runner no longer sets CI.

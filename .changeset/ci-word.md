---
'@drizztdourden08/brock-thread': patch
---

`brock ci <name>` now takes a job name or a step name, so `brock ci lint` runs the lint step. An unknown name lists the jobs and steps.

A queued run now waits up to 240 minutes for the run ahead of it (was 30). A full gate takes about 30 minutes, so three queued PRs timed out.

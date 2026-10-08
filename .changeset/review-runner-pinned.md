---
'@drizztdourden08/brock-build': patch
---

The CI review job runs on `ubuntu-24.04` with or without baselines, never `ubuntu-latest`, which moves to Ubuntu 26 from 19 October 2026: its apparmor step and the linux baselines depend on the image.

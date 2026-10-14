---
'@drizztdourden08/brock-build': patch
---

Every Linux job of the managed workflows runs on `ubuntu-24.04`, never `ubuntu-latest`, which moves to Ubuntu 26 on 19 October 2026: the CI `changes`, `quality` and `web` jobs, the workspace and site CI jobs, and the release `prepare`, `build-linux` (the `.deb` and the AppImage), `build-android`, `build-web` and `release` jobs, as the review job already did.

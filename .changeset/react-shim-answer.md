---
'@drizztdourden08/brock-react': patch
---

The web and Capacitor API shim now answers `answer()` with a no-op handler, so a renderer that registers an ask handler boots off Electron.

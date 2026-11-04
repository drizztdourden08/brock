---
'@drizztdourden08/brock-lint-config': minor
---

New rule brock/spawn-hides-window. A call to spawn, exec, execFile or fork from node:child_process must pass an options object with windowsHide: true, so no console window opens on Windows.

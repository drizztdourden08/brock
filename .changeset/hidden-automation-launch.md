---
"@drizztdourden08/brock-electron": minor
---

A headless launch (any automation flag without `--visible`) is now hidden: its windows are never shown, so no window, taskbar flash or focus steal reaches the desktop; `--visible` is the only way to show one.

A hidden launch also turns hardware acceleration off, so its offscreen windows draw on the CPU and a machine without a GPU no longer crashes the GPU process.

---
'@drizztdourden08/brock-input': patch
---

The Android library build mirrors the SDL3 source into the short CMake folder (on Windows by default), so a second `assembleDebug` no longer fails when SDL's CMake re-checks headers that sit past 260 characters in the pnpm store.

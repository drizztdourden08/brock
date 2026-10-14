---
'@drizztdourden08/brock-input': minor
---

`BROCK_INPUT_CMAKE_DIR` puts the CMake build folders of an addon source build at a short path (a folder, or `temp` for the system temp folder), one subfolder per package copy, so a build deep in a worktree stays under the Windows path length limit. The Android library build reads the same variable, or `brockInputCmakeDir` in `mobile/android/gradle.properties`, for its CMake staging folder.

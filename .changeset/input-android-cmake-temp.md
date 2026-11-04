---
"@drizztdourden08/brock-input": patch
---

The Android library build now stages its CMake folder in the system temp folder by default on Windows, to stay under the 250 character object path limit; set `brockInputCmakeDir=project` to keep it in the package.

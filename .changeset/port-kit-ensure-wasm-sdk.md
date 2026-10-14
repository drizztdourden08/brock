---
'@drizztdourden08/brock-port-kit': minor
---

ensure-wasm activates the Emscripten SDK on Windows through its `emsdk_env.bat` before the build script, and `skipWithoutSdk` (or `--skip-without-sdk`) skips a stale build when no SDK is found, resolving `'skipped'`; `emsdkOf` reports what it found.

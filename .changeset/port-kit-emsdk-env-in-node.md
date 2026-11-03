---
'@drizztdourden08/brock-port-kit': patch
---

The wasm build no longer sources `emsdk_env.bat`. From a Git Bash parent that script printed bash exports and left PATH alone, so the build failed with "emcc is not recognized". `ensure-wasm` now builds the SDK environment in Node (`emsdkEnvOf`) and runs the build script as `node <script>` on every platform. The env sets `EMSDK`, `EM_CONFIG`, `EMSDK_NODE` and, on Windows, `EMSDK_PYTHON`, and puts the SDK folder, `upstream/emscripten`, the SDK Node folder and the Windows Python folder first on the path. `emsdkOf` no longer reports `activate`, and its host option no longer takes a `platform`.

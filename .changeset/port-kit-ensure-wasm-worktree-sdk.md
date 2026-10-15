---
'@drizztdourden08/brock-port-kit': minor
---

ensure-wasm finds the Emscripten SDK from a git worktree: when the worktree has none at a relative `emsdkDir`, the same folder of the main checkout is used, read from the worktree's `.git` file with no git call. `emsdkOf` reports `mainCheckout`, and `mainCheckoutOf(dir)` is exported. `$EMSDK` and an absolute `emsdkDir` still win.

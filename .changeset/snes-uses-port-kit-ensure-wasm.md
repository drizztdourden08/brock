---
'@drizztdourden08/brock-plugin-snes': minor
'@drizztdourden08/brock-port-kit': minor
---

One wasm stale check, in port kit. `brock-plugin-snes` drops its own copy and now depends on `@drizztdourden08/brock-port-kit`: `snes.wasmBuild()` and `snes wasm build` ask port kit's `wasmStaleReason` and build through its `ensureWasm`, still with the plugin's defaults, the pinned SDK install and the main checkout's SDK folder. Port kit's `ensureWasm` takes `force: true` to build a current core, and `emsdkDir` may now be an absolute path. The SNES plugin's tests now run with the rest.

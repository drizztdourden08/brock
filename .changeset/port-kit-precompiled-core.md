---
'@drizztdourden08/brock-port-kit': minor
---

`createGameCore(port, { precompiled })` instantiates a `WebAssembly.Module` the app compiled ahead (or a function resolving one) instead of fetching and compiling the core at each start; `compileCore(port)` compiles the core for such a warm-up.

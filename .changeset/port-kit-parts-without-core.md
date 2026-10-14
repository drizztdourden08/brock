---
'@drizztdourden08/brock-port-kit': minor
---

`createLiveSettings({ calls, apply })` and `createSramSync({ read, store, profileId })` run without `createGameCore`, for an app that loads its core itself; `createCoreCalls(module)` is exported to build the calls of an Emscripten module.

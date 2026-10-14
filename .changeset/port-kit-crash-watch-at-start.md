---
'@drizztdourden08/brock-port-kit': minor
---

`createGameCore(port, { watchCrashFrom: 'start' })` arms the crash watch when the core starts, before the glue script loads, so a WebAssembly runtime error while the core boots sets the `error` state and reaches `onCrash` instead of going unseen; the default `'running'` keeps today's behaviour. `watchCoreCrash` is exported for an app that loads its core itself.

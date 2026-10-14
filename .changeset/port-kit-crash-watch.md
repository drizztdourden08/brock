---
'@drizztdourden08/brock-port-kit': minor
---

The core's crash watch takes `crashArmDelayMs` (a runtime error that soon after a start is swallowed) and `onCrash({ message, error, event })` in `createGameCore` options, and reports only the first crash of a run.

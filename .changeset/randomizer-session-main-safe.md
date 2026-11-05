---
"@drizztdourden08/brock-randomizer": major
---

The `./session` export is main-process safe again. `createLocalSessionFactory`, `createOnlineSessionFactory`, `useSessionStore`, `startSession`, `stopActiveSession`, `currentRun`, `readPlacement`, `writePlacement`, `gateRandomizerBoot`, `startSessionRuntime` and `appRandomizerLog` reached `@drizztdourden08/brock-react`, so they now come from `@drizztdourden08/brock-randomizer/renderer`.

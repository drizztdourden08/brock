---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': minor
---

`brock dev`, `build` (and so `package`), `start` and the repo command's `launch` run `brock sync` first when `.brock` is missing or older than its inputs (`brock.config.ts`, `package.json`, `src/screens`, `src/widgets`, `src/boot`, `electron/boot`), so a fresh checkout that ignores `.brock` launches. `dev` and `build` stop with a message naming the missing file when `src/main.tsx` imports a `.brock` file that does not exist, instead of starting a renderer that errors and hangs. `brock sync --if-stale` is the step `launch` runs.

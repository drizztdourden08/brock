---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-build': minor
---

Outside helpers and the bridge. `helpers` in `brock.config.ts` names standalone Node entries, such as a stdio MCP helper: `brock build` and `brock dev` bundle each into `dist/helpers/<name>.mjs` with only Node built-ins left as imports, refuse an Electron import, and the managed electron-builder config ships them in `resources/helpers` outside the asar. `bootstrapApp({ bridge: { register } })` opens an opt-in local bridge in main: a per-session named pipe on Windows or a 0600 Unix socket in a private temp folder, never TCP, guarded by a random per-session secret that every request carries, with a 0600 discovery file in the per-user app data folder that is removed on quit. Routes are `invoke` entries, as in the IPC contract. Messages are JSON lines with ids, bounded by `maxMessageBytes`. The helper's client is `connectBridge` from the new `@drizztdourden08/brock-electron/bridge` entry, which imports nothing from Electron. `helperLaunch(name)` gives the command, arguments and environment for an MCP client config.

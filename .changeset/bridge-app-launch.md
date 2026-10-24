---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
---

A helper can now start the app and call ask channels. `appLaunch({ background? })` from `brock-electron/main` returns `{ command, args, env }` for the current app, packaged or in development, with the identity flags of the launch. The bridge writes it to `launch-<discovery file name>` beside the discovery file each time it opens, and `readAppLaunch` and `startApp` from `brock-electron/bridge` read it under the same private-file checks and start the app, with `--background` on request. `relayAsk(bridge, CHANNEL, { window, timeoutMs?, validate? })` exposes an ask channel as a bridge route, so `bridge.request` accepts ask channels and returns the renderer's answer; failures are masked as `the request failed` and an absent window gives the `no-window` code. `channelApi` no longer throws on a channel set that holds ask channels, which the preload never maps. `brock-core` exports `BACKGROUND_FLAG`, and `IDENTITY_FLAGS` from `/automation`.

---
'@drizztdourden08/brock-electron': patch
---

Two fixes for a headless helper app. `ctx.dialogs.confirm` takes `showOnAutomation: true` to show the native dialog on a plain `--no-focus` launch, where it used to answer no without showing anything. The default stays false, and the option is ignored on `--review`, `--screenshot` and `--screenshot-splash` launches, which must never block. `appLaunch()` now starts the app folder that holds the `package.json` whose `main` is the running entry, so an app started as `electron dist/electron/main.js` (as `launchAppForTest` does) writes a launch file that can restart it. It falls back to the app path when no such folder is found, and a packaged build still starts with no app argument.

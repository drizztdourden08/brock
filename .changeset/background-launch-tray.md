---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

feat: background launch and an opt-in tray icon

An app can start with no window. A `--background` launch, or a `beforeWindow(ctx)` hook that returns `'skip'`, skips the splash and the app window while the whole boot and the bridge still run. `ctx.window.show()` creates the window on demand, or restores and focuses it. In background mode the app keeps running when the last window closes. A normal second launch shows the window, a second launch with `--background` shows nothing, and automation launches behave as before.

`product.tray` or `ctx.tray.set({ tooltip, icon?, menu? })` adds a tray icon. It uses the app icon by default, a left click shows the window, the menu takes show and quit actions, id items for `ctx.tray.onItem` and separators, and the tray is removed on quit. It is off unless the app asks.

`ctx.window` is now a function with a `show()` method, and `AutomationFlags` gains `isBackgroundLaunch()`. A hand-built partial `MainContext` or `AutomationFlags` in a test needs the new members.

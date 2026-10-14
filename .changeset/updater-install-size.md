---
'@drizztdourden08/brock-updater': minor
---

The updater measures the installed app. `window.api.updater.installSize()` returns its size on disk in bytes (the Velopack install folder on Windows, the `.app` bundle on macOS, the AppImage on Linux), or `null` outside an install. On Windows the module also writes it to the app's uninstall entry as a `REG_DWORD` `EstimatedSize`, the only type Windows Settings reads, so Installed apps shows the app's size; it never creates the key. `createUpdaterMain({ installSize: false })` turns the write off.

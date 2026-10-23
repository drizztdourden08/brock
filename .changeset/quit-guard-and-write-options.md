---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

An async quit guard and a write option for exports. `onBeforeQuit` on `BrockApp` and on a module is `() => 'quit' | 'stay'`, sync or async; the first `'stay'` keeps the app open, and a guard that throws counts as `'stay'`, so a failed save never closes the app. `quitGuards.addAsync` and `quitGuards.decide` register and run them, and `saveBeforeQuit({ dirty, save })` builds the usual guard with a Save, Discard and Cancel dialog (`confirmSave` is the dialog). Concurrent requests share one run, so a second close never stacks a second dialog. The main window now holds every native close (Alt+F4, the taskbar, the OS, `app.quit()`) and asks the renderer over the new `window:confirmQuit` ask before it closes; a renderer `window.close()` still closes at once, and an automation launch installs no hold. The sync `beforeQuit` is unchanged. `documents.write` and `documents.writeText` take `{ recent: false }` for an export such as a PNG: the file is not added to the recent list or the OS recent menu, and no recovery snapshot is cleared. The default still records. The new `QuitDecision` and `DocumentWriteOptions` types are in core.

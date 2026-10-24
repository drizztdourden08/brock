---
'@drizztdourden08/brock-electron': minor
---

`ctx.window.show()` now brings the window of a hidden automation launch on screen, at its saved bounds or centred on the primary work area, and `ctx.dialogs.confirm({ title, message, detail?, confirmLabel?, cancelLabel? })` asks a native yes or no question from main code while the app window is hidden. On an automation launch confirm shows nothing and resolves false.

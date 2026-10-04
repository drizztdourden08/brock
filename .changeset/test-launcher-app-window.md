---
'@drizztdourden08/brock-build': patch
---

`launchAppForTest` returns the app window, not the splash. It waits for the window that loads the renderer index (never `splash.html` or a widget window) and for the splash to close, which happens once every boot task resolved and the window was revealed. When it times out with the splash still open, the error says the boot never finished. An app no longer needs its own launcher for this.

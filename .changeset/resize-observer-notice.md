---
'@drizztdourden08/brock-core': patch
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-electron': patch
---

The review no longer fails `console-errors` on the browser notice `ResizeObserver loop completed with undelivered notifications.`. A window resize can defer observer callbacks to the next frame, and nothing is lost when it does. The renderer's global error handler now logs exactly that message as a warning and keeps it off the console, and the review's console feed skips it. Core exports `isBenignBrowserError` for that test. Every other console error still fails the check. `gate-context-only-reopens` now says whether the window came back in the wrong place, with both bounds, or was not shown again in time.

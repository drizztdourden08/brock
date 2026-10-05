---
'@drizztdourden08/brock-react': patch
---

A widget or screen write reaches the saved views at once when they are already loaded, so a flush on `pagehide` right after a change saves it; the restart test runs on fake timers.

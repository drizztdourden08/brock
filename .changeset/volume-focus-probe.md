---
'@drizztdourden08/brock-react': patch
---

The review volume step no longer fails in a window without focus. The focus probe is skipped when the window has no focus, and it waits 3 s at most without reporting a ceiling.

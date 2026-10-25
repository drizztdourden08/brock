---
'@drizztdourden08/brock-react': minor
---

Brock builds on Tessera 0.64 and its new toolbar dock. Docked toolbars sit in a visible bar, can share a lane and have resize handles that push their neighbours. The saved toolbar layout is now Tessera's v2 format. A layout saved by an older build is upgraded in memory when it loads and saved as v2 on the next change, so no script is needed. An older build that reads a v2 layout resets the toolbars to their defaults and leaves the widgets alone. Each docked toolbar bar is one F6 stop. Widget panels can take a corner and dividers push their neighbours, with no change to the saved widget layout.

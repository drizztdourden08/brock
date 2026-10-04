---
'@drizztdourden08/brock-electron': patch
---

Always on top holds on Windows: a pinned widget window, synced or not, and the pinned app window now ask for the `pop-up-menu` level there. Electron put the default `floating` level behind the taskbar, which could drop the window out of the topmost band at once or on a later focus.

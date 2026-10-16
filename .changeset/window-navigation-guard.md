---
'@drizztdourden08/brock-electron': patch
---

A file dropped outside a drop target no longer replaces the app with that file. The app window and every widget window cancel a navigation that leaves the page: a reload, the same origin (the dev server) and a hash or query change of the same page stay, a link with a protocol of `security.externalProtocols` opens in the system browser through `openExternal`, and anything else is dropped. `setWindowOpenHandler` still denies every new window and hands its link to `openExternal`.

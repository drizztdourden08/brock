---
'@drizztdourden08/brock-updater': minor
---

The updater hides itself on a host that cannot update itself. On a platform whose `capabilities.selfUpdate` is false (the web build, Android), or without the module's preload bridge, there is no Check for updates menu entry, no title bar action and no update dialog. `useUpdateAction` returns `null` there, and `useSelfUpdateHost()` and `selfUpdateHost(capabilities?)` are exported for app code.

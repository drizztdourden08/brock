---
'@drizztdourden08/brock-react': minor
---

A module settings tab no longer clashes with an app settings page or tab of the same id. The app keeps the plain id and the module tab moves to `<moduleId>.<tabId>` (`moduleTabId`), as does a module tab whose id an earlier module tab took. A module tab nothing else claims keeps its id, so existing links to it still open it. `mergeModules` now records `moduleId` on each module tab.

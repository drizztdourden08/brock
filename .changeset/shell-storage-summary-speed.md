---
'@drizztdourden08/brock-electron': patch
---

`storage:getSummary` no longer stats every file one after another: it lists each domain folder in one pass and stats 32 files at a time, the domains side by side. `storage:getDomainUsage` measures one domain, so a page can show each as it arrives.

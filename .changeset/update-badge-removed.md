---
'@drizztdourden08/brock-updater': minor
'@drizztdourden08/brock-build': minor
---

Breaking: brock-updater no longer exports `UpdateBadge` or its CSS; the title bar status action from `useUpdateAction` replaced it. Apps that import `UpdateBadge` switch to `useUpdateAction`; migration `update-badge-removed` turns each import into a to-do.

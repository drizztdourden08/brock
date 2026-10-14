---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-catalog': minor
'@drizztdourden08/brock-tools': patch
---

`JobHandle.setCancellable(on)` turns cancel off (or back on) while a job runs; the snapshot's `cancellable` follows, so the job dialog hides Cancel and `jobs.cancel` is ignored. A catalog install and a tool install turn it off once the download is in, before the checks and the unpack, and `installBarProps` leaves out `onCancel` then, so `CatalogInstallBar` shows no Cancel past the download.

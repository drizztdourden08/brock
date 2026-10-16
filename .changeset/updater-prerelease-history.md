---
'@drizztdourden08/brock-updater': patch
---

A check now finds a newer pre-release published before a newer stable hotfix. The check answers from the version list (the first listed version newer than the installed one, following Include pre-releases) instead of Velopack's check, which looks at a single GitHub release, so the check, the "Update available" badge and the install target agree. The version list reads every listed release's own `releases.<channel>.json` and keeps only that release's entries, since each feed holds only the packages that existed when it was packed; a failed feed read drops only its own release, and the list fails only when every read fails.

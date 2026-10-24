---
'@drizztdourden08/brock-electron': patch
---

`appLaunch()` finds the entry file as the first argument that is not a flag, so an app started by Playwright or launchAppForTest with `--inspect=0` in front still records its app folder and can be started again from a helper.

---
'@drizztdourden08/brock-updater': minor
---

The update dialog has a notice slot for the app. `setUpdateNotice(notice)` from `@drizztdourden08/brock-updater/renderer` takes a map from version to content, or a function that gets `{ version, currentVersion, action, prerelease }` for the version the user picked and returns content or nothing. The dialog shows it above the release notes, a string as a warning callout. It returns the undo.

---
'@drizztdourden08/brock-updater': minor
---

The update notice gets the release: the function given to `setUpdateNotice` now receives `releaseNotes` and `release` (`{ tag, name, url, publishedAt, prerelease, assets }`, each asset `{ name, url, size, contentType }`, or `null` when unknown), so an app can warn per version from what the release carries, such as a file that marks a change to saved data. `UpdateInfo` and `VersionOption` carry the same `release`.

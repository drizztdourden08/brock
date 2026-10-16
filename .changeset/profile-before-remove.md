---
'@drizztdourden08/brock-react': minor
---

`<BrockApp profiles={{ onBeforeRemove }}>` runs before a profile is removed, after the delete confirm. It gets the profile, may be async, and keeps the profile when it returns `false` or throws (the error is logged), so an app can stop the work tied to that profile, such as a running session, or refuse while it runs. `profileRemoval.add(fn)` registers one from outside React and returns the remove call. `useProfiles().removeConfirmed(profile)` now resolves `true` when the profile was removed and `false` when a hook kept it.

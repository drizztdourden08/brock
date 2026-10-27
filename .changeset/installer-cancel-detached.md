---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

An elevated installer job (`elevate: 'installer'`) can now be cancelled by default, so its Cancel button works. Cancel tries the normal stop first and ignores a refusal. If the installer exits during a short wait (2 s, then a forced kill and 3 s more), the outcome is `cancelled`. If it is still running, the job stops waiting and ends as `detached` with "The installer keeps running on its own. Brock stopped waiting for it." The output streams and the log file are closed and the child no longer holds the app open. `cancellable: false` still turns cancel off. The `detached` status is now documented on `ProcessJobOutcome`.

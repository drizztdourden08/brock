---
'@drizztdourden08/brock-port-kit': minor
---

`runAssetWorkerJob(ctx, options)` (port-kit `/main`) runs an app's asset extraction steps in a worker thread as a `ctx.job`, with each step's progress, lines and log on the job and cancel ending the thread; the worker module serves its steps with `serveAssetSteps` from the new `/worker` entry.

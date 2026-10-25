---
'@drizztdourden08/brock-react': minor
---

A module can now contribute a whole bucket. `RendererModule.buckets` takes `{ bucket, entries }` with the same `BucketDef` and `BucketEntry` shapes the generated screen tree uses. `BrockApp` adds the bucket, its hub and its search entries to the app's screen tree, throws if the app already declares that bucket id, and gives an app with no screen tree the hubs as module screens. A module menu entry whose `screen` is the bucket id opens it, so it can sit under Advanced with `menu: 'hidden'` and `switcher: false`.

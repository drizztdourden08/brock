---
'@drizztdourden08/brock-build': patch
---

`brock build --no-sync` builds from the committed `.brock` files and never runs `brock sync` first, so a gate run no longer rewrites the managed files of the app it builds.

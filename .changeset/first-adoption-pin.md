---
'@drizztdourden08/brock-build': minor
---

An app that was never on Brock starts at the version it adopts. `brock adopt` pins `package.json#brock.version` to its own version when the repo has none (an existing pin stays) and prints it. `brock migrate` now refuses an app with no `brock.version`, in its own `package.json` or its workspace root's, with or without `--from`, and points to `brock adopt`, so the migrations from 0.1.1 on never run over code Brock did not write. `--tessera-from` alone still runs. The first-adoption path is in docs/upgrading-an-app.md.

---
'@drizztdourden08/brock-thread': minor
'@drizztdourden08/brock-build': minor
---

Any repo with a `brock.workspace.mjs` can get its own command from brock-thread alone. brock-thread gains a `brock-thread` bin with `brock-thread link [--force]`, which installs the launcher `bin/<name>.mjs`, the `bin` entry and the `postinstall` for the workspace `name`, and `brock-thread <verb>` for the thread verbs. The launcher, its template, `installLauncher`, `launcherName` and `launcherSource` moved from brock-build to brock-thread, which brock-build now imports, so `adopt`, `create-brock` and `sync` write the same file as before. A repo that already has a command of that name, such as `tessera`, keeps it: `link` leaves its `package.json` alone and checks that its file forwards the thread verbs with `runThreadCli(argv)`, new in `@drizztdourden08/brock-thread/cli` beside `runThread` and `threadVerbNames`. It returns null for a word that is not a thread word, so the repo's own command handles it.

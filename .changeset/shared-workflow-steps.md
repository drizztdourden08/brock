---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-thread': minor
---

In a repo of several apps the shared workspace `ci.yml` runs the steps of every app, in workspace order, each named `<app>: <step>`, a shell step with `working-directory` and `APP_DIR` set to its app, and the plugins' steps once. `workflows: { ci: 'own' }` in `brock.workspace.mjs` leaves that shared file to the repo; an app's own `workflows` setting covers only its own files. A `uses` step of the same action, version and inputs runs once per job, however many apps or modules declare it.

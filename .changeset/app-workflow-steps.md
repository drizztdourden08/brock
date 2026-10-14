---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-thread': minor
---

An app adds its own steps to the managed CI and release workflows in `brock.config.ts`, `workflows.steps`, so `brock sync`, `brock build` and `platform add` keep them. Steps go in at fixed points: `ci.beforeInstall`, `ci.beforeBuild`, `ci.afterBuild` and `ci.beforeTest`, and `release.beforeInstall`, `release.beforePackage` and `release.afterPackage` (a file copied into `upload/` there ships with the release). A step takes `run` or `uses` (with `with`), `env`, `if`, `shell`, the repository `secrets` it reads (each set as an environment variable of the step), and `os` and `platforms` to keep it to some runners or platform jobs. Modules (`brock.workflows` in their manifest) and the repo command's plugins (`definePlugin({ workflows })`) add steps the same way, before the app's. `workflows: { ci: 'own' }` or `{ release: 'own' }` leaves that file to the app: `brock sync` stops writing it and `brock check` stops comparing it.

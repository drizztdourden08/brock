---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-electron': minor
---

Add `server.optionalAddons: string[]` to `brock.config.ts`, a list of package names. For a `.node` require, or a `bindings`, `node-gyp-build` or `prebuild-install` load, inside a listed package, `brock server build` replaces the addon with a module that throws when it loads, so the package's own try/catch runs and the bundle carries no binary (ssh2 and cpu-features work this way). An addon in the app's own code or in an unlisted package is still refused, and the error now names the package and points to `server.optionalAddons`. `@drizztdourden08/brock-electron/server` also exports `resolveDataDir(argv, env, cwd)`, the rule `runServer` uses for the data folder (`--user-data=`, `BROCK_DATA_DIR`, `STATE_DIRECTORY`, then `./.user-data`); `runServer` calls the same function.

---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
---

`workflows.publish: { packages, registry? }` publishes workspace library packages to GitHub Packages from the managed `release.yml`. `packages` are workspace folders, and `registry` takes `'github'`. `brock sync` adds a `publish-packages` job that waits for `prepare` and every build job, runs on `ubuntu-24.04` with `contents: read` and `packages: write`, installs with the frozen lockfile, builds each package that has a `build` script, and runs `pnpm publish --no-git-checks` for each one with `GITHUB_TOKEN`. A version `npm view` already finds is skipped, so a re-run is safe. Sync refuses a path that is not a workspace package, a `private: true` package, a name outside the repo owner's scope, and a package without `publishConfig.registry` set to `https://npm.pkg.github.com`, and says how to fix each. An app repo publishes its libraries without owning the workflow. `brock structure` expects a package listed there to be named `@<owner>/<app>-<subject>`, and every other package keeps `@<app>/<subject>`; the finding names the form that applies.

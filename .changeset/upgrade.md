---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-thread": patch
"@drizztdourden08/brock": patch
"@drizztdourden08/create-brock": patch
---

Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc; migration brock-app-logo-src moves apps to product.logos.

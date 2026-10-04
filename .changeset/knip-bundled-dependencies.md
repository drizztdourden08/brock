---
'@drizztdourden08/brock-build': patch
---

`brock knip` counts a dependency an app declares for the Brock and workspace packages it bundles (their `dependencies` and `peerDependencies`) as used. Knip reads `package.json#main` (`dist/electron/main.js`) whenever it exists, so a fresh worktree flagged those packages as unused until a build ran, and the upgrade gate, which lints before it builds, went red. The template's `knip.json` no longer lists `@electron-toolkit/utils`, `velopack` and `zustand` in `ignoreDependencies`.

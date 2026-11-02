---
'@drizztdourden08/brock-build': minor
---

The CI workflow templates run `pnpm run lint` and `test:pr` on a pull request, and `lint:all` and `test:e2e` on a push or a release. The scaffolded apps get the standards 0.13 script block, `defineBrockVitestConfig` starts from the standards preset, and `@drizztdourden08/brock-build/knip-brock-dependencies` is exported.

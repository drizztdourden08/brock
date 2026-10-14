---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
---

Workflow steps can target one job: a step's `jobs` (one id or a list) keeps it to those jobs of its point, `quality`, `review`, `web`, `changes` or `workspace` in CI and `prepare` or `build-<platform>` in the release. The new `release.prepare` point runs in the `prepare` job after the install, before its release note check and lint.

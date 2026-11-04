---
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/brock': minor
---

The windowsHide check now comes from standards 0.15.0 as `local/spawn-hides-window`. brock-lint-config drops its own `brock/spawn-hides-window` and needs standards 0.15.0 or later. A consumer bumps `@drizztdourden08/standards` to `^0.15.0`. An exception that named `brock/spawn-hides-window` now names `local/spawn-hides-window`.

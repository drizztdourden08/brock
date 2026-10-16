---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-build': minor
---

Breaking: brock-core no longer exports its own `formatDate`, `formatRelativeTime` and `DatePreset`. Brock shows dates with Tessera's `DateText` and `formatDate` since 0.56.0. The `core-date-helpers` migration (0.57.0) turns each use in a file that imports brock-core into a to-do pointing to Tessera's `formatDate` in `@drizztdourden08/tessera/primitives` and `DateText` in `@drizztdourden08/tessera/composites`.

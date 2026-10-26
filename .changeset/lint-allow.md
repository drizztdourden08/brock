---
'@drizztdourden08/brock-lint-config': patch
---

Honour `prose.allow` in `brockEslint`. Words listed under `prose: { allow }` now reach `local/no-slop-identifiers` and the slop rules, joined with any top-level `allow`, so a field name such as `claudeId` can be allowed in either shape.

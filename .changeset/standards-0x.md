---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-lint-config': patch
'@drizztdourden08/brock-thread': patch
'@drizztdourden08/create-brock': patch
---

Standards moved to 0.x: Brock depends on `@drizztdourden08/standards` ^0.6.0 and calls its shared workflows at `@v0`. The family never takes a major version; `standards sync --check` now rejects a changeset that asks for one.

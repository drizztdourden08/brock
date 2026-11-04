---
"@drizztdourden08/brock-core": patch
---

`composeProfileHooks` no longer seeds the merged profile extension with an empty object, so an app that augments `ProfileExtension` with required keys typechecks.

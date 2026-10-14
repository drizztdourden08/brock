---
'@drizztdourden08/brock-build': minor
---

`tsconfig.compilerOptions` in `brock.config.ts` merges over the managed `tsconfig.json`, key by key, with `paths` merged entry by entry, so an app can turn an option off while it fixes its errors without a hand edit that `brock check` would flag. Without it the managed file is unchanged.

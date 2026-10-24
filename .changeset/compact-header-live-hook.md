---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-lint-config': minor
---

`showHeader` in `ScreenMeta`, `LiveMeta` and `LivePage` also takes `'compact'`, which draws the hub page header in Tessera's compact size and still holds `PageActions`; `true` and `false` work as before. `PageHeaderMode` is exported. The lint config turns off `local/hook-file-named-after-hook` for `.live.tsx` and `.live.dev.tsx` files under `src/screens`, so a live file declares its hook and default-exports it without a re-export from a view.

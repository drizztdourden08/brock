---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-i18n': patch
---

brock sync now types the keys of package text tables. React, Electron and the i18n module declare their locale folder, so `msg('brock-app:...')`, `msg('brock-main:...')` and `msg('i18n:...')` pass the `keyof Messages` check in an app. An app table that overrides a package key gives one member, not two. The package base tables still load from the packages, so the bundle does not change.

---
'@drizztdourden08/brock-build': patch
---

`brock sync` ignores the generated icon files (`public/logos/icon.svg`, `icon.ico`, `icon-256.png`, `icon-32.png`, `icon-24.png`, the `icon-bot` files, `mark.svg`, `build/icons/` and `build/splash/`) only when an app sets `icons.brand`, the case where Brock generates them. An app without `icons.brand` supplies those files itself and no longer needs `git add -f`. An app that drops `icons.brand` gets the lines removed on the next sync. `brock adopt` no longer writes these lines.

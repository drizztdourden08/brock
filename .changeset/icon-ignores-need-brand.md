---
'@drizztdourden08/brock-build': patch
---

`brock sync` ignores the generated icon files (`public/logos/icon.svg`, `icon.ico`, `icon-256.png`, `icon-32.png`, `icon-24.png`, the `icon-bot` files, `mark.svg`, `build/icons/` and `build/splash/`) only for an app that sets `icons.brand`, the case where Brock generates them. The lines name that app's own folder and sit in a marked block that sync rewrites and nothing else. An app without `icons.brand` supplies those files itself and no longer needs `git add -f`; one that drops `icons.brand` loses its lines on the next sync. `brock adopt` no longer writes these lines.

---
'@drizztdourden08/brock-build': patch
---

`brock site add` names a site's views after the site (`StoreShell`, `StoreHome` and `StoreSignIn` for `apps/store`), so two sites in one repo pass Tessera's duplicate-part check. Existing sites keep their views.

---
'@drizztdourden08/brock-react': minor
---

Buckets, pages and cards shown per host or per profile. `hosts` and `when({ profile, host, formFactor })` on a bucket of `screens.config.ts` or in a screen file's `meta` hide it where they do not hold: no menu, nav, bucket switch, rail or search entry, no shortcut, and no screen on `open`. `when` runs again on a profile switch. A menu entry takes the same rule as `show`.

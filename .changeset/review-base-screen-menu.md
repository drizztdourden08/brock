---
'@drizztdourden08/brock-react': patch
---

The review's `<id>-in-menu` check skips the base screen (`<id>.base.tsx`) and any screen whose meta sets `menu: false`: they have no menu entry by design, so an app with a base screen no longer fails `session-in-menu` on every review.

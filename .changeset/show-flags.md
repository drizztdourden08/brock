---
"@drizztdourden08/brock-react": minor
"@drizztdourden08/brock-core": minor
---

App state in show rules. `<BrockApp showFlags={{ signedIn }}>` passes the app's own flags to every `hosts` and `when` rule as `ctx.flags`, so a page, a bucket, a card or a menu entry can show only while, say, the user is signed in: `when: ({ flags }) => flags.signedIn === true`. `useShowFlags({ ... })` adds flags from any component while it is mounted, which is how a module contributes them from its `Provider`; the app's prop is applied last. When a flag changes, the menu, the hub nav, the search palette, the bucket switch, the rail, the shortcuts and the open screen evaluate again. `ShowFlags` in `@drizztdourden08/brock-core/augment` types the flags. `ShowContext` now has `flags`, so code that builds a `ShowContext` by hand for `isShown` adds `flags: {}`.

---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-react': patch
---

Add `<bucket>.header.tsx`, a screen file that supplies the hub header of a bucket. `screens.config.ts` holds no render code, so `header` there could not be set by an app that declares its screens by file. The default export is a component taking the `HubRenderContext`, and an optional `actions` export is a second component drawn after it. Sync lists the file as a `header` entry, `buildScreenTree` builds the `{ render, actions? }` def from it, and the file wins over `header` in the config. `brock structure` reports a bucket that sets both, a header file not named after its bucket or outside its bucket folder, and a bucket folder that holds only a header. New `HeaderEntry` type.

---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-lint-config': minor
---

A bucket's header backdrop can be a component: `src/screens/<bucket>/<bucket>.backdrop.tsx` default-exports it, and `brock sync` lists it in `.brock/screens.ts` as a `backdrop` entry loaded with `lazyComponent`. `buildScreenTree` makes it the bucket's `{ kind: 'node' }` backdrop inside a `Suspense` with no fallback, and its load joins the preload of the hub home and of every page, tab and sub-page of the bucket, so a bucket switch pill, a menu row or a hub nav entry on hover or focus and the boot preload load it before the header draws. It wins over `backdrop` in `screens.config.ts`, and a page's `meta.backdrop` still wins over both. `brock structure` reports a backdrop file not named after its bucket or outside its bucket folder, a bucket folder holding only a backdrop, and a bucket that has both the file and the config field; the file takes a `<bucket>.backdrop.constants.ts`. The lint config treats it as a screen file (a default export). brock-react exports the `BackdropEntry` type.

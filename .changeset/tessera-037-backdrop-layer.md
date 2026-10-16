---
'@drizztdourden08/brock-react': minor
---

Tessera 0.37. Hub page headers draw their backdrop through Tessera's `BackdropLayer` (`backdropStyle` paints an image or a colour), and Brock's own `HubBackdrop` part, its `backdrop-style.ts` and the `.hub-backdrop` classes are gone; style `.backdrop-layer` if a hub needs more. A node backdrop now fills the layer the way it fills a Hero. `PageBackdrop` and the hero `Backdrop` slot take Tessera's `Backdrop` (it was `HeroBackdrop`), imported from `@drizztdourden08/tessera/primitives`; `brock migrate --tessera-from 0.36.0` rewrites an app's imports from Tessera's RENAMES. A `.hero.tsx` sets `meta.hero.size` (`'compact'`, `'default'` or `'tall'`, new `HeroMeta` type) and the hero frame passes it to Tessera's `Hero` as `size`.

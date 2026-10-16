---
'@drizztdourden08/brock-react': minor
---

Hub page headers draw their backdrop through Tessera's `BackdropLayer` (Tessera's `backdropStyle` paints an image or a colour), and Brock's own `HubBackdrop` part, its `backdrop-style.ts` and the `.hub-backdrop` classes are gone; style `.backdrop-layer` if a hub needs more. A node backdrop now fills the layer the way it fills a Hero. A `.hero.tsx` sets `meta.hero.size` (`'compact'`, `'default'` or `'tall'`, new `HeroMeta` type) and the hero frame passes it to Tessera's `Hero` as `size`.

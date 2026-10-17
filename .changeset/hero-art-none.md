---
'@drizztdourden08/brock-react': minor
---

A hero can turn off the brand art. `<Art kind="none" />` in a `.hero.tsx` draws no art, not even the brand mascot a branded app's hero gets when it renders no `Art`, the same way `<Backdrop kind="none" />` draws no backdrop. `HeroArtProps` takes `{ kind: 'none' }` beside Tessera's `HeroArt`. The review's `hero` step checks that a hero with art none draws no art (`<bucket>-hero-art-none`). Heroes that render `Art` or leave it out are unchanged.

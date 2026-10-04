---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

Brock moves to Tessera 0.13.0 (brock-react's peer is `^0.13.0`).

- Palettes: `BrockApp` imports Tessera's brand palettes into the `ds.palette` layer and sets `data-palette` on the document root to `product.icons.brand`, in the main window and in popped widget windows. The starter `src/theme.css` sets no seeds and only overrides; the `brock-palette` upgrade step turns an untouched starter theme (the old blue or the Brock seeds) into that override-only file and keeps a theme the app changed. The splash, the look and the installer read the brand palette while `theme.css` sets no seeds.
- Breaking for hero homes: `Art` takes a `kind` (`image` or `node`), `Backdrop` takes Tessera's `HeroBackdrop` (`node`, `image`, `color`) or `kind: 'none'`, and the new `Shade` slot takes `value`. The `hero-kinds` upgrade step adds `kind="image"` to art and turns a `Backdrop` with children into a to-do.
- About has no page header, as Tessera's InfoScreen now draws none; the screen declares the new `header: 'none'` and the review checks that no header shows.
- The search mascot comes from Tessera's `mascotForBrand`; Brock's own brand to mascot table is gone.

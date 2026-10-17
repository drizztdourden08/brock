---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
---

The app's brand mascot walks along the bottom of an open window and stands beside the search palette with a hint.

- While a screen window is open (a hub, a page or any `ScreenWindow`), Tessera's `MascotStage` draws the brand mascot along the bottom edge of the window, with its own autonomy: it idles, wanders and naps. It takes no pointer events or focus, follows Tessera's reduced motion, and goes away with the window. An app whose brand has no mascot draws nothing.
- When the Ctrl+K palette opens, the mascot walks beside it with the stage's `moveTo`, plays `point` and a `Callout` shows a hint about the search. It goes back to wandering when the palette closes.
- `product.mascot` in `brock.config.ts` is the config: `mascot: false` turns the walker off (the palette and hero mascots stay), and `mascot: { searchHint: '...' }` replaces the default hint, `Type to search pages, settings and actions.`.
- The review has a `mascot` step: the mascot stands along the window's bottom edge, then beside the palette with the hint, and is gone with the window (`mascot-window`, `mascot-window-bottom`, `mascot-beside-palette`, `mascot-search-hint`, `mascot-gone`), with captures `mascot-window` and `mascot-palette`.

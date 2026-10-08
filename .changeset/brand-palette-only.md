---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': patch
---

An app ships only its own brand's palette. `BrockApp` no longer imports every Tessera brand palette; `brock sync` writes `.brock/palette.css`, which imports the palette of `product.icons.brand` (nothing when Tessera has no palette for the brand), and the app's `src/main.tsx` imports it right after Tessera's `tokens.css`. The `brand-palette-import` migration (0.36.0) adds that import to an existing app's `src/main.tsx` once, and leaves a to-do when the renderer entry is elsewhere. New apps from `create-brock` have the import, and its first sync writes the template brand's palette.

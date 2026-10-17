---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Brock moves to Tessera ^0.42.0. A pixel art wordmark (`product.icons.wordmark.rendering: 'pixelated'`) now goes through Tessera on both splashes: the window's failure splash passes `wordmarkPixelated` to `Splash`, and the splash page writes Tessera's `ts-wordmark--pixelated`, so the sprite scales up with hard edges to fill the 384 px row. Brock's own `BootFailureSplash.css` and `.splash__pixelated` rule are gone. A wordmark now draws only as high as its picture, up to 48 px, so a very wide one has no empty band and a smooth one under 48 px high draws at its own height; `brock check` and `brock sync` warn when `src` or `dark` is shorter than 48 px, unless it is pixelated. Docked panes saved without `makeRoom`, in a widget layout or a kit view, now make room on load, and only a pane saved with `makeRoom: false` overlays the main view. Apps upgrade with `brock migrate`.

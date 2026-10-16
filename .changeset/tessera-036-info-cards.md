---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/create-brock': minor
---

Tessera 0.36, and small informational windows. A card whose meta sets `size: 'info'` opens like About: a small window sized to its content and centred, at most `--size-512` wide and at most the window's height, with no page header (the window title bar names it) and its content scrolling inside; under 560 px wide it fills the window. Brock passes it to Tessera's `ScreenWindow` as `size="info"` (`ScreenDef.size`, `ScreenSize`). The built-in Credits screen and the template's `credits.card.tsx` open this way. About opens small on its own: Tessera's `InfoScreen` now always opens at `size="info"`, and its `width` prop is gone (Brock never used it).

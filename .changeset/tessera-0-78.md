---
'@drizztdourden08/brock-react': patch
---

Brock builds on Tessera 0.78. Its own page, info card, hub and release notes scrollers ask Tessera's ScrollArea for a stable scrollbar gutter instead of a CSS rule, so a page that reflows with width no longer flips as the scrollbar comes and goes. Apps must update Tessera to 0.78 or later; nothing else changes.

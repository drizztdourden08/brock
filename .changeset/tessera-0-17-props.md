---
'@drizztdourden08/brock-react': patch
---

Brock drops its workarounds for parts Tessera 0.17 now draws: the popped widget window passes `dragRegion` to `Widget` in place of setting `data-app-region` on the title strip by hand, and a hero with no art and no backdrop relies on Tessera's own fit (`hero--bare`), so `hero-root--bare` and its CSS are gone. The Performance widget details and the About rows use the `sm` StatRow, and AboutPanel and the Performance widget import `CopyButton` from `/composites`.

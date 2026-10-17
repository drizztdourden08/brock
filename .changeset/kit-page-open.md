---
'@drizztdourden08/brock-react': patch
---

A page now hides an open widget kit. Opening Home or any screen while a kit is open used to draw the page inside the kit's main cell, with the kit's widgets, overlays and bar still around it. Now the kit steps aside like a context-only widget: its docked and floating widgets, its overlays and its bar are hidden, the kit stays open with its layout untouched, and it comes back as it was when the page closes. Its popped windows follow the normal popped rule on a page. The review checks it (`kit-page-hides`, `kit-page-returns`).

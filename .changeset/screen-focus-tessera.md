---
'@drizztdourden08/brock-react': patch
---

Screens take focus, make the page behind inert and give focus back through Tessera's ScreenLayer; Brock's own focus and inert code is gone. The title bar and the widget dock sit outside the screens' parent and stay usable, and the review checks it on every screen (ux-38).

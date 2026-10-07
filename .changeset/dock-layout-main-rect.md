---
'@drizztdourden08/brock-react': minor
---

`readDockLayout(page).main` is now in window terms, like `rects`, and is the main view alone. It was measured from the dock corner, so it was off by the title bar, and it took in a neighbouring pane that does not make room. A test that compared `main` with `rects`, or allowed for the old offset, gets different numbers: drop the offset, and expect a pane beside the main view to sit outside it.

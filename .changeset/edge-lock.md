---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

Snapped edges are locked together, and clusters come from geometry.

- A snap cluster is every window that touches the dragged one, directly or through others, main included: flush edges within 1 DIP that overlap, or a shared corner. It is taken from the window bounds when a move or resize starts, joined with the saved links, so a window touching two others, or snapped corner to corner, moves with the cluster. Dragging main or any widget moves the whole cluster; Ctrl, held at the start or pressed during the drag, moves the dragged window alone and takes it out.
- Resizing moves every edge on the dragged line: the facing edges across the seam as before, and now the edges on the same side that line up within 1 DIP and meet a window already on the line, such as the left edges of two stacked widgets or a widget's bottom lined up with main's bottom. One window at its minimum size stops the whole line. Ctrl resizes the dragged window alone without snapping, which takes its edge off the line. Main with an aspect lock never follows a widget.
- Snapping during a resize still ignores lines that move with the drag, but keeps the other edge of a window that follows on one side.
- The window guide hints say touching windows move together, lined-up or touching edges move with the dragged edge, and an aspect-locked app keeps its shape.
- The review's outer-edge, shared-edge, Ctrl and flush-bottom checks expect the locked edges.

---
"@drizztdourden08/brock-react": minor
---

A widget definition's `order` now also sets its default place in a dock column (or row, on the top and bottom sides). When Brock opens a widget onto a side that already holds others, it puts the widget after the last one with the same or a lower order, so a `View` widget with order 2 sits under `Project` with order 1 whichever opens first. Widgets with no order keep open order, after the ordered ones. Only the new widget is placed: panes already docked, a layout the user arranged and a layout preset that names its widgets are never reordered.

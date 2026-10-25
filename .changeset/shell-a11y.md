---
'@drizztdourden08/brock-react': minor
---

The shell gets landmarks, region cycling and an announcer. The title bar is a `banner` and the screen host is the one `main` (named by `product.widgets.mainLabel`). F6 and Shift+F6 move focus to the next and previous region and wrap; they are the commands `brock.region.next` and `brock.region.previous`, so they show in the shortcut list and can be rebound. A region is a landmark, a toolbar or any element marked with the new `focusRegion(id, label)`, and focus lands on the control that had it last. `announce(message, { politeness? })` writes to a polite or an assertive visually hidden live region mounted by `BrockApp`, and says the same message again when repeated.

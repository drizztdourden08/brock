---
'@drizztdourden08/brock-react': patch
---

A tour click step whose click target is in a popped widget is now a Tessera `advance: 'wait'` step, which adds no click listener in the main window, so a click on the step's lit part there no longer moves it on. The widget window still relays the click on its target and the tour goes on from it; the hint line keeps the step's `hint`, else Tessera's click words. A click target in the main document stays `advance: 'click'` with `clickTarget`.

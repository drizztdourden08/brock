---
"@drizztdourden08/brock-react": minor
---

Let a widget row keep keyboard focus after a click. An element with `data-widget-keeps-focus`, or inside one, is exempt from the widget focus guard, so a row that handles F2, the arrows or Delete itself keeps its focus. `keepsWidgetFocus()` returns the attribute to spread on the element and `WIDGET_KEEPS_FOCUS` is its name. The README and the architecture guide now explain why the guard exists and how a test focuses a widget row with the keyboard.

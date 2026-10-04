---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
---

`@drizztdourden08/brock-build/testing` exports `readDockLayout(page)` and `widgetWindows(app)`. `readDockLayout` returns the widget layout from brock-react's layout store (`layout`, the `docked`, `floating` and `popped` ids, the main view's rect and each drawn widget's rect); `widgetWindows` returns every popped widget window from main with its id, bounds, visibility, focus, minimized and always-on-top state. Neither reads Tessera's class names. brock-react's `WidgetHost` installs the layout reader on automation launches only.

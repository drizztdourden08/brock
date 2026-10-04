---
'@drizztdourden08/brock-react': minor
---

The app says when its widget context is active: `BrockApp` (and `WidgetHost`) take `widgetContext`, a hook such as `() => useSessionStore((s) => s.session !== null)`. While it returns false, `context-only` widgets hide, docked, floating and popped out (a popped one closes its window, keeps its place and reopens there). Without the prop the context stays active, as before, and a review launch always counts as in context so its captures still show those widgets.

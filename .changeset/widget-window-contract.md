---
'@drizztdourden08/brock-core': minor
---

The widget IPC contract grows for widget windows that work end to end: `WidgetWindowOpen` carries a `seq`, `atCursor` and `taskbar`, `widget:closed` carries the window's `seq`, `widget:patchSettings` and `widget:settingsPatch` relay a settings change from a widget window to the app, and the review gets `review:widgetProbe` (`WidgetProbeRequest`, `WidgetProbeResult`) and `review:captureWidget`.

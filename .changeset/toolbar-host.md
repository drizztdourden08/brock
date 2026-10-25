---
'@drizztdourden08/brock-react': minor
---

An app can place the toolbar host itself. `BrockApp` takes `toolbarPlacement`, `'widgets'` (the default, the dock wraps the widget host as before) or `'app'`, and with `'app'` the app mounts the exported `ToolbarHost` around its own work area, such as a canvas page. Only one host draws the toolbars; a second logs a warning once and renders only its children. A host that mounts late now keeps the layout saved for the profile: the store holds the stored layout until the toolbars are registered and reads it once, so the defaults are never saved over it. A docked toolbar is now a stop of its own for F6 and Shift+F6 even inside the main area, and the main area stays in the cycle.

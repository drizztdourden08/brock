---
'@drizztdourden08/brock-react': minor
---

Every screen and widget, docked or popped out, renders inside `RenderErrorBoundary` (Tessera's `ErrorBoundary`): a throw shows "This page hit an error" with Reload page, Go home and Report a bug and logs the error to the log bus, instead of blanking the whole app. `RenderErrorBoundary` and `reportRenderError` are exported.

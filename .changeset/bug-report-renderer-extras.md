---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

Renderer extras reach the bug report transport. `useBugReportExtras(source)` or `bugReport.setExtras(source)` registers a function that returns a JSON-safe object; the dialog calls it when it opens and the payload carries the answer as `extras`, so a main transport (`bootstrapApp({ bugReport })`) gets what only the renderer knows, such as the open screen. A source that throws leaves `extras` out and the report still goes.

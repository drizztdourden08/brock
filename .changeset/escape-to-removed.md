---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Breaking: the navigation store no longer has `escapeTo` and `setEscapeTo`, since Escape now closes the open window and reopens the last one. The `escape-to-removed` migration (0.62.0) leaves a to-do at each use; drop the call, or use `nav.reopen()`.

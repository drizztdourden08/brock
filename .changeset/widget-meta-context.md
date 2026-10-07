---
'@drizztdourden08/brock-build': patch
---

`brock structure` accepts `context` in a widget file's `meta`. `WidgetMeta` has taken it since the context registry, but the list of widget fields the structure check reads did not, so a widget that named its context was reported as having a field that is not a widget field.

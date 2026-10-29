---
'@drizztdourden08/brock-build': patch
---

`brock structure --check` accepts the widget meta fields added in 0.113.0: `contexts`, `when`, `empty` and `prefs`, and `when` on a widget kit. Before, a widget that used one of them was reported as having an unknown field.

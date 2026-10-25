---
'@drizztdourden08/brock-react': patch
---

`focusRegion(id, label, { role })` keeps the role an app asks for, such as `application` for a canvas. The role is still `region` by default, and the mark alone makes the element a region stop.

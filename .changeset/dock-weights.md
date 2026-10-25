---
'@drizztdourden08/brock-react': minor
---

A widget can carry a `dockWeight`, its relative height in a stack (1 when unset). A layout preset row with no entry in `sizes` takes the largest `dockWeight` among its widgets, so a definition can ask for a taller row. The `sizes` of a preset still win, and a saved layout still wins over the default. A widget opened later with `defaultSide` joins its edge stack through Tessera, which evens the stack out, so `dockWeight` does not reach it yet.

---
'@drizztdourden08/brock-react': minor
---

`confirmAction` and `confirmChoice` take `alternate: { label, onSelect, tone?, closes? }`, a third button beside confirm and cancel. `tone` is `neutral` (the default, drawn as a secondary button) or `danger`. The dialog stays open after `onSelect` unless `closes` is true, which closes it and resolves `false` for `confirmAction` and `null` for `confirmChoice`. The startup prompt `ctx.confirmAction` and `ctx.confirmChoice` pass it through. `confirmSave` and its red Discard are unchanged.

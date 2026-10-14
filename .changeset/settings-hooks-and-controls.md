---
'@drizztdourden08/brock-react': minor
---

Settings: a normalise hook, a patch transform, a row predicate, disabled options and two control kinds. `settings.normalise(settings, stored)` mends what a profile loads before anything reads it; `settings.transformPatch(patch, settings)` rewrites every patch before it is applied, saved and seen by the effects. An item's `visible(settings)` leaves its row out of the page and the searches while it returns `false`. A choice option takes `disabled: true` or a reason, drawn on Tessera's own segmented control, select or toggle group with the option off. `control: { kind: 'color' }` and `{ kind: 'multi', options }` draw Tessera's colour and multi-choice rows.

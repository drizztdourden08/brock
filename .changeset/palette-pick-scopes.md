---
'@drizztdourden08/brock-react': minor
---

Add scopes to `palette.pick`. A pick takes `scopes` (`{ id, label, options }`, the options a list or a lazy async function that loads once), an opening `scope`, and `onPick(value, scopeId)`. Tab and Shift+Tab move between scopes, the placeholder names the scope and the next one, scoped results are ranked by label, keywords and description, and a `group` on an option splits the results into titled groups. A flat `options` pick and `runWithPicker` behave as before. Scope chips in the palette header wait for a header slot on Tessera's `CommandPalette`.

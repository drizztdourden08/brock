---
'@drizztdourden08/brock-build': patch
---

The Tessera renames replay now renames props of object literals typed by their context. A `props` key on a type, such as `SettingsRowAction.onClick` to `onSelect`, renames the prop, method or shorthand of each object literal whose contextual type from the TypeScript checker (else its own type) is that Tessera type: under an annotation, `as` or `satisfies`, a function's return type, a call argument, an array element or a JSX prop value. Before, nothing renamed those props. A note in place of a name is a to-do on the prop. The checker runs once per release, over only the files with an object literal holding a prop some key names, asks only those literals, and shares the files it reads beside them between releases.

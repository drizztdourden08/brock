---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

`SettingAction` takes `tone` in place of `variant`, named as in Tessera's `ActionData` (variant became tone on every action shape in Tessera 0.21). `tone` is a `ButtonVariant`: `'danger'` gives the settings row its danger tone and a string `confirm` dialog its danger look, and `SettingActions` draws its buttons in it. `variant` is a deprecated alias that still works until 0.27; when both are set, `tone` wins. The Storage page's Clear action uses `tone`.

The 0.26.0 migration `setting-action-tone` rewrites `variant:` to `tone:` in the settings actions of an `actions: [...]` list (a JSX `actions` prop and mapped entries too) and in objects typed `SettingAction` by an annotation, a return type, `as` or `satisfies`. The `variant` of a `confirm` dialog stays. An object with `label`, `onSelect` and `variant` it cannot place, and an action that sets both, become to-dos. A second run changes nothing.

The template's General page shows a row action: Widget layout, with a Reset in the danger tone that asks first.

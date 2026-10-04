---
'@drizztdourden08/brock-react': minor
---

A settings item takes `actions` (`label`, `icon`, `variant`, `disabled`, `confirm`, `onSelect`). An item with actions and no control draws them as the row's control; an item with a control gets them in a row right under it. `confirm` asks through `confirmAction` first, the button shows its loading state while `onSelect` runs, and a throw becomes a toast. `SettingActions` draws the same buttons on a custom page.

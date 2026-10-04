---
'@drizztdourden08/brock-react': patch
---

A settings row action shows its button busy while `onSelect` runs, through the Tessera SettingsRow action `loading`, on settings pages and the Storage page. `SettingActions` keeps its loading button and no longer turns the other buttons off while one runs.

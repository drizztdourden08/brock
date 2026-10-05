---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.23.0: the workspace catalog and brock-react's peer range are `^0.23.0` (MIGRATION §196 and §197). The page header's Back (Tessera's `ContentHeader`, in `ScreenPage`, `SettingsPage` and hub pages, so Back to Saves on a sub-page) is now a `md` Button, 39 px tall, like the ScreenLayer header buttons. Brock's mark is the charcoal stone on both grounds, with a black outline on the light one and a white outline on the dark one: the splash, the hero and About draw it that way, and Brock passes no `inks`. `CommandInput` is drawn with `Combobox` and its props no longer extend `TextInputProps`; Brock used neither. RENAMES.json lists `inks` as removed from `BrandMark`, `Logo` and `Logo.Combined`, so `brock upgrade` makes each app use of it a to-do; an app that passed `name` or `autoFocus` to `CommandInput` drops them.

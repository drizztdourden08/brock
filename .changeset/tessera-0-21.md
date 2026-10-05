---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Brock moves to Tessera 0.21.0: the workspace catalog and brock-react's peer range are `^0.21.0` (MIGRATION §181 to §191). `brock upgrade` from 0.24 replays RENAMES.json (ManagedList to ItemList, MasterDetail to ListDetail, ContentHeaderBack to BackAction, `onClick` to `onSelect` and `variant` to `tone` on the action shapes, ToastContainer to ToastStack, the removed JsonInput, NamedRange and SetPicker, and the merged strings). The profiles list is Tessera's `ItemList`, and SettingsRow actions take `onSelect`.

`ScreenLayer` takes `back`, Tessera's `BackAction` `{ onSelect, label? }`, in place of `onBack`. The shell passes the page Back goes to as the label, the hub page or sub-page of the last history step, else the screen title, so the arrow reads Back to Saves. The 0.25.0 migration `screen-layer-back` rewrites `<ScreenLayer onBack={fn}>` to `back={{ onSelect: fn }}` and lists an `onBack` it cannot rewrite as a to-do.

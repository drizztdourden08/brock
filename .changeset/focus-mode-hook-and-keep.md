---
'@drizztdourden08/brock-react': minor
---

Focus mode gets a hook and a keep list. `useFocusMode()` returns whether focus mode is on, so an app can react to it. `layout.focusKeep({ widgets, toolbars })` names widgets and toolbars that stay visible while focus mode hides the rest. The command `brock.focus_mode` still toggles it and has no default chord, so the app picks the key.

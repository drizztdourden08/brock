---
'@drizztdourden08/brock-react': minor
---

`widgetDisabled` on `BrockApp` and `WidgetHost`: a hook that returns `(id) => ({ message, settingId }) | null`, so a widget the app cannot serve right now (a session that is not running, a device that is not plugged in) shows Tessera's disabled overlay with the reason and a button to its setting, instead of being hidden. `settingId` is a route with an optional row after `#`, opened like a search hit.

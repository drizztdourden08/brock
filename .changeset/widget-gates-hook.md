---
'@drizztdourden08/brock-react': minor
---

`defineWidgetGates` builds the `widgetDisabled` hook of `BrockApp` from a table of gates. Each widget id lists whether it reads game data and which setting it requires. A widget that reads game data is disabled while the `gameDataBlockedBy` setting is on, and a widget with a required setting is disabled while that setting is off. The app words the reason with `messageOf` and maps a setting to its route with `targetOf`. `resolveWidgetGate` is the pure step and the `WidgetGate` types are exported.

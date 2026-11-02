---
'@drizztdourden08/brock-input': patch
---

The Controllers hub now lists the pads that are plugged in when the app starts. A pad no longer needs a replug to show up. The list loads again when the diagnostics hold is restored.

The diagnostics wizard runs inside Tessera's `Wizard`, with its step strip and Back and Next bar. It keeps no header row of its own. The capture prompts, the input grid, the byte grid and the result lines are styled again, and the intro, chooser and capture steps use their original text.

The pad page has one Diagnose button in place of the diagnose icon and the report icon. It runs the diagnostics with that pad already chosen, so the wizard skips Choose a controller. The last step hands the result to the registered Report action (the action with the id `report`) as `onSelect(entry, result)`. With no Report action registered, the flow ends on its result step. The Diagnostics page in the hub keeps its controller picker. `DeviceCardAction.onSelect` takes an optional second argument. The module exports `REPORT_ACTION_ID` and the `DiagnosticsRunResult` type.

The positional capture step now takes button presses. It used to wait for a first state event before it had a baseline, and SDL only reports a state when it changes, so an idle pad never answered. Auto-capture is on by default, with a checkbox to turn it off. Answers you gave are kept when the device list refreshes.

The capture grid has equal rows and no wrapping. Each input shows one of three states: answered, current or pending. The current input has a banner that names what to press or move. The animation stops under reduced motion. The Summary step shows the positional capture as a table.

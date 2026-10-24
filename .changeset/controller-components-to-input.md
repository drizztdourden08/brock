---
'@drizztdourden08/brock-input': minor
'@drizztdourden08/brock-build': minor
---

ControllerLayout, StickPlot and PressedGrid move from Tessera to the input module. They keep their props and types, and the module exports them from `@drizztdourden08/brock-input/renderer` with `CONTROLLER_LAYOUT_VARIANTS`, `CONTROLLER_SLOT_IDS`, `ControllerExtra`, `ControllerSlots` and the prop types of each. `CalibrationPanel` and the device card now use the local copies. The controller strings (`Controller`, `Held now`, the slot names) ship with the component, so a Tessera strings override no longer reaches them. The BEM block of each part gains an `input-` prefix (`input-controller-layout`, `input-stick-plot`, `input-pressed-grid`), so an app stylesheet that reached into the old classes needs the new names. The `controller-components-to-input` migration of 0.82.0 rewrites an app's imports of the three names, and of their types, from `@drizztdourden08/tessera` and its `/composites` entry to `@drizztdourden08/brock-input/renderer`; the app needs the input module installed. The import codemod now also sees files that import only from the Tessera root.

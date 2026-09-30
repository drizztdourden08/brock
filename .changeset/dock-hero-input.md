---
"@drizztdourden08/brock-core": patch
"@drizztdourden08/brock-electron": patch
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-input": patch
"@drizztdourden08/brock-updater": patch
---

Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, and the review checks the dock, a headless pop-out window and the hero slots.

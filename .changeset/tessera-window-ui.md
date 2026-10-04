---
'@drizztdourden08/brock-react': minor
---

Tessera 0.10.0 draws the widget window controls, so Brock's interim pieces are gone.

- The popped options panel passes `sync`, `onSyncChange`, `group`, `groups` and `onGroupChange` to Tessera's `WidgetOptions`, which draws the "Sync with main window" switch and the "Window group" select with their tooltips and hints. `WindowGroupControls` is removed.
- The app window shows Tessera's `WindowGuideOverlay` while a widget window moves or resizes. Brock's own overlay is removed.
- The app title bar passes `windowGroup`, `windowGroups` and `onWindowGroupChange` to `WindowTitleBar`, so the View sub-menu has a Window group radio sub-menu. The cycling "Window group" title bar action and `useWindowGroupTitleAction` are removed.
- A full screen window group sets Tessera's `square` on the open screen's `ScreenLayer` and on the widget window's `Widget`, in place of the `brock-app--square` and `widget-window--square` classes.
- Brock keeps its own pin menu and "Stacking" row until Tessera reworks its pin button.
- The review reads the new markup: the guide by `.window-guide--open`, its mode and its snapping line, the square chrome on an open screen, and the View > Window group sub-menu, with a capture of it. It also captures the popped widget options with the sync and group rows.

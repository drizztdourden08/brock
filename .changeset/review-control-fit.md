---
'@drizztdourden08/brock-react': patch
---

The review checks the control sizes and how screens fit a narrow window. While the logs widget is docked, `widget-title-buttons-xs` checks that every button in its title bar is as tall as `--control-h-xs` and `title-bar-actions-sm` that the window title bar actions are as tall as `--control-h-sm`. After the screens step has toured every screen, it shrinks the app window to 600 by 720, opens each screen again, checks that no window or page title is cut and that the window content does not scroll sideways (`<id>-fits-narrow`), captures it as `screen-<id>-narrow`, then puts the window back.

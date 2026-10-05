---
'@drizztdourden08/brock-electron': patch
---

Widget windows restored at launch no longer appear before the app window. They are created hidden and held until the app window is revealed after boot; the reveal waits for them to be ready to show (at most 1.5 s each), then shows the app window and every held widget window in the same tick, each at opacity 0, and fades them in together with the same 220 ms ramp. Widget windows still show without taking the focus, synced ones stay owned by the app window, and on an automation launch (`--no-focus`) they stay off screen. A widget window that becomes ready during the fade fades in too; one opened after the launch shows at once, as before. Boot holds added while the reveal waits for others are now waited for as well.

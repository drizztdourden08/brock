---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-electron': minor
---

The title bar in full screen hides fully and slides in whole when the pointer reaches the top edge, above the widgets. Before, the revealed bar was drawn under the docked and floating widgets and under anything in the app content with a z-index, so only part of it showed: the window buttons sat behind a docked widget on the right, and an app whose main view stacks above the content saw a thin strip. The app content (`brock-app__content`) is now its own stacking context, so nothing in it can cover the title bar.

- The behaviour is Tessera's `WindowTitleBar` one: hidden in full screen (and in a borderless or full screen window mode), shown while the pointer is within the top 40 px, and Alt moves focus into it for the keyboard. Escape inside that revealed bar is left to it.
- A headless run (the review, `--screenshot`) now lays full screen out off screen at the display size, as cluster full screen already did, instead of taking over the real screen.
- New review step `fullscreen`: in full screen the bar is fully hidden (`fullscreen-bar-hidden`, captured as `fullscreen`), pointing at the top edge draws all of it with nothing covering it, a docked widget open (`fullscreen-bar-reveal`, `fullscreen-revealed`), moving away hides it (`fullscreen-bar-leaves`), Alt reveals it with focus inside (`fullscreen-bar-keyboard`, `fullscreen-keyboard`), and leaving full screen puts it back above the content (`fullscreen-bar-restored`).

# @drizztdourden08/brock-electron

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-core@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-core@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-core@0.6.0

## 0.5.0

### Minor Changes

- 241d164: Widget windows work end to end. A linked window is towed by the edge it sits on, so resizing the app from any side keeps it flush, and maximize or fullscreen hides the windows linked to the app until it is back to normal. Towed moves report their bounds, pending reports are flushed when the app closes or quits, and links survive a restart. The app snaps to widget windows with the same 14 px rule and links the one it lands against. A window lost after a display change comes back into a work area; a plain drag is left to the OS and no snap fights a move across displays of another scale. The `devOnly`, context-only and `show` gates close and reopen popped widgets, which keep their place. A drag-out opens the window at the release point: `onPopOut(id, point?: ScreenPoint)` is accepted ahead of Tessera 0.7.0, with the cursor as the fallback. Drop-in turns the window translucent over the app, ignores a drop where another widget window covers the app, and no longer loses a release between two renders; dock-backs carry a sequence number, Alt+F4 closes the widget, widget windows stay off the taskbar unless a definition sets `taskbar: true`, and followers come back without taking the focus. Widget windows get the active profile and the settings, with changes sent back to the app, and the log arrives as increments. The review drives all of it in a new `widget-windows` step.

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0

## 0.4.0

### Patch Changes

- @drizztdourden08/brock-core@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-core@0.3.0

## 0.2.0

### Patch Changes

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies [f818087]
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 38edbcc: The review's watchdog now fires after 30 s with no progress instead of 60 s in total, so a longer tour in a bigger app still finishes.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 23907ce: The updater module checks the product's GitHub releases, installs a picked version through Velopack and shows the UpdateDialog, and a main module can run code first in the boot with `onBoot`.
- Updated dependencies [0a52cd7]
- Updated dependencies [ade72f8]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
  - @drizztdourden08/brock-core@0.1.1

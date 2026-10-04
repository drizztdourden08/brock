# @drizztdourden08/brock-input

## 0.7.1

### Patch Changes

- Updated dependencies [e0ea131]
  - @drizztdourden08/brock-react@0.7.1
  - @drizztdourden08/brock-core@0.7.1
  - @drizztdourden08/brock-electron@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
- Updated dependencies [6d32d18]
- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0
  - @drizztdourden08/brock-react@0.7.0
  - @drizztdourden08/brock-electron@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [227dadf]
  - @drizztdourden08/brock-react@0.6.1
  - @drizztdourden08/brock-core@0.6.1
  - @drizztdourden08/brock-electron@0.6.1

## 0.6.0

### Minor Changes

- 0d9b68a: Brock moves onto Tessera 0.7.0. Hubs and settings hubs sit on `SideNavLayout`, a settings page draws one `SettingsSection` per section (with its own empty message), and hub search hits show their path and description. The logs widget hands `LogPanel` the whole log and keeps its type filter as a widget pref (`filters`, a list of filter clauses, in place of `hiddenLevels`). `ProfilesPanel` rows pass their aside as an end column. Popped widget windows follow Tessera's `visibleLayoutOf` gates, and `onPopOut` takes Tessera's `ScreenPoint`. The input tester and `CalibrationPanel` draw controller glyphs with Tessera's `InputIcon`: `CalibrationPanel` takes `family`, and `inputFamilyOf(vendorId)` picks Xbox, PlayStation, Switch or generic. The display settings tab lets its sections keep Tessera's spacing. Brock's root `tessera.config.json` sets `layer: renderer-shell` and an app tree for the panels Tessera handed over.

### Patch Changes

- Updated dependencies [0d9b68a]
  - @drizztdourden08/brock-react@0.6.0
  - @drizztdourden08/brock-core@0.6.0
  - @drizztdourden08/brock-electron@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [ff027d0]
- Updated dependencies [241d164]
  - @drizztdourden08/brock-core@0.5.0
  - @drizztdourden08/brock-electron@0.5.0
  - @drizztdourden08/brock-react@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now, with ProfilesPanel replacing Tessera's ProfilePicker: brock-react exports `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel`, and `@drizztdourden08/brock-input/renderer` exports `CalibrationPanel`, each with its props types and a Tessera usage file. The About screen sits in Tessera's `InfoScreen`, the Profiles screen can rename a profile in its row (`useProfiles().rename`), the input tester shows the buttons held while it calibrates, and the updater dialog draws brock-react's `ReleaseNotesPanel`.

### Patch Changes

- Updated dependencies [f90c7ee]
- Updated dependencies [babbff5]
  - @drizztdourden08/brock-react@0.4.0
  - @drizztdourden08/brock-core@0.4.0
  - @drizztdourden08/brock-electron@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [dde5d7e]
  - @drizztdourden08/brock-react@0.3.0
  - @drizztdourden08/brock-core@0.3.0
  - @drizztdourden08/brock-electron@0.3.0

## 0.2.0

### Patch Changes

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies
- Updated dependencies [f818087]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-react@0.2.0
  - @drizztdourden08/brock-core@0.2.0
  - @drizztdourden08/brock-electron@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [db1a6be]
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-react@0.1.2
  - @drizztdourden08/brock-core@0.1.2
  - @drizztdourden08/brock-electron@0.1.2

## 0.1.1

### Patch Changes

- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- bfbecb8: An automation launch leaves SDL3 off, so it never takes a controller from a running session.
- 4a48945: The input module reads SDL3 controllers, keeps the mapping database and calibration, plays rumble, and adds a Controllers screen.
- c48024b: The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- Updated dependencies [0a52cd7]
- Updated dependencies [ade72f8]
- Updated dependencies [9a08468]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [38edbcc]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [7e039b6]
- Updated dependencies [9fdc2e1]
- Updated dependencies [d50bd75]
- Updated dependencies [23907ce]
- Updated dependencies [a8a87be]
- Updated dependencies [e2cf0ee]
  - @drizztdourden08/brock-core@0.1.1
  - @drizztdourden08/brock-electron@0.1.1
  - @drizztdourden08/brock-react@0.1.1

# @drizztdourden08/brock-updater

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- 70d80cf: The update download and a failed update show Tessera's `TaskProgress`.
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [2473089]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [da0b1eb]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-react@0.18.0
  - @drizztdourden08/brock-core@0.18.0
  - @drizztdourden08/brock-electron@0.18.0

## 0.17.1

### Patch Changes

- @drizztdourden08/brock-core@0.17.1
- @drizztdourden08/brock-electron@0.17.1
- @drizztdourden08/brock-react@0.17.1

## 0.17.0

### Patch Changes

- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [055bb91]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
  - @drizztdourden08/brock-core@0.17.0
  - @drizztdourden08/brock-electron@0.17.0
  - @drizztdourden08/brock-react@0.17.0

## 0.16.0

### Minor Changes

- 7ef6122: Breaking: brock-updater no longer exports `UpdateBadge` or its CSS; the title bar status action from `useUpdateAction` replaced it. Apps that import `UpdateBadge` switch to `useUpdateAction`; migration `update-badge-removed` turns each import into a to-do.

### Patch Changes

- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-react@0.16.0
  - @drizztdourden08/brock-core@0.16.0
  - @drizztdourden08/brock-electron@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0
  - @drizztdourden08/brock-electron@0.15.0
  - @drizztdourden08/brock-react@0.15.0

## 0.14.0

### Patch Changes

- Updated dependencies [add0686]
  - @drizztdourden08/brock-electron@0.14.0
  - @drizztdourden08/brock-react@0.14.0
  - @drizztdourden08/brock-core@0.14.0

## 0.13.0

### Patch Changes

- Updated dependencies [33dc33c]
- Updated dependencies [4711645]
  - @drizztdourden08/brock-core@0.13.0
  - @drizztdourden08/brock-electron@0.13.0
  - @drizztdourden08/brock-react@0.13.0

## 0.12.0

### Patch Changes

- Updated dependencies [f751683]
- Updated dependencies [f751683]
- Updated dependencies [59c1c9d]
- Updated dependencies [f2b86ff]
  - @drizztdourden08/brock-react@0.12.0
  - @drizztdourden08/brock-core@0.12.0
  - @drizztdourden08/brock-electron@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [48ca303]
- Updated dependencies [54d913a]
  - @drizztdourden08/brock-core@0.11.0
  - @drizztdourden08/brock-electron@0.11.0
  - @drizztdourden08/brock-react@0.11.0

## 0.10.0

### Minor Changes

- a265770: Every settings row has a description and a hint, as in Tessera 0.10.0.

  - Breaking: a settings item is `{ key, label, hint, description | noDescription: true, keywords?, link?, control? }`, the same shape as Tessera's `SettingsItem`. The typecheck fails on an item without a `hint`, or without a `description` or an explicit `noDescription: true`. `SettingDescription` and `SettingItemFields` are exported, and a `choice` option takes its own `hint`.
  - Each item draws as a Tessera `SettingsRow`: the description under the title at rest, and the hint in its place while the control is pointed at or focused. A custom control from `renderControl` stays a content row, and a boolean item with a `link` stays a toggle with the link. `DefaultControl` is gone.
  - Search finds hints: the hub search matches the hint and each option's label and hint, the palette scores the hint like the description, and the build-time search seeds read `hint` from `.settings.ts` pages.
  - Every built-in row has a real description and hint: the template's General page, the display module's window and refresh rate rows, the updater dialog's pre-release and version rows, and the input module's dead zone sliders, which are now settings rows.
  - The `settings-row-hints` migration (0.10.0) leaves a to-do on each app settings row, in a `.settings.ts` page, a settings tab or a Tessera `SettingsSection`, that lacks a hint or a description, naming the missing fields.
  - The review points at a settings row on each settings page, checks that its hint replaces the description, and captures it.

### Patch Changes

- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
  - @drizztdourden08/brock-react@0.10.0
  - @drizztdourden08/brock-core@0.10.0
  - @drizztdourden08/brock-electron@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0
  - @drizztdourden08/brock-electron@0.9.0
  - @drizztdourden08/brock-react@0.9.0

## 0.8.1

### Patch Changes

- @drizztdourden08/brock-core@0.8.1
- @drizztdourden08/brock-electron@0.8.1
- @drizztdourden08/brock-react@0.8.1

## 0.8.0

### Patch Changes

- Updated dependencies [b7c919a]
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-electron@0.8.0
  - @drizztdourden08/brock-core@0.8.0
  - @drizztdourden08/brock-react@0.8.0

## 0.7.1

### Patch Changes

- Updated dependencies [e0ea131]
  - @drizztdourden08/brock-react@0.7.1
  - @drizztdourden08/brock-core@0.7.1
  - @drizztdourden08/brock-electron@0.7.1

## 0.7.0

### Minor Changes

- f6cfba5: Breaking: `RendererModule.titleBar` and `TitleBarSlot` are gone, and `STANDARD_TITLE_BAR_SLOTS` is now `STANDARD_TITLE_BAR_ACTIONS`. Tessera 0.8.0's `WindowTitleBar` takes `actions`, so a module lists `titleBarActions`: each a `WindowTitleBarAction` or a hook that returns one. Search (Ctrl+K) and Report a bug are standard actions, and the updater contributes `useUpdateAction`, a status pill reading "Update available" while an update waits. Every action is also in the hamburger, beside a View sub-menu with the pin and full screen, and an action replaces the menu entry of the same key there; Quit sits in its own group below them. The review checks the bar items, the menu actions and the View sub-menu. Migration `title-bar-actions` rewrites the updater badge and the standard buttons and leaves a to-do for any other slot.

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

### Patch Changes

- f90c7ee: AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now, with ProfilesPanel replacing Tessera's ProfilePicker: brock-react exports `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel`, and `@drizztdourden08/brock-input/renderer` exports `CalibrationPanel`, each with its props types and a Tessera usage file. The About screen sits in Tessera's `InfoScreen`, the Profiles screen can rename a profile in its row (`useProfiles().rename`), the input tester shows the buttons held while it calibrates, and the updater dialog draws brock-react's `ReleaseNotesPanel`.
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
- bdde234: `brock add` installs the packages a module lists under `peers`, so the updater brings velopack and the display module brings koffi.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- d50bd75: Every visual part of the shell is now a Tessera composite and Brock keeps only the wiring. The title bar is `WindowTitleBar`, the search palette is `CommandPalette` behind `PaletteHost`, About is `AboutPanel`, the profiles screen is `ProfilePicker` with `InlineCreateForm`, the screen rail is `SectionNav` in its rail variant, hubs and the settings hub sit in `NavLayout` with `SearchResults`, and settings pages are Tessera's `SettingsPage` with `SettingsGroupList`. The bug report button takes the `IconButton` danger tone, the diagnostics preview is a `CodeBlock`, the logs widget colours warnings and errors through `LogKindDef` tones, and the updater dialog uses `ReleaseNotesPanel` and `Callout`.

  Removed exports: `TitleBar`, `WindowControls`, `InstanceBadge`, `About`, `ProfileCard`, `CreateProfileForm`, `ScreenRail`, `SettingsPage`, `SearchPalette` and `partitionByLock`; use the Tessera composites in their place. `useProfiles` gains `removeConfirmed`, which deletes without the confirm dialog. The search flash class is now `search-hit`.

  Breaking: the removed shell exports ship the `removed-shell-exports` migration, which turns each import into a to-do naming its Tessera composite.

- 23907ce: The updater module checks the product's GitHub releases, installs a picked version through Velopack and shows the UpdateDialog, and a main module can run code first in the boot with `onBoot`.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
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

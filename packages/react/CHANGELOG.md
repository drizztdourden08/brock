# @drizztdourden08/brock-react

## 0.7.0

### Minor Changes

- f6cfba5: Brock takes Tessera 0.8.0 and its rimmed logos. `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's `brand/<rim>-rim/<brand>/` set, and it defaults to `'light'` for the `brock` brand, so the mark reads on dark surfaces. `brock icons`, the splash mark, the bot variant, the installer and Setup splash mark read from that tree. `brock icons` also copies `icon-32.png` and `icon-24.png` to `public/logos/`, and with a brand `product.logos.app` defaults to `./logos/icon-32.png`, so the title bar no longer scales a 256 px icon down to 20 px and loses the rim. A copied file is skipped only when it holds the same bytes, so a rim switch recopies the set. The About panel draws a rimmed brand as its bare mark. Migration `gitignore-title-bar-logos` ignores the two new logo files.
- 6d32d18: Brock takes Tessera 0.9.0 (peer range `^0.9.0`): the slim side-nav scrollbar and typed InputIcon names, with no code changes in Brock.
- f6cfba5: Breaking: `RendererModule.titleBar` and `TitleBarSlot` are gone, and `STANDARD_TITLE_BAR_SLOTS` is now `STANDARD_TITLE_BAR_ACTIONS`. Tessera 0.8.0's `WindowTitleBar` takes `actions`, so a module lists `titleBarActions`: each a `WindowTitleBarAction` or a hook that returns one. Search (Ctrl+K) and Report a bug are standard actions, and the updater contributes `useUpdateAction`, a status pill reading "Update available" while an update waits. Every action is also in the hamburger, beside a View sub-menu with the pin and full screen, and an action replaces the menu entry of the same key there; Quit sits in its own group below them. The review checks the bar items, the menu actions and the View sub-menu. Migration `title-bar-actions` rewrites the updater badge and the standard buttons and leaves a to-do for any other slot.

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0

## 0.6.1

### Patch Changes

- 227dadf: Brock takes Tessera 0.7.1: the hero title fits its column, and the logs widget uses Tessera's own "1 entry" / "n entries" count instead of Brock's workaround.
  - @drizztdourden08/brock-core@0.6.1

## 0.6.0

### Minor Changes

- 0d9b68a: Brock moves onto Tessera 0.7.0. Hubs and settings hubs sit on `SideNavLayout`, a settings page draws one `SettingsSection` per section (with its own empty message), and hub search hits show their path and description. The logs widget hands `LogPanel` the whole log and keeps its type filter as a widget pref (`filters`, a list of filter clauses, in place of `hiddenLevels`). `ProfilesPanel` rows pass their aside as an end column. Popped widget windows follow Tessera's `visibleLayoutOf` gates, and `onPopOut` takes Tessera's `ScreenPoint`. The input tester and `CalibrationPanel` draw controller glyphs with Tessera's `InputIcon`: `CalibrationPanel` takes `family`, and `inputFamilyOf(vendorId)` picks Xbox, PlayStation, Switch or generic. The display settings tab lets its sections keep Tessera's spacing. Brock's root `tessera.config.json` sets `layer: renderer-shell` and an app tree for the panels Tessera handed over.

### Patch Changes

- @drizztdourden08/brock-core@0.6.0

## 0.5.0

### Minor Changes

- 241d164: Widget windows work end to end. A linked window is towed by the edge it sits on, so resizing the app from any side keeps it flush, and maximize or fullscreen hides the windows linked to the app until it is back to normal. Towed moves report their bounds, pending reports are flushed when the app closes or quits, and links survive a restart. The app snaps to widget windows with the same 14 px rule and links the one it lands against. A window lost after a display change comes back into a work area; a plain drag is left to the OS and no snap fights a move across displays of another scale. The `devOnly`, context-only and `show` gates close and reopen popped widgets, which keep their place. A drag-out opens the window at the release point: `onPopOut(id, point?: ScreenPoint)` is accepted ahead of Tessera 0.7.0, with the cursor as the fallback. Drop-in turns the window translucent over the app, ignores a drop where another widget window covers the app, and no longer loses a release between two renders; dock-backs carry a sequence number, Alt+F4 closes the widget, widget windows stay off the taskbar unless a definition sets `taskbar: true`, and followers come back without taking the focus. Widget windows get the active profile and the settings, with changes sent back to the app, and the log arrives as increments. The review drives all of it in a new `widget-windows` step.

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now, with ProfilesPanel replacing Tessera's ProfilePicker: brock-react exports `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel`, and `@drizztdourden08/brock-input/renderer` exports `CalibrationPanel`, each with its props types and a Tessera usage file. The About screen sits in Tessera's `InfoScreen`, the Profiles screen can rename a profile in its row (`useProfiles().rename`), the input tester shows the buttons held while it calibrates, and the updater dialog draws brock-react's `ReleaseNotesPanel`.
- babbff5: Brock takes Tessera 0.6.0 (peer range `^0.6.0`); Brock uses neither the renamed numeric Stepper nor Emphasis, so no code changes. Standards is at ^1.0.3.

### Patch Changes

- @drizztdourden08/brock-core@0.4.0

## 0.3.0

### Minor Changes

- dde5d7e: Brock takes Tessera 0.5.0 (peer range `^0.5.0`): screens sit in Tessera's ScreenWindow (the former FullScreenLayer, classes `screen-layer*` and `screen-window__*`), and the title-bar search button draws the twinkling search icon in place of the removed SearchSpark. Brock's own code was moved with `brock migrate --tessera-from 0.4.0`.

### Patch Changes

- @drizztdourden08/brock-core@0.3.0

## 0.2.0

### Patch Changes

- Brock takes Tessera 0.4.0: SectionNav is SideNav and HeaderTabs is HeaderAnchorNav (replayed with Brock's own Tessera renames step), the title bar menu, the fixed-head search results and the config loader are the published ones.

  New apps' knip ignores `@drizztdourden08/standards`, whose stylelint plugins it sees through brock-lint-config; the `standards-lint-deps` upgrade step does the same for an existing app and drops `typescript-eslint` and `eslint-plugin-react-hooks`, which standards now carries.

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- 374cf2f: `upgrade` moves the app's Tessera to the range brock-react asks for (its catalog entry or plain spec; a linked Tessera is left alone), so an app upgraded across a Tessera release installs the Tessera its new Brock was built on. brock-react's Tessera peer range is `^0.4.0`.
- Updated dependencies [f818087]
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- db1a6be: A hub search shows a settings page's matching rows live, under their section titles and editable in place, as rotp's profile hub does, instead of links. Other pages keep link hits; pages whose name matches are offered as jumps. The review checks the live row, its control and the group heading.
- f60b232: `product.widgets.mainLabel` in `brock.config.ts` names the main view in the widget dock (default `Main`). The saved layout key stays `main`.
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 7e039b6: Every app gets a Ctrl+K search palette with an action API, a bug report dialog that opens a prefilled GitHub issue with diagnostics attached, a fuller About, toasts, and a widget host with a built-in logs widget kept per profile.
- 9fdc2e1: Brock builds on Tessera 0.2.0, which brings the brand gradients, resolved tokens and transparent marks the splash and installer read.
- d50bd75: Every visual part of the shell is now a Tessera composite and Brock keeps only the wiring. The title bar is `WindowTitleBar`, the search palette is `CommandPalette` behind `PaletteHost`, About is `AboutPanel`, the profiles screen is `ProfilePicker` with `InlineCreateForm`, the screen rail is `SectionNav` in its rail variant, hubs and the settings hub sit in `NavLayout` with `SearchResults`, and settings pages are Tessera's `SettingsPage` with `SettingsGroupList`. The bug report button takes the `IconButton` danger tone, the diagnostics preview is a `CodeBlock`, the logs widget colours warnings and errors through `LogKindDef` tones, and the updater dialog uses `ReleaseNotesPanel` and `Callout`.

  Removed exports: `TitleBar`, `WindowControls`, `InstanceBadge`, `About`, `ProfileCard`, `CreateProfileForm`, `ScreenRail`, `SettingsPage`, `SearchPalette` and `partitionByLock`; use the Tessera composites in their place. `useProfiles` gains `removeConfirmed`, which deletes without the confirm dialog. The search flash class is now `search-hit`.

  Breaking: the removed shell exports ship the `removed-shell-exports` migration, which turns each import into a to-do naming its Tessera composite.

- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
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

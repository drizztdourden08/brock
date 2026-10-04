# @drizztdourden08/brock-build

## 0.13.0

### Minor Changes

- 33dc33c: Snap clusters replace manual window groups.

  - Every window joined by snap links, directly or through other windows, the main window included, is one cluster, computed from the live links. Dragging any window of a cluster moves the whole cluster rigidly; only the dragged window snaps, to windows outside the cluster, and what it is dropped against joins the cluster. Holding Ctrl while moving drags one window alone: it leaves the cluster, its links break (a window linked to it relinks to another window it is still flush with) and it can snap elsewhere. A window with no link moves alone as before.
  - Maximize, full screen with the black backdrop, minimize and restore act on the cluster, with the same fit and pack maths and the same restore. Closing a widget closes that widget alone. Resizing keeps the session rules and never moves a cluster.
  - Manual groups are gone: the `group` field of the popped layout, `WidgetWindowState` and the probe facts, `WidgetWindowGroup`, `widget:setGroup`, `widget:setMainGroup`, `widget:getMainGroup` and `widget:mainGroup`, the "Window group" wiring of `WidgetOptions` and `WindowTitleBar` (Brock no longer passes those props), and `config/window-group.json`, which main deletes at start. A `group` left in a saved popped entry is dropped when the layout loads, and the `drop-window-groups` upgrade step cleans the dev data under `.user-data`. `WidgetWindowSummary.group` becomes `cluster`, the number of windows in the cluster, and the probe's `group` request becomes `cluster`.
  - The window guide shows in the window being moved or resized, a widget window or the main window, instead of always in main: `widget:guide` goes to that window only. Its hints follow the new rules: snapped windows move together, Ctrl moves one window alone, flush windows resize together, Ctrl resizes one window alone without snapping.
  - A resize now moves every window on the dragged line: two widgets stacked against main's left edge both follow main's edge, and either widget's right edge moves main's edge and the other widget's; a window stacked end to end on the far side of the line follows too.
  - The review checks a cluster moving together and with main, a Ctrl move detaching, cluster maximize, restore and full screen, the guide drawn in the moved window and in main, and the stacked seam.

### Patch Changes

- Updated dependencies [33dc33c]
  - @drizztdourden08/brock-core@0.13.0
  - @drizztdourden08/brock-thread@0.13.0

## 0.12.0

### Minor Changes

- 59c1c9d: Brock moves to Tessera 0.13.0 (brock-react's peer is `^0.13.0`).

  - Palettes: `BrockApp` imports Tessera's brand palettes into the `ds.palette` layer and sets `data-palette` on the document root to `product.icons.brand`, in the main window and in popped widget windows. The starter `src/theme.css` sets no seeds and only overrides; the `brock-palette` upgrade step turns an untouched starter theme (the old blue or the Brock seeds) into that override-only file and keeps a theme the app changed. The splash, the look and the installer read the brand palette while `theme.css` sets no seeds.
  - Breaking for hero homes: `Art` takes a `kind` (`image` or `node`), `Backdrop` takes Tessera's `HeroBackdrop` (`node`, `image`, `color`) or `kind: 'none'`, and the new `Shade` slot takes `value`. The `hero-kinds` upgrade step adds `kind="image"` to art and turns a `Backdrop` with children into a to-do.
  - About has no page header, as Tessera's InfoScreen now draws none; the screen declares the new `header: 'none'` and the review checks that no header shows.
  - The search mascot comes from Tessera's `mascotForBrand`; Brock's own brand to mascot table is gone.

### Patch Changes

- Updated dependencies [f751683]
  - @drizztdourden08/brock-core@0.12.0
  - @drizztdourden08/brock-thread@0.12.0

## 0.11.0

### Minor Changes

- d3e8420: The starter app takes the Brock palette (orange, charcoal and greys, matching the Brock logo) in place of the old blue. The `brock-palette` upgrade step rewrites an app's `src/theme.css` only when it still holds the untouched old starter seeds.
- 54d913a: Widgets by convention, placed like screens: an app's widgets are `src/widgets/<id>.widget.tsx` files whose default export is the component and whose `meta` holds the label, icon, popOut, devOnly, visibility, side and sizes. `brock sync` and the dev server write `.brock/widgets.ts`, and `BrockApp` takes it as the new `widgets` prop; `defineWidget`, `registerWidgets` and module widgets keep working. `brock structure` checks the folder, the lint config lets widget files export `meta` beside their default export, the starter app has a Notes widget, and `brock adopt` gives each app of a workspace its own views and prints where every kind of code goes. The `widget-files` migration wires `src/main.tsx` and lists every hand-made widget as a to-do naming its new file. Brock's own Logs and Performance widgets follow the same layout inside brock-react, and `docs/app-structure.md` maps where every piece of an app goes.

### Patch Changes

- Updated dependencies [48ca303]
  - @drizztdourden08/brock-core@0.11.0
  - @drizztdourden08/brock-thread@0.11.0

## 0.10.0

### Minor Changes

- a265770: Every screen shows Tessera's page header with an icon and a title.

  - Breaking: `ScreenDef.icon`, `HubDef.icon` and `HubPage.icon` are required, and `ScreenLayer` takes a required `icon`. Every built-in screen has one: Profiles, Settings, About, Credits and the input tester.
  - A fullscreen screen's content sits in Tessera's `ScreenPage` inside the `ScreenLayer` card, with the screen icon and title. `header: 'own'` leaves the content to draw its own headers; hubs and the settings screen use it. Each hub page draws under its own header: settings pages in `SettingsPage` with their anchors, a settings tab that renders itself in `SettingsPage` too, and every other page in `ScreenPage`. `HubPage.fullBleed` keeps a page such as a bucket's hero home filling the pane.
  - The About screen passes the app name as the `InfoScreen` heading and an info icon.
  - The `screen-icons` migration (0.10.0) leaves a to-do on each `defineScreen` or `defineHub` call without an icon.
  - The review checks the page header, its icon and its title on every screen and every hub page that has one.

- a265770: Every settings row has a description and a hint, as in Tessera 0.10.0.

  - Breaking: a settings item is `{ key, label, hint, description | noDescription: true, keywords?, link?, control? }`, the same shape as Tessera's `SettingsItem`. The typecheck fails on an item without a `hint`, or without a `description` or an explicit `noDescription: true`. `SettingDescription` and `SettingItemFields` are exported, and a `choice` option takes its own `hint`.
  - Each item draws as a Tessera `SettingsRow`: the description under the title at rest, and the hint in its place while the control is pointed at or focused. A custom control from `renderControl` stays a content row, and a boolean item with a `link` stays a toggle with the link. `DefaultControl` is gone.
  - Search finds hints: the hub search matches the hint and each option's label and hint, the palette scores the hint like the description, and the build-time search seeds read `hint` from `.settings.ts` pages.
  - Every built-in row has a real description and hint: the template's General page, the display module's window and refresh rate rows, the updater dialog's pre-release and version rows, and the input module's dead zone sliders, which are now settings rows.
  - The `settings-row-hints` migration (0.10.0) leaves a to-do on each app settings row, in a `.settings.ts` page, a settings tab or a Tessera `SettingsSection`, that lacks a hint or a description, naming the missing fields.
  - The review points at a settings row on each settings page, checks that its hint replaces the description, and captures it.

- a265770: Brock takes Tessera 0.10.0. The catalog and the brock-react peer move to `^0.10.0`.

  - `brock migrate` replays the new `configKeys` group of Tessera's `RENAMES.json`: dotted setting paths moved inside JSON files a project keeps, by file name, where `*` stands for any one key such as an app folder. The step edits `tessera.config.json` and `package.json` at the app root, the repo root and every workspace package in place. A key whose parent stays the same is renamed where it stands, an object whose every key moves to the same new sibling is renamed whole, and any other key is cut and pasted at the indentation of its new place, with an emptied parent removed. Order, layout and indentation are kept, a second run changes nothing, and a target that is already set is never overwritten: it becomes a to-do. For Tessera 0.10.0 that moves the usage settings object to `guide`, at the top level and under each `apps` entry, and the `package.json` guide script to `guide`.
  - Brock's own `tessera.config.json` holds `guide`, and the prose exception for the old key is gone.

### Patch Changes

- @drizztdourden08/brock-core@0.10.0
- @drizztdourden08/brock-thread@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0
  - @drizztdourden08/brock-thread@0.9.0

## 0.8.1

### Patch Changes

- 03dcade: Standards moved to 0.x: Brock depends on `@drizztdourden08/standards` ^0.6.0 and calls its shared workflows at `@v0`. The family never takes a major version; `standards sync --check` now rejects a changeset that asks for one.
- Updated dependencies [03dcade]
  - @drizztdourden08/brock-thread@0.8.1
  - @drizztdourden08/brock-core@0.8.1

## 0.8.0

### Patch Changes

- 98b5318: Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.
- Updated dependencies [98b5318]
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-thread@0.8.0
  - @drizztdourden08/brock-core@0.8.0

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-core@0.7.1
- @drizztdourden08/brock-thread@0.7.1

## 0.7.0

### Minor Changes

- f6cfba5: Brock takes Tessera 0.8.0 and its rimmed logos. `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's `brand/<rim>-rim/<brand>/` set, and it defaults to `'light'` for the `brock` brand, so the mark reads on dark surfaces. `brock icons`, the splash mark, the bot variant, the installer and Setup splash mark read from that tree. `brock icons` also copies `icon-32.png` and `icon-24.png` to `public/logos/`, and with a brand `product.logos.app` defaults to `./logos/icon-32.png`, so the title bar no longer scales a 256 px icon down to 20 px and loses the rim. A copied file is skipped only when it holds the same bytes, so a rim switch recopies the set. The About panel draws a rimmed brand as its bare mark. Migration `gitignore-title-bar-logos` ignores the two new logo files.
- f6cfba5: Breaking: `RendererModule.titleBar` and `TitleBarSlot` are gone, and `STANDARD_TITLE_BAR_SLOTS` is now `STANDARD_TITLE_BAR_ACTIONS`. Tessera 0.8.0's `WindowTitleBar` takes `actions`, so a module lists `titleBarActions`: each a `WindowTitleBarAction` or a hook that returns one. Search (Ctrl+K) and Report a bug are standard actions, and the updater contributes `useUpdateAction`, a status pill reading "Update available" while an update waits. Every action is also in the hamburger, beside a View sub-menu with the pin and full screen, and an action replaces the menu entry of the same key there; Quit sits in its own group below them. The review checks the bar items, the menu actions and the View sub-menu. Migration `title-bar-actions` rewrites the updater badge and the standard buttons and leaves a to-do for any other slot.

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0
  - @drizztdourden08/brock-thread@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-core@0.6.1
- @drizztdourden08/brock-thread@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-core@0.6.0
- @drizztdourden08/brock-thread@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0
  - @drizztdourden08/brock-thread@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: `brock migrate` from 0.3.0 runs `brock-compounds`: app imports of `AboutPanel` and `ReleaseNotesPanel` from `@drizztdourden08/tessera` move to `@drizztdourden08/brock-react`, `CalibrationPanel` moves to `@drizztdourden08/brock-input/renderer`, and an import of `ProfilePicker` leaves a to-do pointing to `ProfilesPanel`.

### Patch Changes

- @drizztdourden08/brock-core@0.4.0
- @drizztdourden08/brock-thread@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-core@0.3.0
- @drizztdourden08/brock-thread@0.3.0

## 0.2.0

### Minor Changes

- ee89ad0: `brock tessera <args...>` runs Tessera's own command line (`runTessera` from `@drizztdourden08/tessera/cli`) in the current folder, so `tessera.config.json` is found from there; every word after `tessera` reaches it, `--help` too, and the repo command (`bin/<repo>.mjs tessera new compound SaveSlot`) reaches it the same way. Tessera comes from the folder's own `node_modules`, else from an app of its workspace; without it the command says how to add it and exits 1.
- becd8b0: Migrations may hold a workspace step, `workspace({ rootDir })`, for a change no single file can make; it returns `{ touched, moved, todos }`, runs after the file steps of its version, and earlier to-dos follow the files it moves. The 0.1.3 `design-package` migration uses it: a monorepo gets `packages/design` (`@<scope>/design`), a root `tessera.config.json` that points at it with one `apps` entry per app, and every app compound whose imports it can rewrite moved there and imported from `@<scope>/design`; a compound it cannot move, and a component outside the parts folders, becomes a to-do. A single-app repo gets a `tessera.config.json` with `$schema` alone.
- 1f2ce71: `brock structure` and `brock prose` run the checks of `@drizztdourden08/standards`, with Brock's extension in `brock-build/standards.extension.mjs`: `brock.config.ts` marks an app, `build/installer` and `src/screens` keep their own checks, `<id>.task.ts` is a module file. Installing `brock-build` is enough for `standards structure` to load it. Breaking: the `brock.designSystem` flag is gone; list `@drizztdourden08/standards/extensions/usage-files` in `standards.config.mjs` instead. `brock adopt` and `create-brock` take `.npmrc`, `.jscpd.json` and the knip schema from the standards templates, and the generated `eslint.config.mjs` names the `react-app` preset. `brock-thread` checks PR text with the shared writing lists from standards.
- becd8b0: Brock reads the app layout from `tessera.config.json`. The splash look, the splash token sheet and the installer take the app theme from `theme.css` of that file (with the app's `apps` entry merged in), through the app's own `@drizztdourden08/tessera/config`, and keep `src/theme.css` when there is no file or the installed Tessera has no config entry; a file that breaks the schema stops with an error naming it. `appThemeCss(rootDir)` is the new `@drizztdourden08/brock-build/theme` entry, and the managed `stylelint.config.mjs` takes its token file from it. A new app carries a root `tessera.config.json` with `$schema` alone. `brock adopt` writes one when it is missing: `$schema` alone for a single app, `package`, `parts` and one `apps` entry per app when the repo has `packages/design`.
- e19834d: `brock migrate` replays Tessera's `RENAMES.json` after the Brock migrations: each release after `--tessera-from` (new), else `package.json#brock.tessera` (new pin), else 0.3.0, up to the installed Tessera, plus `next` when Tessera is linked to main; then it pins `brock.tessera` to the installed version. `brock migrate --tessera-from <version>` alone replays only the renames. Custom properties are renamed as whole tokens, components only where a file imports them from Tessera (the import, JSX tags and references), classes in class lists and selectors with a name boundary and longer keys first, props and prop values on the Tessera component's JSX, and literals typed with a renamed Tessera type. A value that is a note, a removed export, and a longer class built from a renamed one become numbered to-dos in the migration report; an entry whose value is also a key of its release is skipped with a warning, so a second replay changes nothing. `brock upgrade` passes the Tessera version the worktree had before its install as `--tessera-from` when the app has no pin yet.

### Patch Changes

- Brock takes Tessera 0.4.0: SectionNav is SideNav and HeaderTabs is HeaderAnchorNav (replayed with Brock's own Tessera renames step), the title bar menu, the fixed-head search results and the config loader are the published ones.

  New apps' knip ignores `@drizztdourden08/standards`, whose stylelint plugins it sees through brock-lint-config; the `standards-lint-deps` upgrade step does the same for an existing app and drops `typescript-eslint` and `eslint-plugin-react-hooks`, which standards now carries.

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies [1f2ce71]
- Updated dependencies [f818087]
- Updated dependencies [e19834d]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-thread@0.2.0
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- 7f38965: `brock structure` accepts `Name.usage.ts` in a component folder. A package whose `package.json` has `"brock": { "designSystem": true }` must have one in every component folder outside `sub-components/`.
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2
  - @drizztdourden08/brock-lint-config@0.1.2
  - @drizztdourden08/brock-thread@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- 568c900: An app on another Windows drive than its linked Brock checkout keeps its links: `create-brock --local`, `brock add --local`, `brock adopt --local` and `upgrade --local` add `prefer-frozen-lockfile=false` to `.npmrc` (and `pnpm-lock.yaml text eol=lf` to `.gitattributes`) when a `link:` spec crosses drives, so later installs resolve the links instead of joining `X:/...` to the app folder.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- 49968cd: Breaking: the app window has no loading screen of its own; the `index-boot-splash` migration removes the hand-written boot splash from an app's `src/index.html`. The CI upgrade job now keeps the upgrade and review reports.
- c48024b: The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
- 3680727: The installer preview shows the app's own version instead of a sample number.
- e406f70: `brock package` builds the small Windows installer, a downloader that reads `install.json` from the latest release and installs the payload it names, and writes that manifest with the entries carried forward from the previous release. A routine release is the update package only; `--full` adds the payload and the directory zip. The product config takes an optional `accent`, used for the installer progress bar and the downloader.
- fd0a736: The Windows installer is a template built from config. The downloader takes its colours from Tessera's dark theme (or its built-in colours until `tokens.json` exists), the gradient from the look and the mark from `public/logos/mark.svg`. Velopack's Setup splash is drawn from the same look, mark and name. `product.installer` sets the scope, the shortcuts, launch after install, an optional licence and the folder name, with rotp's behaviour as the default. `build/installer/header.png` and `build/installer/splash.png` replace the rendered images, and `brock package --render-installer` writes the screens to `release/installer-preview/`.
- be862b2: The repo launcher is a managed file: `brock sync` rewrites it from the current template, `brock check` reports it when stale, and `adopt` replaces an outdated one.
- c1c29a0: The repo command runs Brock in its own checkout when called from outside it, and a worktree install no longer rewrites the machine shims. Scaffolded and adopted apps route the scope to GitHub Packages in their .npmrc.
- bdde234: `brock add` installs the packages a module lists under `peers`, so the updater brings velopack and the display module brings koffi.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 2cc7040: The splash picks light or dark text by contrast against its gradient, from Tessera's theme text and background colours when they are available.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
- 97496b7: Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc (migration brock-app-logo-src), a non-boolean setting row needs a control (migration base-setting-controls), the built-in About menu entry replaces an app's own (migration menu-built-in-about), and .gitignore gains the files newer Brock generates (migration gitignore-generated-files).
- Updated dependencies [0a52cd7]
- Updated dependencies [568c900]
- Updated dependencies [ade72f8]
- Updated dependencies [f6a334e]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8dec315]
- Updated dependencies [8498845]
- Updated dependencies [d78f430]
- Updated dependencies [f62f048]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
- Updated dependencies [97496b7]
  - @drizztdourden08/brock-core@0.1.1
  - @drizztdourden08/brock-thread@0.1.1
  - @drizztdourden08/brock-lint-config@0.1.1

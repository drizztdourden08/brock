# @drizztdourden08/brock-lint-config

## 0.113.0

## 0.112.0

## 0.111.0

## 0.110.0

## 0.109.1

### Patch Changes

- d97ed8a: `brockEslint` no longer depends on the folder ESLint runs from. When `rootDir` is not passed, it is now the folder of the eslint.config file that called the factory, else the nearest folder at or above the current one that holds an eslint.config file, else the current folder. Before, running ESLint from a subfolder (`apps/web` under a root config) listed the data and verbatim files relative to that subfolder, so their globs did not match and `@kind verbatim` files were not recognised. A `rootDir` you pass still wins.

## 0.109.0

## 0.108.0

## 0.107.1

## 0.107.0

## 0.106.2

## 0.106.1

## 0.106.0

### Patch Changes

- 00e4059: Honour `prose.allow` in `brockEslint`. Words listed under `prose: { allow }` now reach `local/no-slop-identifiers` and the slop rules, joined with any top-level `allow`, so a field name such as `claudeId` can be allowed in either shape.

## 0.105.0

## 0.104.0

## 0.103.0

## 0.102.0

## 0.101.0

## 0.100.0

## 0.99.0

## 0.98.0

## 0.97.2

## 0.97.1

## 0.97.0

## 0.96.1

## 0.96.0

## 0.95.0

## 0.94.0

## 0.93.1

## 0.93.0

## 0.92.0

## 0.91.0

## 0.90.0

## 0.89.1

## 0.89.0

## 0.88.1

## 0.88.0

## 0.87.2

## 0.87.1

### Patch Changes

- b079114: Fix the duplicate copy of standards in a repo that is ahead of Brock. These packages asked for standards `^0.11`, so a repo on standards `^0.12` got two copies and `standards sync` failed with "Cannot redefine plugin". The range is now `>=0.11.0 <1`, so the one copy a repo installs satisfies every Brock package.

## 0.87.0

### Minor Changes

- 20ce5ee: Docked toolbars by convention, on Tessera `^0.56.0`. An app puts a toolbar in `src/toolbars/<id>.toolbar.tsx`, default-exporting `defineToolbar({ id, label, defaultSide, hiddenByDefault?, render(slot) })`; `slot` carries the orientation, the grip `handle` and the `side`. `brock sync` lists the files in `.brock/toolbars.ts` as `appToolbars`, `brock structure` accepts and checks the folder, and `RendererModule.toolbars` adds a module's toolbars.

  `BrockApp` takes `toolbars` and, when at least one is registered, wraps the widget host in Tessera's `ToolbarDock` inside `brock-app__stage`. An app with no toolbars is unchanged. The layout is saved per profile as its own `toolbarLayout` key in `ui-views.json` beside `widgetLayout`, loaded with `migrateToolbarLayout`, and defaults to `createToolbarLayout`. `useToolbarMenuEntries()` adds a Toolbars sub-menu to Widgets, with its own Reset toolbars entry; Reset layout still resets widgets only.

  The `toolbar-files` migration (0.87.0) adds `toolbars={appToolbars}` and its import to `src/main.tsx`. The lint stack allows the default export in `src/toolbars/*.toolbar.tsx`.

## 0.86.0

## 0.85.0

## 0.84.0

## 0.83.0

## 0.82.0

### Minor Changes

- 9e2ade8: `showHeader` in `ScreenMeta`, `LiveMeta` and `LivePage` also takes `'compact'`, which draws the hub page header in Tessera's compact size and still holds `PageActions`; `true` and `false` work as before. `PageHeaderMode` is exported. The lint config turns off `local/hook-file-named-after-hook` for `.live.tsx` and `.live.dev.tsx` files under `src/screens`, so a live file declares its hook and default-exports it without a re-export from a view.

## 0.81.0

## 0.80.0

### Minor Changes

- 7fe7469: Start-up prompts and a richer confirm dialog. A start-up prompt is `src/startup/<id>.prompt.ts`, default-exporting `defineStartupPrompt({ order?, run(ctx) })`; `RendererModule.startupPrompts` adds a module's. Brock runs them once per launch, one at a time in `order`, after the window reveal, once a profile is active with its settings loaded and after any first-run tour has ended or been skipped, and never on an automation launch. A prompt that throws is logged and the next one runs. `ctx` carries `confirmAction`, `confirmChoice`, `confirmSave`, `profile`, `settings` (`get`, `patch`, `flush`) and `nav`. `brock sync` writes `.brock/startup.ts` (a prompt with a literal `order` loads when it runs), `src/main.tsx` passes it as `startupPrompts` (the `startup-prompts` migration of 0.80.0 adds that), `brock structure` checks the folder and the lint preset lets prompt files default-export. `confirmChoice` takes `look: 'select'` (Tessera's `Select`, with `searchable`) in place of the radio group and still resolves the picked value, or `null` on cancel. Every confirm dialog takes `facts: { label, value }[]`, drawn under the message with Tessera's `FactsPanel`. Defaults are unchanged.

## 0.79.0

## 0.78.0

## 0.77.0

### Minor Changes

- 44c38e9: Live hub pages. A `<id>.live.tsx` file in a bucket or group folder is a slot in the hub nav that fills at runtime. It default-exports a hook that returns `LivePage[]` (`key`, `title`, `icon`, `badge` of `'ok'` or `'warn'`, `render`) and exports `meta: LiveMeta` (`icon`, `empty`, `title`, `order`, `keywords`, `devOnly`). The slot sorts by `meta.order` among the static pages, so Directory, one entry per connected pad, then Logs and Diagnostics keep their order. The badge shows as a status dot on Tessera's `SideNavItem`, `empty` shows as a disabled nav entry while the list is empty, and `keywords` feed the hub search. An entry opens at `<bucket>/<id>/<key>` (`section` and `tab`); when it disappears, the hub shows the first static page of the group. `brock sync` reads the file as an eager kind, and `brock-lint-config` treats it as a screen file. See Live hub pages in `docs/app-structure.md`.

## 0.76.0

### Patch Changes

- 3f10ec7: An upgrade worktree no longer fails lint on the files a config generator puts there. `brock prose` skips an untracked `.ai-config.json` and `.mcp.json` at the repo root, and `brockMarkdownlint` skips a `CLAUDE.md`, `AGENTS.md` or `.github/copilot-instructions.md` whose first lines say `GENERATED by ai-config`. A guide an app wrote itself has no such line and stays linted. The list lives in one place, `GENERATED_FILES` in lint-config, with a new `generated-files` export. In a monorepo, `brock sync` now also writes `.markdownlint-cli2.mjs` into an app whose `package.json` has a `lint:md` script, so `pnpm lint:md` in `apps/desktop` finds its config instead of printing help and exiting 2. The root still owns the eslint and stylelint configs, and a single app is unchanged. `create-brock` keeps that file when it scaffolds a workspace app.

## 0.75.0

## 0.74.1

## 0.74.0

## 0.73.0

## 0.72.0

## 0.71.1

## 0.71.0

## 0.70.0

## 0.69.0

## 0.68.6

## 0.68.5

## 0.68.4

## 0.68.3

## 0.68.2

## 0.68.1

## 0.68.0

## 0.67.0

## 0.66.0

## 0.65.0

## 0.64.0

## 0.63.0

## 0.62.0

## 0.61.0

## 0.60.1

## 0.60.0

## 0.59.0

## 0.58.0

## 0.57.0

## 0.56.0

## 0.55.0

## 0.54.0

### Minor Changes

- 8a06415: Widget kits: a group of widgets that opens and closes as one unit, keeps a layout of its own and never mixes with the normal widgets. `src/widgets/<id>.kit.ts` default-exports its `WidgetKitMeta` (`label`, `icon`, `order`, `devOnly`, `requires: { context, reason }`, `layout`), a widget joins it with `kit: '<id>'` in its `meta`, and `src/widgets/<id>.overlay.tsx` draws a layer over the main view while the kit is open. `brock sync` writes `.brock/widget-kits.ts` (`appWidgetKits`) for every app, and `BrockApp` takes it as `widgetKits`. `defineWidgetKit`, `registerWidgetKits`, `RendererModule.widgetKits`, the `widgetKits` calls (`open`, `close`, `toggle`, `reset`, `active`, `isOpen`) and `useWidgetKitStore` cover kits made in code.

  Each kit is a sub-menu of Widgets with Open kit or Close kit, its widgets and overlays, and Reset kit layout. While a kit is open, the dock holds only the kit's widgets around the main view, with the same docking, tabbing, floating, snapping and resizing as any widget. The normal widgets and their popped windows step aside and come back when the kit closes. One close in the menu, a bar at the top of the main view and `widgetKits.close()` each close the whole kit, and each widget's own close button still closes that widget alone. A kit whose `requires` context is inactive opens on a card with its reason in place of its widgets, and draws them as soon as the context turns active. Each kit's layout and hidden overlays are saved per profile in `ui-views.json` under `widgetKits`.

  A widget can now put its own buttons in its title strip: `tools` in `meta` (a component) or `defineWidget` (`() => ReactNode`), docked, floating or popped.

  The review has a `kits` step. It checks the gate reason, that a kit opens and closes together, that kits and normal widgets never mix, that each kit's layout is saved and restored, and that overlays live and die with their kit. It also captures every app kit as `kit-<id>`. `brock structure` checks kit and overlay files and every `meta.kit`, and lint lets them default-export. The `widget-kits-prop` migration (0.54.0) adds `widgetKits={appWidgetKits}` to `src/main.tsx`. The template ships a small `inspect` kit: a Grid widget with a reset tool in its title strip, a Pointer widget and a grid overlay.

## 0.53.0

## 0.52.1

## 0.52.0

## 0.51.1

## 0.51.0

## 0.50.0

## 0.49.0

### Minor Changes

- a0eedd2: A bucket's header backdrop can be a component: `src/screens/<bucket>/<bucket>.backdrop.tsx` default-exports it, and `brock sync` lists it in `.brock/screens.ts` as a `backdrop` entry loaded with `lazyComponent`. `buildScreenTree` makes it the bucket's `{ kind: 'node' }` backdrop inside a `Suspense` with no fallback, and its load joins the preload of the hub home and of every page, tab and sub-page of the bucket, so a bucket switch pill, a menu row or a hub nav entry on hover or focus and the boot preload load it before the header draws. It wins over `backdrop` in `screens.config.ts`, and a page's `meta.backdrop` still wins over both. `brock structure` reports a backdrop file not named after its bucket or outside its bucket folder, a bucket folder holding only a backdrop, and a bucket that has both the file and the config field; the file takes a `<bucket>.backdrop.constants.ts`. The lint config treats it as a screen file (a default export). brock-react exports the `BackdropEntry` type.

## 0.48.0

## 0.47.0

### Patch Changes

- bdf91d0: Standards 0.11: a `@kind verbatim` file also skips the vendor and assistant name check for its string values.
- d8d344e: A title bar action file may export `order` or `meta` beside its default export, as screen and widget files may. A ROM whose asset file is empty lists as having no assets (`hasAssets: false`, `assetBytes: 0`).

## 0.46.0

## 0.45.1

## 0.45.0

## 0.44.0

## 0.43.0

### Minor Changes

- f2d84fd: A new file kind for text reproduced word for word from an outside source, which the app must show exactly as it is (a licence text, a game's own dialogue table, the strings a protocol defines): `/* @layer <layer> @kind verbatim @source <short text> */`. A verbatim file gets everything `@kind data` gets (no 200-line cap, several exports, `UPPER_SNAKE` consts, and `brock/data-only` keeps it to data), and in addition the dash, punctuation and prose rules skip its string values through the standards `verbatimText` option, with the source as the `why`. Identifiers, comments, the header and vendor names are still checked, and an ordinary `@kind data` file keeps every prose rule. The new `brock/verbatim-source` rule fails a verbatim header without `@source`, and `brock structure` lists every verbatim file with its source so a review sees what is exempt. `@drizztdourden08/brock-lint-config/data-files` exports the list. Needs `@drizztdourden08/standards` 0.10. See `docs/app-structure.md`.

## 0.42.0

## 0.41.0

## 0.40.0

## 0.39.0

### Patch Changes

- 472754d: Dev-only screen files (`inspector.page.dev.tsx`, `state.tab.dev.tsx`, `tools.settings.dev.ts` and the other dev-only kinds) lint as screen files: their default export and their `meta` export pass, as in the shipped screen files.

## 0.38.0

### Minor Changes

- 3387134: Standards 0.9: list names that must keep their exact spelling in the prose allow list (they now pass the identifier rule too), and a test may assert the real text its app shows.

## 0.37.0

## 0.36.0

### Minor Changes

- 5a819b6: A file whose header says `@kind data` is a data file: `brockEslint` finds these files by their header and turns `max-lines`, `local/one-export-per-file` and `local/constants-in-constants-file` off for them, so a record file or a generated table can run past 200 lines, export several lists and keep its `UPPER_SNAKE` consts. The new `brock/data-only` rule holds such a file to data: imports, types, export lists and `const` declarations of literals, arrays, objects, spreads, references, constant arithmetic, `as`, `satisfies` and `Object.freeze`. A function, a call, a conditional, a getter, `let` or any other statement there is an error, so the kind cannot be claimed to dodge the rules.
- 0aaabeb: Brock depends on `@drizztdourden08/standards` ^0.8.0, and `brock-thread` drops its copy of the release note checker for `@drizztdourden08/standards/release-notes`: `checkReleaseNote` is the standards function, and `checkNoteFile` runs its `checkRepoNotes` for the version named, so `brock release` and `brock release-notes check` also hold every newer note in the repo to the standard.
- e344df6: `brock site add <name>` adds a site beside the Brock app: a separate single-page web app at `apps/<name>` of the same pnpm workspace, drawn with Tessera (`TesseraProvider`, the brand palette, the tokens and its own `theme.css`), framed by Tessera's `SiteHeader` (brand, links, the profile menu as the title bar's dropdown action) and `SiteFooter`, with a sign-in page on the brand gradient. `brock.site.ts` (`defineBrockSite` from `@drizztdourden08/brock-build/site`) gives it a tool port of the app's port block in the checkout's slot, an optional `/api` dev proxy to a URL or to a port offset of the same slot, node polyfills and aliases; `brock site dev`, `build`, `preview` and `list` run it. `brock sync` writes its managed `vite.config.ts` (`defineBrockSiteConfig` from `@drizztdourden08/brock-build/vite-site`), `tsconfig.json` and its own `ci-<name>.yml`, gated by `brock affected`, and `brock check` reports their drift. The site joins `tessera.config.json`, `knip.json` and the Tessera guide, and the lint preset takes `brock.site.ts` as a default-export file. Brock adds no server kit, functions, hosting deploy or sign-in layer for it. `brock adopt` lists a design package's `src/views`, the views two or more apps share, beside each app's own views.

## 0.35.0

## 0.34.0

## 0.33.0

## 0.32.1

## 0.32.0

## 0.31.0

## 0.30.0

## 0.29.1

## 0.29.0

## 0.28.1

## 0.28.0

## 0.27.0

### Minor Changes

- f704655: Guided tours are part of every Brock app, drawn by Tessera's `GuidedTour` and presented by the app's brand mascot. A tour is a file: `src/tours/<id>.tour.ts` default-exports `defineTour({ id, title, steps, trigger? })`. `brock sync`, `brock dev`, `brock build` and the renderer Vite plugin write `.brock/tours.ts`, `BrockApp` takes it as `tours`, and `RendererModule.tours` adds a module's tours. `brock structure` checks the folder, and `brock-lint-config` lets tour files default-export.

  A step lights a Tessera target or a Brock one (`{ shell: 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen' }`, `{ widget: '<id>' }`, `{ setting: '<key>' }`). Before it shows it can `open` a screen or hub page, open a `widget`, set a `context` and run `before(ctx)`, which may be async. `advanceOn` waits for a click (`{ click: target }`), a tour event (`tours.emit(name)`) or a context change. Each step can name the mascot's state.

  `tours.start(id)`, `tours.stop()`, `tours.next()`, `tours.back()` and `useTour()` drive tours. Completion and the last step are kept per profile in `ui-views.json`, so a finished tour doesn't come back by itself. `trigger: 'first-run'` starts a tour once, the first time a profile opens the app, after the boot and the splash. Menu > Take the tour (in Help when the app has a Help group, else in Advanced) and a search palette action per tour start them. Escape closes a tour, and the other shell shortcuts wait while one is open. The title bar stays usable over the tour. The menu knows a `help` section.

  The review gets a `tours` step: it runs every tour end to end, clicks through interactive steps, captures each step and checks that the tour is kept as completed and that Escape closes it.

  The template ships `welcome.tour.ts`, a four-step first-run tour of the menu, the search, the Notes widget (which waits for a click) and Settings. The 0.27.0 `tour-files` migration adds `tours={appTours}` and its import to `src/main.tsx`.

## 0.26.0

## 0.25.0

## 0.24.1

## 0.24.0

## 0.23.0

## 0.22.0

## 0.21.1

## 0.21.0

## 0.20.0

## 0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- 70d80cf: The generated `.brock` files are never linted: `brockEslint` ignores `**/.brock/**`, the templates list it, and migration `eslint-brock-ignore` adds it to the ESLint config of the app and of the workspace root.

## 0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: Apps add their own review steps: each `src/review/<id>.step.ts` (default export `defineReviewStep({ run })`) runs as step `<id>` after the built-in steps, in the same report. `run(tour)` gets the built-in helpers: `check`, `report`, `capture` (named `<id>-<name>`), `find`, `findAll`, `click`, `hover`, `typeText` (inputs and textareas), `press`, `waitFor`, `settle`, `delay`, `openScreen`, `openWidget`, `resetUi`, plus `platform` and `api`. A step that finishes gets a passing `step-ran` check, and an id that is a built-in step's name fails. `brock structure` accepts `<id>.step.ts` files and the lint preset allows their default export. The new app ships `src/review/notes.step.ts`.
- d358df3: A base screen is a file now: `src/screens/<id>.base.tsx`, one per app, default-exports its component (`BaseProps`) with `title` and `icon` in `meta`. `brock sync` lists it, `BrockApp` draws it under every hub, Escape closes down to it and opens `config.home` from it, and `brock structure` rejects a second one, one inside a bucket and one named like a bucket. The `base-screen-file` migration moves a hand `defineScreen` passed through `screens` and `home` into that file, or leaves a to-do naming the file when the screen holds more than a title, an icon and a component.
- e70afc3: An app puts its own items in the title bar without a module: `src/title-bar/<id>.action.ts` default-exports `defineTitleBarItem({ kind: 'button' | 'menu' | 'status', ... })` or a hook that returns one. `brock sync` writes `.brock/title-bar.ts` and `BrockApp` takes it as `titleBar`. A `menu` item opens a dropdown of its own, a `status` item is a tag drawn while its status is set, and every item folds into the main menu when the bar is narrow. App items come after Search, Report a bug and the module items, whose order stays fixed. The `title-bar-files` migration wires `src/main.tsx`.
- 87fa9a3: A default widget layout and Reset layout. `src/widgets/layout.ts` default-exports `defineLayoutPreset({ rows, sizes, widths })`: rows of widget ids around the `main` view, with an array of ids tabbing them in one pane. `brock sync` exports it from `.brock/widgets.ts` as `appWidgetLayout` (undefined without the file), and `src/main.tsx` passes `widgetLayout={appWidgetLayout}` to `BrockApp`. A profile with no saved layout starts from it, and `meta.defaultOpen` opens a widget the preset does not place on its default side. `widgets.reset()` and the new Reset layout entry at the end of the Widgets menu put the layout back to that default. The `widget-layout-prop` migration wires `src/main.tsx`; the template ships a layout with Notes beside the main view.

## 0.16.0

### Minor Changes

- 7ef6122: A tab page takes its meta from `<page>.page.ts` beside its folder: a file that exports only `meta: ScreenMeta` (title, icon, order, shortcut, devOnly, keywords). The screen sync writes it as a `page-meta` entry, the nav and the search index name and place the page with it, and `brock structure` names a `.page.ts` with no tab folder beside it or no `meta` export.

## 0.15.0

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

### Minor Changes

- 54d913a: Widgets by convention, placed like screens: an app's widgets are `src/widgets/<id>.widget.tsx` files whose default export is the component and whose `meta` holds the label, icon, popOut, devOnly, visibility, side and sizes. `brock sync` and the dev server write `.brock/widgets.ts`, and `BrockApp` takes it as the new `widgets` prop; `defineWidget`, `registerWidgets` and module widgets keep working. `brock structure` checks the folder, the lint config lets widget files export `meta` beside their default export, the starter app has a Notes widget, and `brock adopt` gives each app of a workspace its own views and prints where every kind of code goes. The `widget-files` migration wires `src/main.tsx` and lists every hand-made widget as a to-do naming its new file. Brock's own Logs and Performance widgets follow the same layout inside brock-react, and `docs/app-structure.md` maps where every piece of an app goes.

## 0.10.0

## 0.9.0

## 0.8.1

### Patch Changes

- 03dcade: Standards moved to 0.x: Brock depends on `@drizztdourden08/standards` ^0.6.0 and calls its shared workflows at `@v0`. The family never takes a major version; `standards sync --check` now rejects a changeset that asks for one.

## 0.8.0

### Patch Changes

- 98b5318: Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.

## 0.7.1

## 0.7.0

## 0.6.1

## 0.6.0

## 0.5.0

## 0.4.0

## 0.3.0

## 0.2.0

### Minor Changes

- 1f2ce71: The rules move to `@drizztdourden08/standards`, and `brock-lint-config` becomes Brock's app preset on top of it, with the same exports: `brockEslint`, `brockStylelint`, `brockMarkdownlint`, the rule sets, `./slop-patterns`, `./slop-line-kind`, `./markdown-rules`, `./file-shape`, `./stylelint-rules/*` and `./tsconfig/*`, so app configs do not change. `brockEslint` is `standardsEslint` with the `react-app` preset and Brock's extension (Tessera names in the raw-control messages, default exports for screens, module entries and boot tasks, Tessera's tokens for `brock/no-token-*`), which the package also declares in `package.json` for discovery. Every source file now needs the `/* @layer <layer> @kind <kind> */` header (`local/file-header`). `typescript-eslint`, `eslint-plugin-react-hooks` and `stylelint-config-standard` are no longer peers: standards carries them.

## 0.1.2

## 0.1.1

### Patch Changes

- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.

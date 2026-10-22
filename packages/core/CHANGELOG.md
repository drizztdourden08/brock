# @drizztdourden08/brock-core

## 0.70.0

## 0.69.0

## 0.68.6

## 0.68.5

## 0.68.4

## 0.68.3

## 0.68.2

## 0.68.1

## 0.68.0

### Minor Changes

- 1f7604e: The app's brand mascot walks along the bottom of an open window and stands beside the search palette with a hint.

  Apps can set `restoreNavigation: false` on `BrockApp` to start without reopening the last screen. The menu review also skips screens hidden by their `show` condition.

  - While a screen window is open (a hub, a page or any `ScreenWindow`), Tessera's `MascotStage` draws the brand mascot along the bottom edge of the window, with its own autonomy: it idles, wanders and naps. It takes no pointer events or focus, follows Tessera's reduced motion, and goes away with the window. An app whose brand has no mascot draws nothing.
  - When the Ctrl+K palette opens, the mascot walks beside it with the stage's `moveTo`, plays `point` and a `Callout` shows a hint about the search. It goes back to wandering when the palette closes.
  - `product.mascot` in `brock.config.ts` is the config: `mascot: false` turns the walker off (the palette and hero mascots stay), and `mascot: { searchHint: '...' }` replaces the default hint, `Type to search pages, settings and actions.`.
  - The review has a `mascot` step: the mascot stands along the window's bottom edge, then beside the palette with the hint, and is gone with the window (`mascot-window`, `mascot-window-bottom`, `mascot-beside-palette`, `mascot-search-hint`, `mascot-gone`), with captures `mascot-window` and `mascot-palette`.

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

### Minor Changes

- ea30589: `product.icons.wordmark` takes `rendering`: `'auto'` (the default, smooth scaling) or `'pixelated'`, for pixel art that should scale with hard pixel edges. With `{ src: './logos/wordmark.png', rendering: 'pixelated' }`, About, the boot splash page, the window's failure splash and the Setup splash draw the wordmark with `image-rendering: pixelated` (nearest neighbour on the Setup splash); without it nothing changes, since most logos look wrong pixelated. `defineProduct` keeps `rendering: 'pixelated'` on the resolved wordmark and refuses any other value. `AboutPanel` takes `wordmarkRendering`.

## 0.58.0

## 0.57.0

### Minor Changes

- 2bf0884: Breaking: brock-core no longer exports its own `formatDate`, `formatRelativeTime` and `DatePreset`. Brock shows dates with Tessera's `DateText` and `formatDate` since 0.56.0. The `core-date-helpers` migration (0.57.0) turns each use in a file that imports brock-core into a to-do pointing to Tessera's `formatDate` in `@drizztdourden08/tessera/primitives` and `DateText` in `@drizztdourden08/tessera/composites`.

## 0.56.0

## 0.55.0

## 0.54.0

## 0.53.0

### Minor Changes

- 60cb320: Five additions to the bug report. `bugReport.open({ title })` and `bugReport.setDefaultTitle(title)` prefill the title, cleared when the dialog closes. `section` in `BrockApp`'s `bugReport` is a component the dialog renders below the attachments; it gets `setExtras` and `disabled`, and what it sets joins the payload's `extras`. `transport` is now optional there, so an app with a main transport can still add a section. `identity` beside a transport (a string in `BrockApp`, `identity(ctx)` in `bootstrapApp`, reported as `BugReportTransportInfo.identity`) shows "Reporting as <identity>" in place of the contact field. A receipt's `links`, `{ label, url }[]`, each get a button in the receipt view, with the single `url` still shown as Open. A receipt's `retry` shows Retry upload in the receipt view, even for a toast transport; a main transport's `retry` stays in main and runs over the new `bugReport:retry` channel, the renderer getting a `retryId` in `BugReportReceiptWire`. The review checks the prefilled title.

## 0.52.1

## 0.52.0

### Minor Changes

- 1477d7f: Moves to Tessera ^0.37.4. With View hidden, the `window-pin` and `window-fullscreen` menu keys work again: they reach the tucked Pin on top and Full screen rows of the main menu through the title bar's `tucked` prop. `label` renames the row in both states, and the new `activeLabel` field, taken by these two keys only, is its text while the window is pinned or in full screen. `group`, `order`, `before` and `after` place the row as they place View, and `hidden: true` or `inMenu: false` leaves it out. `brock check` warns again when View, Pin on top and Full screen are all out of the menu, since a narrow window then has no way to reach them, warns when either key is set while View is shown, since it then has no effect, and reports an `activeLabel` on any other key.

## 0.51.1

## 0.51.0

## 0.50.0

## 0.49.0

### Minor Changes

- 7f76f4f: New job options for `ctx.job` and `jobs.start`:

  - `visible: false` runs a quiet job. It reports progress like any other job and its snapshot carries `visible: false`, but it stays out of the title bar item and the job dialog. It clears itself 30 s after it ends, whether it succeeded, failed or was cancelled. Every `JobSnapshot` now has `visible`.
  - `forwardLog: true` also writes the job's log lines to the app log as `[job <id>] <message>`. A main job writes through `ctx.log`, a renderer job to the `app` channel. The app log keeps the lines after the job is gone.
  - `onDuplicate` sets what starting an id that is still running does. `'throw'` is the default and keeps today's "already running" error. `'queue'` starts the new job under the same id once the running one ends. `'parallel'` starts it under the first free `<id>-2`, `<id>-3` and so on. `'join'` returns a handle on the running job, whose `run` resolves with that job's result instead of running the work again.

  `JobHandle` gains `started` (resolves once the job runs) and `ended` (resolves with `done`, `failed` or `cancelled`), so a hand-written `JobHandle` fake needs both. `createJobRegistry(emit, now?, sink?)` takes a sink for the forwarded log lines. `useJob(id)` also returns `step`, the current step with its label, beside `job`, which is `null` when no such job is known. It follows main and renderer jobs alike, so a page can show a job's progress inline.

- 9ff1b40: The app can now change the title bar menu Brock builds, entry by entry, while the detected menu stays the default. `product.menu.entries` in `brock.config.ts` and the same object in a screen's `meta.menu` take, per entry key, `inMenu: false` (out of the menu only, still reached by the search palette, its route and its shortcut), `hidden: true` (out of the menu, the search palette and the keyboard shortcuts, still openable from code by its route), `label`, `group` (`'main'`, `'sections'`, `'modules'` or `'end'`), `order` (like CSS `order`, 0 by default), `before` and `after` another entry's key, and `parent` (a submenu's key, or `null` for the top level). They merge in that order, the app config last. Every built-in entry, section, bucket, page, card and module entry has a stable key; docs/app-structure.md lists them. The View sub-menu takes only a label, since the title bar draws it.

  `brock check` reports a field it does not know, a wrong value, a `bucket:` or `screen:` key no screen file gives, an entry that names itself and a `before` and `after` loop; a development launch logs the rest once each, such as a key no entry has or a parent that is not a submenu. Nothing throws: an override that cannot apply is skipped.

  With no active profile, every menu entry that opens a screen needing a profile now shows as disabled with the reason, Pick or create a profile first, as Home already did, instead of looking enabled and opening nothing.

  The review's menu checks follow the effective menu: the built-in entries and the last group are read where the overrides put them, a hidden screen is no longer expected in the menu, each overridden entry gets a `menu-entry-<key>` check that it is out of the menu, or drawn at its place between its neighbours, and each hidden entry a `search-hidden-<key>` check that the palette does not list it.

## 0.48.0

## 0.47.0

### Minor Changes

- 6ead199: A product wordmark. `product.icons.wordmark` names the app's name drawn as an image, an SVG or PNG under `public/` given as a path like the logos (`'./logos/wordmark.svg'`), or `{ src, dark }` with a variant for the dark splash ground. `defineProduct` resolves it to `{ src, dark }` (`dark` defaults to `src`, new types `ProductWordmark`, `ProductWordmarkInput` and `ProductIconsInput`) and refuses a file that is not `.svg` or `.png`. When it is set, the boot splash and its failure screen, the window's failure splash (`BootFailureSplash`) and the Setup splash `brock package` renders show the `dark` image in place of the name text, and the About window shows `src` as its heading (`AboutPanel` takes `wordmark`). The image keeps the name as its accessible name. Unset, nothing changes. The splash page uses `ts-wordmark` ahead of Tessera shipping it and sizes the image itself until then; the window's failure splash paints the image over the name text until Tessera's `Splash` takes a wordmark image.

## 0.46.0

### Minor Changes

- b1026b9: `pickFile({ anyType })` takes a host or form factor (`'mobile'`, `'desktop'`, `'electron'`, `'capacitor'`, `'web'`) or a map of them such as `{ mobile: true }`, and drops the type filter only there, so a phone opens the picker unfiltered while the Electron picker keeps its filter. A host key wins over the form factor key. `true` still drops it on every host. `anyTypeFor(anyType, info)` from brock-core resolves the value.
- 025bcf7: The app names its profiles route, and a bucket can open without a profile. `product.profilesRoute` (for example `'data/profiles'`, a hub page) makes every way to the profiles screen land there: the Profiles menu entry, the `profiles` boot task (no profile, an unknown pinned profile, several profiles and no last one), deleting the active profile through `useProfiles` and `open('profiles')`. Brock's own `profiles` screen is then not registered, and `ProfilesScreen` closes the hub after a pick on that route. Unset, nothing changes. `requiresProfile: false` on a bucket in `screens.config.ts` (or a `defineHub` def) lets its hub open while no profile is active, so a first run can reach that page to create a profile.
- b1026b9: Asset jobs run in a renderer Web Worker too, with no main process. `runAssetWebWorkerJob(options)` from `@drizztdourden08/brock-port-kit/renderer` takes the options of `runAssetWorkerJob` with the worker constructor of a `?worker` import, and the Web Worker serves the steps with `serveAssetSteps` from the new `@drizztdourden08/brock-port-kit/web-worker` entry. One `AssetWorkerSteps` object serves both sides: each step now gets the job's `workerData` as a third argument (the thread's `workerData` in Node, posted once to a Web Worker). The job is a renderer job: `jobs.start(id, steps, options?)` from brock-react returns the same `JobHandle` as `ctx.job`, its snapshots go into the job store, so the job dialog and the title bar show it on every host, and `jobs.cancel` and `jobs.dismiss` reach it. The job registry moved to brock-core (`createJobRegistry` and the `JobHandle`, `StartJob`, `JobRegistry` types from `@drizztdourden08/brock-core/jobs`); brock-electron re-exports the types as before.
- c68c54a: App state in show rules. `<BrockApp showFlags={{ signedIn }}>` passes the app's own flags to every `hosts` and `when` rule as `ctx.flags`, so a page, a bucket, a card or a menu entry can show only while, say, the user is signed in: `when: ({ flags }) => flags.signedIn === true`. `useShowFlags({ ... })` adds flags from any component while it is mounted, which is how a module contributes them from its `Provider`; the app's prop is applied last. When a flag changes, the menu, the hub nav, the search palette, the bucket switch, the rail, the shortcuts and the open screen evaluate again. `ShowFlags` in `@drizztdourden08/brock-core/augment` types the flags. `ShowContext` now has `flags`, so code that builds a `ShowContext` by hand for `isShown` adds `flags: {}`.

## 0.45.1

## 0.45.0

### Minor Changes

- ef96908: `filePicker.pickFile({ extensions, anyType: true })` opens the picker with no type filter, for a file whose extension the system has no type for (Android's picker greys such a file out); the app then checks the name it gets. Without `anyType` every host filters by `extensions` as before.
- a85efb2: `product.window.titleBar.mobile: false` leaves the title bar out on a mobile form factor, for an app that draws its own phone chrome; it stays on the desktop, and the default keeps it everywhere.
- aba2001: Packaging takes more from the product. The Windows exe gets its version info stamped beside the icon: company from `product.author`, product name and file description from `product.name`, `LegalCopyright` from the new `product.copyright` (else the year and the author), comments from `product.description`, and the app version. `product.linuxCategory` (a main freedesktop category such as `Game`) sets the deb's and the AppImage desktop entry's category, and the AppImage entry gets the description as its comment. A file association takes a `description`: the Linux mime comment, the Windows ProgId tooltip and electron-builder's association description.
- fb41dd1: Workflow steps can target one job: a step's `jobs` (one id or a list) keeps it to those jobs of its point, `quality`, `review`, `web`, `changes` or `workspace` in CI and `prepare` or `build-<platform>` in the release. The new `release.prepare` point runs in the `prepare` job after the install, before its release note check and lint.

## 0.44.0

### Minor Changes

- 716553d: The boot watchdog is configurable: `product.boot.devWatchdogMs` (default 120000) and `product.boot.watchdogMs` (default 8000) in `brock.config.ts`, and the `BROCK_BOOT_WATCHDOG_MS` environment variable, which overrides whichever applies.

## 0.43.0

## 0.42.0

## 0.41.0

### Minor Changes

- 8300ee8: Brock moves to Tessera ^0.33.0 (the catalog and the `brock-react` peer range, MIGRATION 224; RENAMES.json has no entry for 0.33.0, so an app changes nothing) and uses what it added for Brock. A settings choice's `disabled` (`true`, or a string that says why) now goes to Tessera's own `disabled` on the option, so a choice, select, radio or multi-choice with an option off draws its usual control with that option greyed, not pickable and skipped by the keys, and the reason as a pointer tooltip and an `aria-description`. Brock's `SettingChoiceField` stand-in is gone, and a radio with an option off stays a radio instead of turning into a select. On a host with the title bar and no window chrome, such as the Capacitor host, the title bar gets `controls={false}` and draws no window control at all, close included. A widget popped into its own window now shows the disabled state a docked one shows: the `widgetDisabled` hook's answer, through the dock's resolver, goes to Tessera's `Widget` as `disabled` (the message as the reason) with `onOpenSettings`, which asks main to bring the app window forward and open the setting there (`widget:openSetting`, `openWidgetSetting`; `widget:settingTarget`, `onWidgetSettingTarget`).

## 0.40.0

### Minor Changes

- A bug report transport can keep the dialog open after a report went out. `afterSend: 'view'` beside `contact` and `attachments` (in `BrockApp`'s `bugReport` or in `bootstrapApp`'s) shows the receipt in the dialog in place of the form: the message, the report id, Open when the receipt has a `url`, and Close. The default, `'toast'`, closes the dialog and raises the toast as before; the GitHub issue and the clipboard always toast.
- 9b081a6: A Capacitor host. On Android or iOS brock-react fell back to the web factory: no file store, `formFactor: 'desktop'`, no title bar, and `ports.capacitor` of a module was never read. It now builds a `capacitor` platform over the app's Capacitor plugins (Filesystem, App, Haptics, KeepAwake, by name): the app's files persist in the app data folder, the device port drives the back button, pause and haptics, `formFactor` is `mobile`, and module ports for `capacitor` are merged in. A new capability, `titleBar`, draws the title bar with its menu on a phone, while `windowChrome` keeps the window buttons to Electron; it is optional on `Capabilities` and reads as true when a custom platform factory leaves it out, so existing factories keep their bar. ui-views persist through the Capacitor file store, so they survive a restart on the phone.
- ae74556: Three main-side hooks for app data and sound. `bootstrapApp({ fileGuard })` is asked before each write of the base `file:*` handlers (`writeBytes`, `writeText`, `remove`, `mkdir`, `trash`) with `{ kind, path }`, and refuses the write when it answers `false` or a reason. `FileStore.trash(path)` now reaches the renderer too (`file:trash`, the Electron `files` port). `createNodeFileStore({ trashItem })` takes the function that moves a full path to the trash, so the store imports no Electron; `ctx.files` passes Electron's `shell.trashItem`, and a store made without `trashItem` has no `trash`. `window:setAudioMuted` and `window:isAudioMuted` mute the app window and read it back, also as the window port's optional `setAudioMuted` and `isAudioMuted`.
- fb285af: `--screenshot` waits until the app is ready to be pictured, and pictures the current frame. The renderer takes a hold with `holdScreenshot()` (or `useScreenshotHold(holding)`) while something it draws is not ready, such as a game view before its first frame; main waits for the reveal and then for every hold to be released, within the same 20 s watchdog. The capture now comes from the window's surface through the debugger (`Page.captureScreenshot`), since `capturePage` returned a stale frame for the headless window placed off every monitor; it falls back to `capturePage` when the debugger is taken.
- ae74556: `ui-views.json` is written by key. Brock read the file once and wrote its whole copy back on every change, so a key the app wrote to the same file in the meantime was lost. The renderer now sends only the keys it changed over the new `uiViews:patch` channel (`patchUiViews`), and main merges them into the file on disk, one write after another. An app keeps view state of its own there with `uiViews.read(key, fallback)`, `uiViews.write(key, value)` and `uiViews.remove(key)` from brock-react; the `profile:` keys stay Brock's.

## 0.39.0

### Minor Changes

- 472754d: An app adds its own steps to the managed CI and release workflows in `brock.config.ts`, `workflows.steps`, so `brock sync`, `brock build` and `platform add` keep them. Steps go in at fixed points: `ci.beforeInstall`, `ci.beforeBuild`, `ci.afterBuild` and `ci.beforeTest`, and `release.beforeInstall`, `release.beforePackage` and `release.afterPackage` (a file copied into `upload/` there ships with the release). A step takes `run` or `uses` (with `with`), `env`, `if`, `shell`, the repository `secrets` it reads (each set as an environment variable of the step), and `os` and `platforms` to keep it to some runners or platform jobs. Modules (`brock.workflows` in their manifest) and the repo command's plugins (`definePlugin({ workflows })`) add steps the same way, before the app's. `workflows: { ci: 'own' }` or `{ release: 'own' }` leaves that file to the app: `brock sync` stops writing it and `brock check` stops comparing it.
- 6d7da6d: The bug report takes a contact email and attachments. A renderer or main transport opts in with `contact: true` and `attachments: true | { maxFiles?, maxBytes? }`; the dialog then shows a Contact email field and a drop zone for files, capped at 5 files and 10 MB in all by default. The payload carries `contact` and `attachments` (`{ name, type, size, data }`), never into a public GitHub issue, and `writeDebugZip` stores each attachment under `attachments/` with only its name, type and size in `report.json`.
- 6d7da6d: Renderer extras reach the bug report transport. `useBugReportExtras(source)` or `bugReport.setExtras(source)` registers a function that returns a JSON-safe object; the dialog calls it when it opens and the payload carries the answer as `extras`, so a main transport (`bootstrapApp({ bugReport })`) gets what only the renderer knows, such as the open screen. A source that throws leaves `extras` out and the report still goes.
- bdfc457: `FileStore` has an optional `trash(path)`. The Node store behind `ctx.files` moves the path to the system trash (`shell.trashItem`) and skips one that is not there. A catalog uninstall or update hands its installer a store whose `remove` goes to the trash when the store has one, falling back to deleting when the trash refuses; `removeTo: 'delete'` in the catalog config deletes as before.

## 0.38.0

## 0.37.0

## 0.36.0

### Minor Changes

- 273846f: The input and display modules run on Android. Each ships a Capacitor plugin in its package: `BrockInput` drives SDL3 inside the app through a JNI library built against the same pinned SDL3 source as the desktop addon, and takes controller keys before the WebView without any change to `MainActivity`; `BrockDisplay` reads the display's rates and asks Android for a synced one through the window's preferred refresh rate. `inputApi()`, `displayApi()` and `window.api.input` and `window.api.display` return the same API on Android as on the desktop, so app code does not branch; raw and joystick capture, the bundled mapping database and window modes stay desktop only (the module READMEs list each limit). `platform add android` and `mobile build` wire the modules in `modules` into the Gradle project, a built-in module left out of `modules` stays out through `android.includePlugins`, and `doctor android` asks for the NDK and CMake the input module builds with. brock-core adds `nativePlugin` and `listenNative`, brock-react adds `exposeHostNamespace`.
- aa74a6d: The bug report hands its payload to an app transport. Brock keeps the dialog and builds `BugReportPayload` (title, description, app id, name and version, and when attached the debug text, the host facts and the last 200 redacted log lines). An app passes `transport(payload) => Promise<Result<BugReportReceipt>>` as `<BrockApp bugReport={{ transport, label? }} />`, or in main as `bootstrapApp(product, { bugReport: { transport(payload, ctx), label? } })` over the new `bugReport:transport` and `bugReport:send` channels; with neither, the GitHub issue on `product.repo` stays the default and the clipboard the last resort. The send button carries the transport's label and spins while it runs; a receipt's message and link show in the toast, and a failure keeps the dialog open with the error so the user can try again. `writeDebugZip` and `collectDebugFiles` in brock-electron give a main transport the debug zip: the payload, the logs of `Data/debug` and the app's own entries. `useDebugText` also returns `system`.
- 6f6977d: OS integration in the product config. `product.protocols` declares deep link schemes (`my-app://install/abc`), `product.fileAssociations` gains a default mime type and a shipped Windows icon, and a `product.schemes` entry with `dir` is served from `Data/<dir>` through `protocol.handle` (`app-media://` over `Data/media`). `defineProduct` checks all three lists.

  The installer registers them: on Windows the updater's Velopack hooks write and remove the `HKCU\Software\Classes` keys, and the installer stub runs `--os-integration=register` after a portable install; on macOS electron-builder writes Info.plist; on Linux the deb's `.desktop` file and mime XML come from electron-builder, the managed post-install refreshes both databases, and an AppImage writes its own entry under `~/.local/share`.

  The running app receives each link or file from argv at launch, from a second launch through the single-instance lock (taken when the product declares a protocol or a file type, never for a named instance or an automation launch; `bootstrapApp({ singleInstance })` overrides it) and from macOS `open-url` and `open-file`. After the reveal, main hands each `OpenRequest` to `ctx.onOpen` and `bootstrapApp({ onOpen })`, and the renderer gets it through `useAppOpen` or `appOpen.on` (`app:takeOpens`, then `app:open`).

- b42b735: A Brock workspace with several apps gets workflows per app. Each app gets `ci-<app>.yml` and `release-<app>.yml` at the repo root, and the first app also writes `ci.yml` with one `workspace` job for the repo-wide checks. A pull request builds and reviews an app only when it touches it: the new `brock affected <app folder> [base ref]` prints true for the app's own files, a workspace package it depends on, or a file outside every package. Releases tag with the new `product.releaseTagPrefix` (`'desktop-v'`, required once a repo has several apps, `v` otherwise) and read the notes from the app's own `release-notes/`; `brock release --app <name>` dispatches the app's workflow. The updater keeps to the releases whose tag starts with the prefix, so the other apps and any other tags of the repo stay out of its list. A workspace with one app keeps `ci.yml`, `release.yml` and plain `v<version>` tags.
- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

### Patch Changes

- e40fe59: Examples name no app of their own. `defineProduct`'s message for a file extension written with a dot gives `mypack` as its example, the package READMEs use neutral names (`my-app`, `api-token`, an `account` sign-in, `codegen:check` as a gate script), and the move steps in docs/upgrading-an-app.md are a general checklist.

## 0.35.0

## 0.34.0

### Minor Changes

- 08e0cd1: Show any folder or file of the machine, not only a data domain. `openFolder(path)` opens a folder in the file manager (a file is refused, since opening one would run it), and `revealPath(path)` shows a file or folder selected in its parent folder. Both resolve a `Result` and refuse a relative or missing path. Main code imports them from `@drizztdourden08/brock-electron/main`; the renderer calls `usePlatform().filePicker.openFolder` and `revealPath` (Electron only), over the new `shell:openFolder` and `shell:revealPath` channels. A settings `path` control now gives Tessera's `PathInput` a Reveal action on Electron.

## 0.33.0

## 0.32.1

## 0.32.0

### Minor Changes

- 92b662f: Widgets keep the keyboard with the app. A mouse click on a widget's button, tab or slider used to give it the focus, so afterwards the arrows, Enter and Space drove that control instead of the app. `WidgetHost` now runs a focus guard over the docked and floating widgets and the widget options panel in the main window: a press on a control there keeps the focus where it was and the click still fires, focus a press moves into a widget is dropped, a slider or select holds the focus only for the press and loses it on release or change, and text fields keep it. Only a pointer press inside the widgets triggers it, so Tab, the tour and the search palette still move the focus into a widget, the focus ring shows as usual, and app menus keep their keyboard navigation. A popped widget window is the widget's own app, so the guard does not run there. It is on by default; `product.widgets.keepFocusWithApp: false` in `brock.config.ts` (or `keepFocusWithApp={false}` on `WidgetHost`) turns it off. The review adds `widget-click-keeps-focus`: two real clicks on the docked logs widget's options button must leave `document.activeElement` outside the widget.

## 0.31.0

## 0.30.0

### Minor Changes

- f0d71bd: Guided tours belong to the app now, not to a profile. The app marks its first use once, in `app.json` (`firstRun`: `pending`, then `done`), and a `trigger: 'first-run'` tour starts once on that first use, after the boot and the splash, whichever profile is active; making another profile later never starts it again. Tour progress (finished tours and the step to resume at) is kept app-wide in `app.json` as `tours`, so a tour finished in one profile is finished in all of them.

  An install that already has profiles or saved views is never on its first use: on the first launch after the upgrade the marker is set to `done`, so a first-run tour an app adds in a later version does not start by itself there; it is under Take the tour and in search. That launch also moves every profile's tour progress from `ui-views.json` (`profile:<id>.tours`) into the app-wide record, keeping any tour any profile started or finished, and removes the profile keys. Nothing in the app's source changes.

  brock-core adds `updateAppState(files, change)`, which applies changes to `app.json` one after another so the profile switch and the tour progress never overwrite each other; the profile store's `setLast` and `remove` use it. `AppState` gains the optional `firstRun` and `tours`. brock-react exports `updateAppState(change)` from its profiles API, bound to the platform `FileStore`.

## 0.29.1

## 0.29.0

## 0.28.1

### Patch Changes

- 8c8d415: A tour click step whose click target is in a widget popped into its own window goes on when the user clicks it there. Before, the click never reached the main window's tour and the step fell back to Next. The step keeps Next hidden and its hint line; the main window relays the click target to the widget window (the `tour-click` slice), which sends the click back over IPC (`advanceWidgetTour`, `onWidgetTourAdvance`), and the tour moves on only if that step is still shown. The listener goes when the step changes, the tour closes or the widget docks back. The review clicks the popped widget in its own window (`reviewWidgetProbe({ kind: 'click', id, selector })`, a real mouse click) and checks the tour moves on.

## 0.28.0

### Patch Changes

- c426f9a: A tour step whose lit part is a widget popped into its own window lights it there: the main window relays the step's spot to the widget window, which draws Tessera's `TourSpot` over the widget, while the bubble stays in the main window. Before, the bubble sat in the middle and nothing was lit. The review lights a popped widget from a tour step and checks the widget window draws the spot and drops it when the tour closes (`reviewWidgetProbe({ kind: 'tourSpot', id })`).

## 0.27.0

## 0.26.0

## 0.25.0

## 0.24.1

## 0.24.0

## 0.23.0

### Patch Changes

- e769096: The splash sits on Tessera's dark gradient, with text that holds WCAG AA. The splash page and the boot failure splash drop Brock's white radial highlight, the light drop shadow on the mark and the bright look under the text, so Tessera paints the palette's `--c-gradient-dark-from` to `--c-gradient-dark-to` under its tested text colours. Only an app with colours of its own (`product.look`, or palette seeds in its theme without its own `--p-gradient-dark-from` and `--p-gradient-dark-to`) gets `--look-dark-from` and `--look-dark-to`, from brock-core's new `darkPair`, which darkens its look toward black until the palette's `--c-text-dim` reads at 4.5:1 at both ends. `brock icons` writes `public/logos/mark.svg` from Tessera's `brand/dark-ground/<brand>.svg`, so both splashes show the mark in its dark ground colours. The installer and its Setup splash keep the bright look.

## 0.22.0

### Patch Changes

- 73a287e: Importing a data area asks Merge (the default) or Replace in its confirm dialog (`confirmChoice`, a confirm dialog with a radio group). Merge keeps what is there and keeps the newer file when both have the same path; `storage:applyImport` takes the mode, the result counts the kept files (`kept`), and imported files keep the modified time they were exported with.

## 0.21.1

## 0.21.0

## 0.20.0

## 0.19.0

### Minor Changes

- df9c1df: Brock moves to Tessera 0.17.0: the workspace catalog and brock-react's peer range are `^0.17.0`. Small text is 12 px, and Field labels and DataTable headers are no longer forced to capitals (Archipelia review T-03). Two new settings control kinds: `path` (`pick`, `accept`, `placeholder`) draws Tessera's `PathField` on a string setting, with typing, a drop from the desktop and Browse, and `json` (`shape`) draws `JsonInput`, which saves the value only while the text parses. They come with new optional platform ports, `filePicker.pickPath`, `filePicker.pathOf` and `storage.revealLogs`, which the Electron host fills through the new `dialog:pickPath` and `debug:revealLogs` channels and the preload's `getFilePath`. `brock upgrade` writes `StatusOf` as `Status` from Tessera's `RENAMES.json`, and the `tessera-part-moves` migration moves `CopyButton`, `CopyValue` and their types from `/primitives` to `/composites`, and `ErrorBoundary` from `/composites` to `/primitives`.

## 0.18.0

## 0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: Main has a place for app services: `bootstrapApp(product, { services: (ctx) => createAppServices(ctx) })` builds them once, at the start of the modules boot task (after the paths, before the handlers), exposes them as `ctx.services`, typed through the new `AppServices` augmentation, and calls their `dispose()` on will-quit. Reading `ctx.services` before the build, or without the option, throws and says which. The `app-services` migration turns a WeakMap memo keyed by `MainContext` into a to-do.
- 3a35c8e: An IPC channel is declared once: `defineChannels({ engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'), onProgress: event<(p: number) => void>()('ap:engine:progress') })` from brock-core gives the preload maps (`maps.invoke`, `maps.send`, `maps.events`), the augmentation types (`InvokeContractOf`, `SendContractOf`, `EventContractOf`) and typed entries: main's `handle`, `on` and `emit` take an entry in place of the channel name, and brock-react's `channelApi(APP_CHANNELS)` types the renderer calls by method name. Channels written in the augmentation, a map and a handler keep working. The new app declares its channels this way, knip treats `src/ipc/contract.type.ts` as an entry, and the `channel-declarations` migration lists, as one to-do, every channel an app could move. docs/ipc.md shows both styles.
- e70afc3: Long jobs: `ctx.job(id, steps)` in main reports steps, weighted progress, the current line and log lines to the renderer and stops on cancel through its `signal`. `JobDialog` draws a job with Tessera's Stepper, ProgressBar and LogPanel, `useJob(id)` and `jobs.open(id)` drive it, and Hide moves a running job to a status tag in the title bar that reopens it.
- e70afc3: File storage per data domain: `ctx.storage.domain(id)` in main and `dataDomain(id)` in the renderer read and write JSON, text and bytes, list, remove and size files, with every path kept inside the domain folder. A built-in `StoragePage`, added to a bucket as a page file, shows each domain's size with Open folder, Clear and "older than N days" clean rules (both confirmed), and exports chosen domains to a zip or a folder and imports them back. New template apps declare two domains and carry the page.

## 0.16.0

### Minor Changes

- 7ef6122: `hostApi<M>()` and `requireHostApi<M>()` take the app's own maps as a type argument (`{ invoke?, send?, events? }`, for example `typeof APP_INVOKE_MAP`) and add their methods to the base ones, so an app reaches its channels without a cast. Without one they return the base `IpcApi` as before. brock-core exports `AppIpcMaps` and `AppIpcApi`.
- 55befe4: The review watchdog starts in main at launch. When no tour progress (a capture or a check) arrives within 60 s, for example because the renderer failed to load, main writes a partial report with a failed `tour-started` check and exits 1, instead of waiting for minutes. Main also exits 5 s after the report when something holds the quit. brock-core exports `GLOBAL_STEP` from its review entry.

## 0.15.0

### Minor Changes

- 96f7759: The Performance widget is drawn with Tessera's chart parts.

  - A row of `StatTile`s for frame rate, CPU, memory and event loop lag, each with its change since the last sample and a `Sparkline` of the last 60 samples; `Gauge`s for the app's CPU, its share of system memory and the JS heap, sized to fit; a `StackedBar` of memory by process (main, renderer, GPU, utility, widget windows); an Activity list of long tasks, errors and warnings; and every reading in a collapsed Details section.
  - A container query puts two tiles a row when docked and four a row, with the gauges beside memory and activity, from 560 px. The widget no longer wraps itself in a `ScrollArea`; the widget body scrolls.
  - The refresh and sections options, Copy snapshot and sampling only while shown stay as they were.
  - `ProcessDiagnostics` adds `memoryTotalBytes`, and each `ProcessMetric` adds `window`, the Brock window a renderer process draws (`main` or a widget id).
  - The review checks that the tiles, sparklines, gauges and memory bar render and move, that the panel adds no scroll box of its own, and captures the widget docked and popped out narrow and wide.

- 96f7759: Brock takes Tessera 0.15.0 (peer range `^0.15.0`).

  - Floating widgets resize from every edge and corner; `WidgetHost` passes `floatingMin` of 240 by 160, the least size of a widget window, so a floating widget and a popped one stop at the same size.
  - The window guide sits beside the cursor in the window being moved or resized: main reads `screen.getCursorScreenPoint()` on every `will-move` and `will-resize`, turns it into that window's client pixels and sends it as `pointer` with the `widget:guide` state (`WindowGuideState.pointer`), and `WindowGuide` passes it to `WindowGuideOverlay`.
  - `BrockApp.css` imports the brand palettes without `layer(ds.palette)`, since Tessera now puts them in that layer itself; an app's unlayered `theme.css` still wins.
  - The search mascot clips are typed `MascotClip`. The widget options panel closes on its own and the widget body scrolls with a gutter, with no Brock code; Brock passes no window group prop.
  - The review drags a floating widget's corner with real mouse events (`review:widgetProbe` takes `mouse`), checks the new size and the 240 by 160 floor, and checks the guide card beside the pointer the probe passes (`guide` takes `pointer`; the facts add `guideBeside`).

## 0.14.0

## 0.13.0

### Minor Changes

- 33dc33c: Snap clusters replace manual window groups.

  - Every window joined by snap links, directly or through other windows, the main window included, is one cluster, computed from the live links. Dragging any window of a cluster moves the whole cluster rigidly; only the dragged window snaps, to windows outside the cluster, and what it is dropped against joins the cluster. Holding Ctrl while moving drags one window alone: it leaves the cluster, its links break (a window linked to it relinks to another window it is still flush with) and it can snap elsewhere. A window with no link moves alone as before.
  - Maximize, full screen with the black backdrop, minimize and restore act on the cluster, with the same fit and pack maths and the same restore. Closing a widget closes that widget alone. Resizing keeps the session rules and never moves a cluster.
  - Manual groups are gone: the `group` field of the popped layout, `WidgetWindowState` and the probe facts, `WidgetWindowGroup`, `widget:setGroup`, `widget:setMainGroup`, `widget:getMainGroup` and `widget:mainGroup`, the "Window group" wiring of `WidgetOptions` and `WindowTitleBar` (Brock no longer passes those props), and `config/window-group.json`, which main deletes at start. A `group` left in a saved popped entry is dropped when the layout loads, and the `drop-window-groups` upgrade step cleans the dev data under `.user-data`. `WidgetWindowSummary.group` becomes `cluster`, the number of windows in the cluster, and the probe's `group` request becomes `cluster`.
  - The window guide shows in the window being moved or resized, a widget window or the main window, instead of always in main: `widget:guide` goes to that window only. Its hints follow the new rules: snapped windows move together, Ctrl moves one window alone, flush windows resize together, Ctrl resizes one window alone without snapping.
  - A resize now moves every window on the dragged line: two widgets stacked against main's left edge both follow main's edge, and either widget's right edge moves main's edge and the other widget's; a window stacked end to end on the far side of the line follows too.
  - The review checks a cluster moving together and with main, a Ctrl move detaching, cluster maximize, restore and full screen, the guide drawn in the moved window and in main, and the stacked seam.

## 0.12.0

### Minor Changes

- f751683: Brock moves to Tessera 0.12.0 (brock-react's peer is `^0.12.0`). A widget window now draws Tessera's own pin menu in its title bar and Tessera's Pin row in its options panel, in place of Brock's `WidgetPinMenu` and the Stacking row; the pin stays off or on top, sync stays a separate option, and a saved `with-app` pin still opens as off with sync on. The `widget:popped` event carries the new `PoppedWidgetPatch`, whose pin is never `with-app`. The review reads the page header through the `content-header` classes.

## 0.11.0

### Minor Changes

- 48ca303: A built-in Performance widget every app gets, closed by default and listed in the Widgets menu: the renderer (frame rate and frame time, long tasks, event loop lag, JS heap, DOM nodes), every process from main (CPU and memory per process, main process memory, uptime, windows and widget windows with their sync and group, IPC calls per second, runtime versions, GPU compositing) and the app state (version, screen and route, profile, open widgets, modules, errors and warnings since start). Its options set the refresh and the sections shown, sampling stops while it is off screen, and Copy snapshot puts the numbers on the clipboard for a bug report. The new `diagnostics:getProcesses` channel (`getProcessDiagnostics`) feeds it, and the review opens it and checks the numbers move.

## 0.10.0

## 0.9.0

### Minor Changes

- 28540bb: Widget windows: a direct pin choice, and resizing snapped windows moves only the dragged edge.

  - The pin is now `off` or `top`. The old `with-app` pin did what "Sync with main window" does, so the two are merged: a synced window also mirrors the app's always-on-top. `WidgetPinMode` drops `with-app`; the new `StoredPinMode` keeps it for saved popped entries, and a saved `with-app` pin opens as `off` with `sync` on and is written back to the layout.
  - The widget window bar shows Brock's `WidgetPinMenu` in place of Tessera's cycling pin button: a pin-off icon for a normal window, a highlighted pin and an "On top" label while pinned, and a menu listing both states with a hint and a check on the current one. The options panel has a "Stacking" row with the same two choices.
  - Resizing a widget window moves only the dragged edge, with edge snapping. The windows exactly flush against that edge have their facing edge moved with it, and nothing else changes size. Before, a neighbour whose own edge only lined up with the dragged one (the tops of two windows side by side) was stretched with it. Ctrl still resizes the window alone.
  - The main window's aspect lock applies to the main window alone. It used to be hooked onto every window created, widget windows included. The widget resize pipeline (`planResize`) now keeps the main window in proportion and never lets a widget's shared edge bend it.
  - The review's widget-windows step checks both pin states and captures the bar while pinned. It also resizes a snapped window from its outer edge and from the shared edge, and asserts the neighbour keeps its size apart from that edge.

## 0.8.1

## 0.8.0

### Minor Changes

- dcdde4a: Widget windows sync with the main window, snap into a grid and act in groups. A popped window is now synced by default: on Windows the app window owns it, so it no longer falls behind other apps when the focus goes elsewhere, and it shows, hides, minimizes, restores and raises with the app. A per-widget "Sync with main window" switch makes it independent with its own taskbar entry. Moving snaps corners and edges, resizing snaps the moving edge to the neighbours' edges, and an edge shared by snapped windows resizes them all together; Ctrl skips snapping and resizes one window. The app and each widget can join a window group (1 to 4) whose members maximize, go full screen over a black backdrop with square corners, minimize, restore and close together. The app window shows a guide with the shortcuts while a widget window moves or resizes. Brock draws interim controls (`WindowGroupControls`, a "Window group" title bar action, `WindowGuideOverlay`) until Tessera ships its own. The `widget:*` contract gains `setSync`, `setGroup`, `setMainGroup`, `getMainGroup`, `mainGroup`, `guide` and `square`, and the window state carries `sync`, `group` and `square`.

## 0.7.1

## 0.7.0

### Minor Changes

- f6cfba5: Brock takes Tessera 0.8.0 and its rimmed logos. `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's `brand/<rim>-rim/<brand>/` set, and it defaults to `'light'` for the `brock` brand, so the mark reads on dark surfaces. `brock icons`, the splash mark, the bot variant, the installer and Setup splash mark read from that tree. `brock icons` also copies `icon-32.png` and `icon-24.png` to `public/logos/`, and with a brand `product.logos.app` defaults to `./logos/icon-32.png`, so the title bar no longer scales a 256 px icon down to 20 px and loses the rim. A copied file is skipped only when it holds the same bytes, so a rim switch recopies the set. The About panel draws a rimmed brand as its bare mark. Migration `gitignore-title-bar-logos` ignores the two new logo files.

## 0.6.1

## 0.6.0

## 0.5.0

### Minor Changes

- ff027d0: The widget IPC contract grows for widget windows that work end to end: `WidgetWindowOpen` carries a `seq`, `at` (the drag-out screen point), `atCursor` and `taskbar`, `widget:closed` carries the window's `seq`, `widget:patchSettings` and `widget:settingsPatch` relay a settings change from a widget window to the app, and the review gets `review:widgetProbe` (`WidgetProbeRequest`, `WidgetProbeResult`) and `review:captureWidget`.

## 0.4.0

## 0.3.0

## 0.2.0

### Patch Changes

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.

## 0.1.2

### Patch Changes

- 25be8fe: `ProductConfig` drops its `modules` field. Nothing read it: the module list is the top-level `modules` of `brock.config.ts`, which `brock add` writes and `brock sync` reads.
- f60b232: `product.widgets.mainLabel` in `brock.config.ts` names the main view in the widget dock (default `Main`). The saved layout key stays `main`.

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- c48024b: The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
- e406f70: `brock package` builds the small Windows installer, a downloader that reads `install.json` from the latest release and installs the payload it names, and writes that manifest with the entries carried forward from the previous release. A routine release is the update package only; `--full` adds the payload and the directory zip. The product config takes an optional `accent`, used for the installer progress bar and the downloader.
- fd0a736: The Windows installer is a template built from config. The downloader takes its colours from Tessera's dark theme (or its built-in colours until `tokens.json` exists), the gradient from the look and the mark from `public/logos/mark.svg`. Velopack's Setup splash is drawn from the same look, mark and name. `product.installer` sets the scope, the shortcuts, launch after install, an optional licence and the folder name, with rotp's behaviour as the default. `build/installer/header.png` and `build/installer/splash.png` replace the rendered images, and `brock package --render-installer` writes the screens to `release/installer-preview/`.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 2cc7040: The splash picks light or dark text by contrast against its gradient, from Tessera's theme text and background colours when they are available.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.

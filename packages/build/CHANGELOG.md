# @drizztdourden08/brock-build

## 0.36.0

### Minor Changes

- 273846f: The input and display modules run on Android. Each ships a Capacitor plugin in its package: `BrockInput` drives SDL3 inside the app through a JNI library built against the same pinned SDL3 source as the desktop addon, and takes controller keys before the WebView without any change to `MainActivity`; `BrockDisplay` reads the display's rates and asks Android for a synced one through the window's preferred refresh rate. `inputApi()`, `displayApi()` and `window.api.input` and `window.api.display` return the same API on Android as on the desktop, so app code does not branch; raw and joystick capture, the bundled mapping database and window modes stay desktop only (the module READMEs list each limit). `platform add android` and `mobile build` wire the modules in `modules` into the Gradle project, a built-in module left out of `modules` stays out through `android.includePlugins`, and `doctor android` asks for the NDK and CMake the input module builds with. brock-core adds `nativePlugin` and `listenNative`, brock-react adds `exposeHostNamespace`.
- 5a819b6: An app adds its own checks to the gate with `gate.scripts` in `brock.config.ts`: `package.json` scripts, taken from the app's `package.json` when it has the script, else from the workspace root's, and a script neither declares fails. `brock gate` runs them in order (after the C format check of `gate.clangFormat`), runs every step even after a failure, and exits 1 naming the ones that failed; an app that declares none passes. The managed CI `quality` job of each app (standalone or in a workspace) runs `brock gate` after the release note check, and `<repo> upgrade` runs it in each app after the gate scripts.
- e40fe59: An app ships only its own brand's palette. `BrockApp` no longer imports every Tessera brand palette; `brock sync` writes `.brock/palette.css`, which imports the palette of `product.icons.brand` (nothing when Tessera has no palette for the brand), and the app's `src/main.tsx` imports it right after Tessera's `tokens.css`. The `brand-palette-import` migration (0.36.0) adds that import to an existing app's `src/main.tsx` once, and leaves a to-do when the renderer entry is elsewhere. New apps from `create-brock` have the import, and its first sync writes the template brand's palette.
- 5289e5d: New module `@drizztdourden08/brock-catalog` (`brock add catalog`): a content catalogue client. The app configures it once with `configureCatalog(ctx, config)`: its endpoint and headers, its schema validators, its routes, an installer per container, a size cap, an install link scheme and release hooks. The renderer reads the home, the whole list and one item over `window.api.catalog`; installs run as Brock jobs (`catalog-install:<id>`: grant, download, verify, unpack) that stream the download to a temp file, check its size and sha256 against the grant before anything is unpacked, and can be cancelled while they download; an update installs the new copy before it releases and removes the old one. The installed record lives in `Data/catalog/installed.json`, and `useCatalogInstalled`, `installedRecordOf` and `installedByName` give every screen the installed guard. Install links (`<scheme>://install/<id>?v=<n>`) are parsed strictly, held until the renderer takes them with `useCatalogLinks`, and taken from `ctx.onOpen` for the scheme the product declares in `product.protocols`. `CatalogInstallBar` draws install, update, uninstall and the live progress with Tessera parts; the app tree gains its answer under actions.
- 5a819b6: `gate.clangFormat` in `brock.config.ts` names folders or files of C sources, relative to the repo root. While it names any, `brock sync` writes a managed `.clang-format` at that root, in the house C style (two-space indent, attached braces, short ifs, loops, cases and functions on one line, `int *p`, binary operators leading a broken line, trailing comments and includes left as they are, no column limit), and `brock gate` checks every `.c` and `.h` file under them with `clang-format --dry-run --Werror`, listing the files that differ. `brock clang-format` rewrites them. The clang-format is pinned: the app or the repo adds `clang-format-node` at an exact version (`pnpm add -D -E clang-format-node`), which ships LLVM's binaries for Windows, macOS and Linux, so CI and every machine format alike, and `brock knip` counts it as used; `BROCK_CLANG_FORMAT` names another binary. Without either the C check fails and names the package.
- 5a819b6: Dev-only screens and handler groups: a file with `.dev` before its extension (`src/screens/tools/inspector.page.dev.tsx`, `src/screens/editor.card.dev.tsx`, `electron/handlers/dataset-handlers.dev.ts`) is the screen or handler group of its kind in a development build and absent from a production one. `brock sync` lists them in `.brock/screens.dev.ts` and `.brock/handlers.main.dev.ts`, which `.brock/screens.ts`, `.brock/search.ts` and `.brock/handlers.main.ts` spread, and writes those files only while a dev-only file exists. In a production build (`brock build`, the web build) the Vite configs load each `.brock/*.dev.ts` as empty lists, so neither the code nor the search entries ship, and the build stops when another file imports a `.dev` file. `brock structure` reports a hero, base or page meta file marked `.dev`, a bucket whose every screen is dev-only and a shipped tab or sub-page whose page is dev-only. An app without dev-only files gets the same generated files as before.
- 0b2da5f: An app that was never on Brock starts at the version it adopts. `brock adopt` pins `package.json#brock.version` to its own version when the repo has none (an existing pin stays) and prints it. `brock migrate` now refuses an app with no `brock.version`, in its own `package.json` or its workspace root's, with or without `--from`, and points to `brock adopt`, so the migrations from 0.1.1 on never run over code Brock did not write. `--tessera-from` alone still runs. The first-adoption path is in docs/upgrading-an-app.md.
- b8f4eed: `<app> linux push` builds the Linux AppImage in a VirtualBox VM, or in WSL and copies it in, installs its desktop entry, pins it to the dock and launches it on the VM's desktop. `<app> linux doctor` checks the ssh client, VirtualBox, the VM and its state, key-only SSH access, the Guest Additions and the build tools, and `<app> linux init` writes this machine's `~/.brock/linux/<repo>.json` and prints the one-time VM steps. The machine file never holds a password: a password-like key stops the command and every ssh call runs with `BatchMode=yes`. `linux` in `brock.workspace.mjs` sets the app, the build command, the artifact folder, extra shared folders and the launch flags.
- 6f6977d: OS integration in the product config. `product.protocols` declares deep link schemes (`my-app://install/abc`), `product.fileAssociations` gains a default mime type and a shipped Windows icon, and a `product.schemes` entry with `dir` is served from `Data/<dir>` through `protocol.handle` (`app-media://` over `Data/media`). `defineProduct` checks all three lists.

  The installer registers them: on Windows the updater's Velopack hooks write and remove the `HKCU\Software\Classes` keys, and the installer stub runs `--os-integration=register` after a portable install; on macOS electron-builder writes Info.plist; on Linux the deb's `.desktop` file and mime XML come from electron-builder, the managed post-install refreshes both databases, and an AppImage writes its own entry under `~/.local/share`.

  The running app receives each link or file from argv at launch, from a second launch through the single-instance lock (taken when the product declares a protocol or a file type, never for a named instance or an automation launch; `bootstrapApp({ singleInstance })` overrides it) and from macOS `open-url` and `open-file`. After the reveal, main hands each `OpenRequest` to `ctx.onOpen` and `bootstrapApp({ onOpen })`, and the renderer gets it through `useAppOpen` or `appOpen.on` (`app:takeOpens`, then `app:open`).

- b42b735: Brock apps release with their note. The managed `release.yml` makes the GitHub release body the note without its comment lines plus a Downloads list, names the release after the note's title, and `brock package` hands Velopack the same note (`release/release-notes.md`), so `NotesMarkdown` carries it to the updater. A new app ships `release-notes/v0.1.0.md`, filled in with its name. The `release-notes-folder` migration (0.36.0) adds `release-notes/` with a README on the format at the repo root of an existing app, once, and leaves a to-do to write the next note.
- b42b735: New `brock release-notes check [version]`, from an app or its repo root: the note of that version must exist at the repo root and follow the release note standard, with the title naming `product.name`. Without a version it checks the app's own version once the repo has a note at or below it. The managed `ci.yml` runs it in the quality job, and the managed `release.yml` runs it with the version being released before it tags, so a release without a proper note stops there.
- 0aaabeb: Brock depends on `@drizztdourden08/standards` ^0.8.0, and `brock-thread` drops its copy of the release note checker for `@drizztdourden08/standards/release-notes`: `checkReleaseNote` is the standards function, and `checkNoteFile` runs its `checkRepoNotes` for the version named, so `brock release` and `brock release-notes check` also hold every newer note in the repo to the standard.
- b42b735: Brock's own releases follow the release note standard through the reusable release workflow of standards: the root declares `@drizztdourden08/standards` and a `release-notes` script, so the version pull request carries a draft `release-notes/v<version>.md` from the changesets, publishing waits until someone rewrites it, and the GitHub release `v<version>` takes it as its body in place of one release per package.
- b42b735: A Brock workspace with several apps gets workflows per app. Each app gets `ci-<app>.yml` and `release-<app>.yml` at the repo root, and the first app also writes `ci.yml` with one `workspace` job for the repo-wide checks. A pull request builds and reviews an app only when it touches it: the new `brock affected <app folder> [base ref]` prints true for the app's own files, a workspace package it depends on, or a file outside every package. Releases tag with the new `product.releaseTagPrefix` (`'desktop-v'`, required once a repo has several apps, `v` otherwise) and read the notes from the app's own `release-notes/`; `brock release --app <name>` dispatches the app's workflow. The updater keeps to the releases whose tag starts with the prefix, so the other apps and any other tags of the repo stay out of its list. A workspace with one app keeps `ci.yml`, `release.yml` and plain `v<version>` tags.
- b42b735: The managed workflows cover a repo with several packages. In a repo with `brock.workspace.mjs`, `brock sync` in the first app under `apps/` writes `ci.yml` and `release.yml` at the repo root with `APP_DIR` set to that app, and `brock check` fails when they drift; CI runs the lint, markdown, structure and test scripts and `brock check` at the repo root. `release.yml` refuses `prerelease` with `set_latest`, makes a release full on its own while the repo has no latest release (the first one, pre-release or not), never marks a pre-release latest, and on a pre-release links the pre-release's own Windows setup when it was built in place of the small installer, which always installs the latest stable release. The workflows install with `secrets.PACKAGES_TOKEN` when the repo sets it, else the workflow token.
- 5a819b6: `build` in `brock.config.ts` sets what the managed Vite configs take, so `electron.vite.config.ts` stays one line. `build.aliases` adds import prefixes beside `@app`, each a folder relative to the app folder, for main, preload, the renderer, its workers and the web build, and `brock sync` adds them to the managed `tsconfig.json` paths; `@app` stays Brock's. `build.nodePolyfills` (`true` or the options of `vite-plugin-node-polyfills`, which the app installs and `brock knip` counts as used) puts the polyfills in the renderer and in every worker build. Workers now build as ES modules (`worker.format: 'es'`), so a worker takes dynamic imports too, and a `public/wasm/` folder is served and copied as it is.
- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

- e344df6: `brock site add <name>` adds a site beside the Brock app: a separate single-page web app at `apps/<name>` of the same pnpm workspace, drawn with Tessera (`TesseraProvider`, the brand palette, the tokens and its own `theme.css`), framed by Tessera's `SiteHeader` (brand, links, the profile menu as the title bar's dropdown action) and `SiteFooter`, with a sign-in page on the brand gradient. `brock.site.ts` (`defineBrockSite` from `@drizztdourden08/brock-build/site`) gives it a tool port of the app's port block in the checkout's slot, an optional `/api` dev proxy to a URL or to a port offset of the same slot, node polyfills and aliases; `brock site dev`, `build`, `preview` and `list` run it. `brock sync` writes its managed `vite.config.ts` (`defineBrockSiteConfig` from `@drizztdourden08/brock-build/vite-site`), `tsconfig.json` and its own `ci-<name>.yml`, gated by `brock affected`, and `brock check` reports their drift. The site joins `tessera.config.json`, `knip.json` and the Tessera guide, and the lint preset takes `brock.site.ts` as a default-export file. Brock adds no server kit, functions, hosting deploy or sign-in layer for it. `brock adopt` lists a design package's `src/views`, the views two or more apps share, beside each app's own views.
- 5116d52: `brock migrate --tessera-from-copy <folder> --map <file> [--alias <alias>]` converts an app that imports its own copy of the design system Tessera was cut from. The command holds no table of any one copy: `--map` names a JSON file (relative to the current directory) with the release the copy matches (`from`, 0.3.0 when left out), the folders of the copy and the Tessera entry point each takes (`entries`), the copy's stylesheets (`stylesheets`), the props a copy component gains (`attributes`) and rename entries added to a release (`overlay`). Named imports of the copy, relative or through an alias, take the Tessera entry of the deepest mapped folder (joined into one import per entry), then every `RENAMES.json` release after `from` replays over them, and `brock.tessera` is pinned. A copy part that shares a name with a different Tessera part takes the name the replay gave it, never Tessera's own part. Each imported name is then checked against the installed Tessera: a name another entry exports moves there, and anything that cannot be rewritten mechanically (a helper from inside the copy, a namespace import, a dynamic import or mock, a rename note, the alias config, the copy folder itself) is a numbered to-do in the report. A missing or unusable map stops the run before it touches a file. A second run changes nothing it already changed. `tesseraRenamesStep` takes `files` and a per-release `overlay` for it.
- 524dcf3: New module `@drizztdourden08/brock-tools` (`brock add tools`): external binaries an app declares, such as ffmpeg and ffprobe. `getTools(ctx).register({ id, label, binaries, version?, downloads?, resolveDownload?, usePath?, installHint? })` adds a tool; `state` finds it in `Data/tools/<id>/<version>` or on `PATH`, `install` runs the `tool:<id>` job (download through `net.fetch`, size and SHA-256 check, unpack from zip, tar or a bare file, one rename into the cache), and `run` spawns a binary with an argument array, a timeout and a line callback. The renderer gets `window.api.tools` and `useTool(id)`. brock-electron exposes its zip reader and writer as `@drizztdourden08/brock-electron/zip`, and `brock add` knows the `tools` id.

### Patch Changes

- c530ec5: Brock's own releases carry a release note. The `release` workflow passes `release-notes` to the reusable workflow of standards, so the version pull request holds a draft `release-notes/v<version>.md` for the one version all Brock packages share, publishing waits until the draft is rewritten and passes the check, and the GitHub release `v<version>` takes the note as its body. The README gives the steps: after the version pull request opens, write the note on its branch, check it with `pnpm release-notes check`, then merge.
- f0e104c: Brock keeps one Capacitor config, the managed `capacitor.config.json` at the app root, and supports no `capacitor.config.ts`. The Capacitor CLI loads a `.ts` or `.js` config before the JSON, so one left beside it would silently replace the managed file: `platform add android` now fails on its first step while either sits at the app root, and names what to do. docs/upgrading-an-app.md (Android) gives the move for an app with `apps/mobile/capacitor.config.ts`: the Android project into `mobile/android`, the plugins into the app's `package.json`, the `build.gradle` paths, version and signing variables, then `platform add android` and `cap sync`.
- adc0d5c: A production build strips the dev-only screens and handler groups again when the app folder is reached through a link, a junction or a short Windows name (`C:\Users\RUNNER~1\...`, the temp folder on GitHub's Windows runners). Vite hands `devOnlyPlugin` the real path of each file, which lay outside the app root as given, so `.brock/*.dev.ts` shipped whole and an import of a `.dev` file built instead of stopping. The plugin now matches a file against the app root as given and its real path.
- e40fe59: Examples name no app of their own. `defineProduct`'s message for a file extension written with a dot gives `mypack` as its example, the package READMEs use neutral names (`my-app`, `api-token`, an `account` sign-in, `codegen:check` as a gate script), and the move steps in docs/upgrading-an-app.md are a general checklist.
- 5345962: An app whose main process and renderer sit in two folders (such as `apps/desktop/electron` and `apps/web/src`) moves them into one app folder; Brock adds no setting for other `electron` or `src` paths, since every scanner, managed config and check reads them beside `brock.config.ts`. docs/upgrading-an-app.md gives the move step by step: the aliases other than `@app` out first, the renderer into the folder that holds `electron/`, the paths that named the old places, the Brock skeleton created beside the app and merged in, and the old web folder and root Vite config removed.
- 956b72b: `brock sync` writes `.brock/tessera.ts`, a type import of the Tessera entry module, in every app that has Tessera. A `declare module '@drizztdourden08/tessera'` block, such as the parts module `tessera guide` writes, only resolves when the Tessera entry file is already in the program, and an app whose own files import Tessera through subpaths never loaded it; in an app scaffolded with `--local`, where the Brock packages are links that import their own Tessera copy, `tsc` and `pnpm lint` failed with TS2664 ("Invalid module name in augmentation") as soon as the guide wrote any part. A fresh app ships the file, and the next `brock sync` adds it to an existing one.
- 7fc554a: Each worktree has its own base branch, so a repo can run a whole migration on an integration branch while its main branch keeps moving. `worktree create --base <branch>` sets it and starts the worktree there; a `--from` that names an origin branch makes that branch the base unless `--base` says otherwise. The base is stored in git config as `branch.<branch>.brockBase`, so it follows the branch through `finish`, a resume and a rename, and goes with `git branch -D`. `refresh --rebase` rebases on it, `pr open` opens the PR into it, `pr status` says when the PR targets another branch, and `finish` and `remove` treat the branch as landed once its commits are on the base, then delete it instead of leaving it behind. `worktree base [name] [<new base>]` shows or changes it. A branch that another branch names as its base is never deleted with a worktree. A worktree made before this has no entry and keeps the workspace base; after a fresh clone, resuming a branch takes the base of its open PR.
- Updated dependencies [273846f]
- Updated dependencies [5a819b6]
- Updated dependencies [aa74a6d]
- Updated dependencies [34ef26d]
- Updated dependencies [b8f4eed]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [e40fe59]
- Updated dependencies [0aaabeb]
- Updated dependencies [b42b735]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
- Updated dependencies [7fc554a]
  - @drizztdourden08/brock-core@0.36.0
  - @drizztdourden08/brock-thread@0.36.0

## 0.35.0

### Patch Changes

- @drizztdourden08/brock-core@0.35.0
- @drizztdourden08/brock-thread@0.35.0

## 0.34.0

### Minor Changes

- 2bb99b9: `src/tours` takes constants files beside the tours: `<id>.tour.constants.ts`, the file the constants lint rule names for a constant in `<id>.tour.ts`, and `<name>.constants.ts` for constants several tours share. `brock structure` no longer reports them, and `brock sync` leaves them out of `.brock/tours.ts`. Before, lint asked for the constants file and the structure check refused it, so a tour's selector had to live in `src/hooks`.

### Patch Changes

- 2bb99b9: The app tsconfig includes `.brock/*.ts` instead of `.brock`. TypeScript skips dot folders when it expands a folder entry in `include`, so `.brock` matched no file, and `.brock/tessera-parts.ts`, the `guide.parts` file a fresh app sets, never reached the program because nothing imports it. `brock sync` writes the new tsconfig, and the `brock-dir-type-checked` migration (0.34.0) rewrites a bare `.brock` include entry in every `tsconfig*.json` at the app root.
- 55d8b24: `brock structure` accepts the constants file the constants lint rule names in every convention folder, as it already did in `src/tours`: `<id>.widget.constants.ts` and `layout.constants.ts` in `src/widgets`, `<id>.action.constants.ts` in `src/title-bar`, `<id>.<kind>.constants.ts` (such as `library.page.constants.ts`) at any level of `src/screens`, and `<name>.constants.ts` for constants several files there share; `brock sync` leaves them out of `.brock`. Module folders take `<id>.task.constants.ts` beside a boot task and `<id>.step.constants.ts` beside a review step. Before, lint asked for these files and `brock structure` refused them.
- 2bb99b9: `brock sync` in a workspace app runs `tessera guide` where Tessera is installed. It still reads the workspace's `tessera.config.json`, but runs Tessera in that folder only when it has Tessera, else in the first workspace package outside the `apps` entries that has it (such as `packages/design`), else in each `apps` entry with Tessera. Before, it ran at the repo root, where Tessera reported itself not installed, so the part names were never written by a sync from `apps/desktop`.
- 2bb99b9: `brock migrate` replays Tessera's `RENAMES.json` over every workspace package that depends on Tessera, found from the `pnpm-workspace.yaml` globs, instead of every folder under `apps/` and `packages/`. A Tessera package in another folder (`tooling/*`, say) is covered now, and a package that does not use Tessera is no longer touched by a class or custom property rename.
- 08e0cd1: A dev launch (the review's included) leaves `dist/electron/main.js` without a built renderer, and a later `brock start` opened a blank window. `brock start` now spots that half build (no `dist/renderer/index.html`, or one older than main) and runs `brock build` first. `launchAppForTest` and `assertLaunchable` throw with the reason instead of opening a blank window, and `launch --prod` refuses with it.
- 55d8b24: `brock migrate` replays Tessera's component renames into usage files (`<Name>.usage.ts`, which `tessera guide` reads): the part each `avoidWhen` entry names in `use`, such as `use: 'ManagedList'`, becomes `use: 'ItemList'`, and a note there becomes a to-do. The `example` string replays as code of its own, so its Tessera import, the tags and references it holds and the release's entry point moves follow. No other string in a usage file changes, and a `use` key anywhere else is left alone. Before, after an upgrade the guide reported `avoidWhen names ManagedList` and could not compile the example.
- 2bb99b9: `brock structure` accepts `context` in a widget file's `meta`. `WidgetMeta` has taken it since the context registry, but the list of widget fields the structure check reads did not, so a widget that named its context was reported as having a field that is not a widget field.
- Updated dependencies [08e0cd1]
- Updated dependencies [08e0cd1]
  - @drizztdourden08/brock-core@0.34.0
  - @drizztdourden08/brock-thread@0.34.0

## 0.33.0

### Patch Changes

- @drizztdourden08/brock-core@0.33.0
- @drizztdourden08/brock-thread@0.33.0

## 0.32.1

### Patch Changes

- @drizztdourden08/brock-core@0.32.1
- @drizztdourden08/brock-thread@0.32.1

## 0.32.0

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0
  - @drizztdourden08/brock-thread@0.32.0

## 0.31.0

### Patch Changes

- @drizztdourden08/brock-core@0.31.0
- @drizztdourden08/brock-thread@0.31.0

## 0.30.0

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0
  - @drizztdourden08/brock-thread@0.30.0

## 0.29.1

### Patch Changes

- 5ad5e24: The Tessera renames replay now reads `props` keys that end in `*`, such as Tessera 0.23.1's `CommandInput.aria-*`, `CommandInput.on*` and `CommandInput.*`, which it used to skip. Such a key covers every prop of that component starting with the text before the `*`. An exact key still comes first, then the longest matching prefix, and a prop the component still takes is left alone, read from the installed Tessera's types (the props type of the JSX tag or of the object literal), else from a `keep` list in the release, else the to-do says to check it. The value is always a note, so each covered prop becomes a to-do and is never renamed. This works on JSX attributes and on object literals typed as the props type; an exact `Component.prop` key now also reaches an object literal typed as `ComponentProps`. A `props` value that is a bare prop name (`label`) is a rename to that prop of the same component on JSX attributes too, so `CommandInput.aria-label` becomes `label` instead of a to-do.
  - @drizztdourden08/brock-core@0.29.1
  - @drizztdourden08/brock-thread@0.29.1

## 0.29.0

### Patch Changes

- @drizztdourden08/brock-core@0.29.0
- @drizztdourden08/brock-thread@0.29.0

## 0.28.1

### Patch Changes

- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-core@0.28.1
  - @drizztdourden08/brock-thread@0.28.1

## 0.28.0

### Patch Changes

- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-core@0.28.0
  - @drizztdourden08/brock-thread@0.28.0

## 0.27.0

### Minor Changes

- f704655: Guided tours are part of every Brock app, drawn by Tessera's `GuidedTour` and presented by the app's brand mascot. A tour is a file: `src/tours/<id>.tour.ts` default-exports `defineTour({ id, title, steps, trigger? })`. `brock sync`, `brock dev`, `brock build` and the renderer Vite plugin write `.brock/tours.ts`, `BrockApp` takes it as `tours`, and `RendererModule.tours` adds a module's tours. `brock structure` checks the folder, and `brock-lint-config` lets tour files default-export.

  A step lights a Tessera target or a Brock one (`{ shell: 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen' }`, `{ widget: '<id>' }`, `{ setting: '<key>' }`). Before it shows it can `open` a screen or hub page, open a `widget`, set a `context` and run `before(ctx)`, which may be async. `advanceOn` waits for a click (`{ click: target }`), a tour event (`tours.emit(name)`) or a context change. Each step can name the mascot's state.

  `tours.start(id)`, `tours.stop()`, `tours.next()`, `tours.back()` and `useTour()` drive tours. Completion and the last step are kept per profile in `ui-views.json`, so a finished tour doesn't come back by itself. `trigger: 'first-run'` starts a tour once, the first time a profile opens the app, after the boot and the splash. Menu > Take the tour (in Help when the app has a Help group, else in Advanced) and a search palette action per tour start them. Escape closes a tour, and the other shell shortcuts wait while one is open. The title bar stays usable over the tour. The menu knows a `help` section.

  The review gets a `tours` step: it runs every tour end to end, clicks through interactive steps, captures each step and checks that the tour is kept as completed and that Escape closes it.

  The template ships `welcome.tour.ts`, a four-step first-run tour of the menu, the search, the Notes widget (which waits for a click) and Settings. The 0.27.0 `tour-files` migration adds `tours={appTours}` and its import to `src/main.tsx`.

### Patch Changes

- @drizztdourden08/brock-core@0.27.0
- @drizztdourden08/brock-thread@0.27.0

## 0.26.0

### Minor Changes

- 0204060: `SettingAction` takes `tone` in place of `variant`, named as in Tessera's `ActionData` (variant became tone on every action shape in Tessera 0.21). `tone` is a `ButtonVariant`: `'danger'` gives the settings row its danger tone and a string `confirm` dialog its danger look, and `SettingActions` draws its buttons in it. `variant` is a deprecated alias that still works until 0.27; when both are set, `tone` wins. The Storage page's Clear action uses `tone`.

  The 0.26.0 migration `setting-action-tone` rewrites `variant:` to `tone:` in the settings actions of an `actions: [...]` list (a JSX `actions` prop and mapped entries too) and in objects typed `SettingAction` by an annotation, a return type, `as` or `satisfies`. The `variant` of a `confirm` dialog stays. An object with `label`, `onSelect` and `variant` it cannot place, and an action that sets both, become to-dos. A second run changes nothing.

  The template's General page shows a row action: Widget layout, with a Reset in the danger tone that asks first.

### Patch Changes

- 0204060: The Tessera renames replay now renames props of object literals typed by their context. A `props` key on a type, such as `SettingsRowAction.onClick` to `onSelect`, renames the prop, method or shorthand of each object literal whose contextual type from the TypeScript checker (else its own type) is that Tessera type: under an annotation, `as` or `satisfies`, a function's return type, a call argument, an array element or a JSX prop value. Before, nothing renamed those props. A note in place of a name is a to-do on the prop. The checker runs once per release, over only the files with an object literal holding a prop some key names, asks only those literals, and shares the files it reads beside them between releases.
  - @drizztdourden08/brock-core@0.26.0
  - @drizztdourden08/brock-thread@0.26.0

## 0.25.0

### Minor Changes

- 8903da0: Brock moves to Tessera 0.21.0: the workspace catalog and brock-react's peer range are `^0.21.0` (MIGRATION §181 to §191). `brock upgrade` from 0.24 replays RENAMES.json (ManagedList to ItemList, MasterDetail to ListDetail, ContentHeaderBack to BackAction, `onClick` to `onSelect` and `variant` to `tone` on the action shapes, ToastContainer to ToastStack, the removed JsonInput, NamedRange and SetPicker, and the merged strings). The profiles list is Tessera's `ItemList`, and SettingsRow actions take `onSelect`.

  `ScreenLayer` takes `back`, Tessera's `BackAction` `{ onSelect, label? }`, in place of `onBack`. The shell passes the page Back goes to as the label, the hub page or sub-page of the last history step, else the screen title, so the arrow reads Back to Saves. The 0.25.0 migration `screen-layer-back` rewrites `<ScreenLayer onBack={fn}>` to `back={{ onSelect: fn }}` and lists an `onBack` it cannot rewrite as a to-do.

- 8903da0: Toasts go through Tessera's one queue. `ToastHost` is a single `ToastStack` at the bottom right with `max={3}`, and `toast(message, { variant, duration, action })` and `dismissToast(id)` are thin wrappers over Tessera's `toast()` and `toast.dismiss()`. The same message and variant raised again joins the toast already shown, with a count such as ×2, and a toast with no `duration` leaves after Tessera's 5 s, where Brock's own default was 4 s. `useToastStore` and `ToastState` are removed: the 0.25.0 migration `toast-store-gone` lists each use as a to-do.

### Patch Changes

- 8903da0: The Setup splash sets the app name in Tessera's TrueType title font, `fonts/chakra-petch/chakra-petch-latin-600-normal.ttf`, which Tessera 0.21 ships beside the WOFF2 file. resvg loads it straight from the package with the system fonts, by the family it declares, `Chakra Petch SemiBold`, so Brock's own WOFF2 to TrueType converter is gone. Segoe UI stays the fallback.
  - @drizztdourden08/brock-core@0.25.0
  - @drizztdourden08/brock-thread@0.25.0

## 0.24.1

### Patch Changes

- @drizztdourden08/brock-core@0.24.1
- @drizztdourden08/brock-thread@0.24.1

## 0.24.0

### Minor Changes

- 88977ee: `brock upgrade` and `brock migrate --tessera-from` replay the entry point moves Tessera's `RENAMES.json` records in each release's `moves` map:

  - After a release's renames, its moves are grouped by `from` and `to` (package.json `exports` subpaths) and every import or re-export of a moved name through `@drizztdourden08/tessera/<from>` takes it from `@drizztdourden08/tessera/<to>`. A part renamed in the same release moves under its new name. The root import never moves.
  - `importMoves` reads any exports subpath, not only `primitives`, `composites` and `brand`, so `data`, `field-kits` and the others move too.
  - `importMoves` moves `export { … } from` re-exports as well, and moves the named imports out of an import that also takes a default, which stays where it is. It takes an optional `ts`, a TypeScript compiler already loaded.
  - A name the new entry already imports is dropped from the old import, never written twice, so the published `tessera-part-moves` (0.19.0) and `tessera-tier-moves` (0.23.0) migrations and the moves replay give the same imports in either order and on any rerun.

### Patch Changes

- 43791e4: The installer's Setup splash (`build/installer-splash.png`) now sits on the same dark ground as the boot splash. It drops the white radial glow and the shadow behind the mark, and paints the palette's dark gradient (`gradientDarkFrom` to `gradientDarkTo` in Tessera's `tokens.json`, the values of `--c-gradient-dark-from` and `--c-gradient-dark-to`). An app with colours of its own gets the `--look-dark-from` and `--look-dark-to` pair from `darkPair`, and a dark pair set in `theme.css` comes next. The mark comes from Tessera's `brand/dark-ground/`. The app name is in the palette's dark text, which must hold 4.5:1 at both ends of the gradient; if it doesn't, the name falls back to white or black, whichever reads better. The name is set in the boot splash's title font, Tessera's Chakra Petch, and falls back to Segoe UI only when that font file can't be read. `brock icons` now draws the Setup splash too for an app that ships to Windows, so you can check it before a release. The installer's downloader window keeps the bright look across its top.
  - @drizztdourden08/brock-core@0.24.0
  - @drizztdourden08/brock-thread@0.24.0

## 0.23.0

### Minor Changes

- e769096: Brock moves to Tessera 0.20.0: the workspace catalog and brock-react's peer range are `^0.20.0` (MIGRATION §170 to §180). `brock upgrade` from 0.22.0 replays RENAMES.json (ChosenMascot to AnimatedMascot, PathField to PathInput, the removed parts, the eighteen Glyph names, StatRow `copyable`, CommandPalette `sentri` to `rotp`), and two 0.23.0 migrations cover what it does not:

  - `tessera-tier-moves` moves imports of the parts that changed entry point: Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput and PathField (with their types) from `/primitives` to `/composites`, Overlay to `/primitives` and PixelWordmark to `/brand`. RENAMES.json names no entry point, so an import that only got renamed would point at the wrong one. The root import is left alone.
  - `menu-confirm-store` lists each use of the removed `useMenuConfirmStore`, `MenuConfirmState` and `MenuResolver.armed` as a to-do.

  The replay no longer flags every import of `Text` for the removed `Text.CodeBlock`: a removed member is a to-do only on the lines that use it.

### Patch Changes

- e769096: The splash sits on Tessera's dark gradient, with text that holds WCAG AA. The splash page and the boot failure splash drop Brock's white radial highlight, the light drop shadow on the mark and the bright look under the text, so Tessera paints the palette's `--c-gradient-dark-from` to `--c-gradient-dark-to` under its tested text colours. Only an app with colours of its own (`product.look`, or palette seeds in its theme without its own `--p-gradient-dark-from` and `--p-gradient-dark-to`) gets `--look-dark-from` and `--look-dark-to`, from brock-core's new `darkPair`, which darkens its look toward black until the palette's `--c-text-dim` reads at 4.5:1 at both ends. `brock icons` writes `public/logos/mark.svg` from Tessera's `brand/dark-ground/<brand>.svg`, so both splashes show the mark in its dark ground colours. The installer and its Setup splash keep the bright look.
- Updated dependencies [e769096]
  - @drizztdourden08/brock-core@0.23.0
  - @drizztdourden08/brock-thread@0.23.0

## 0.22.0

### Minor Changes

- 73a287e: A central context registry replaces the single widget context. `useContextsStore` holds named contexts, each `{ active, data? }`; the app and modules set them with `contexts.set('session', { active, data })` or `useSetAppContext('session', active, data?)` in a component, and read them with `useAppContext('session')`. A widget names the context it needs with `context: 'session'` in its definition or file `meta` (which makes it `context-only` by default) and shows only while that context is active, docked, floating and popped; module widgets register the same way as app widgets. The registry is relayed to popped widget windows, so `useAppContext` reads the same contexts there. `BrockApp`'s and `WidgetHost`'s `widgetContext` prop is deprecated but keeps working, driving the `default` context that context-only widgets with no context of their own follow; the `widget-context-registry` migration (0.22.0) lists each use as a to-do.
- 73a287e: The review copies `src/review/fixtures/` into the app data folder, at the same paths, before the seed runs, for sample files that are easier to keep as files. `brock sync` lists them in `.brock/review.ts` (`fixtures`, lazy `?url` imports), the copy reports a `fixtures-copied` check in the `seed` step, and `brock structure` leaves the folder alone. A fresh app ships `src/review/fixtures/notes/review-note.txt`, which its seed reads into the Notes widget.

### Patch Changes

- 73a287e: The `guide/` folder `tessera guide` writes is generated output: a fresh app ignores it in git, `brock dev`, `brock build` and `brock start` write it again when it is missing, and the `guide-folder-ignored` migration (0.22.0) adds `/guide/` (or the `guide.out` folders) to the `.gitignore` beside `tessera.config.json` and makes a tracked copy a to-do.
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-core@0.22.0
  - @drizztdourden08/brock-thread@0.22.0

## 0.21.1

### Patch Changes

- @drizztdourden08/brock-core@0.21.1
- @drizztdourden08/brock-thread@0.21.1

## 0.21.0

### Patch Changes

- @drizztdourden08/brock-core@0.21.0
- @drizztdourden08/brock-thread@0.21.0

## 0.20.0

### Patch Changes

- @drizztdourden08/brock-core@0.20.0
- @drizztdourden08/brock-thread@0.20.0

## 0.19.0

### Minor Changes

- df9c1df: Brock moves to Tessera 0.17.0: the workspace catalog and brock-react's peer range are `^0.17.0`. Small text is 12 px, and Field labels and DataTable headers are no longer forced to capitals (Archipelia review T-03). Two new settings control kinds: `path` (`pick`, `accept`, `placeholder`) draws Tessera's `PathField` on a string setting, with typing, a drop from the desktop and Browse, and `json` (`shape`) draws `JsonInput`, which saves the value only while the text parses. They come with new optional platform ports, `filePicker.pickPath`, `filePicker.pathOf` and `storage.revealLogs`, which the Electron host fills through the new `dialog:pickPath` and `debug:revealLogs` channels and the preload's `getFilePath`. `brock upgrade` writes `StatusOf` as `Status` from Tessera's `RENAMES.json`, and the `tessera-part-moves` migration moves `CopyButton`, `CopyValue` and their types from `/primitives` to `/composites`, and `ErrorBoundary` from `/composites` to `/primitives`.

### Patch Changes

- df9c1df: A renderer boot task that fails while the window shows now draws Tessera's `Splash`, the same as the boot splash page: the app name and mark, `<task> failed` with the error under it, a danger bar, the version, and Retry, Open logs (the logs folder) and Quit. It covers the window, and the app root is inert under it. The splash page draws its mark in `ts-mark` and the error in `ts-detail`, and the splash plugin puts the app look on the app page, so both splashes share the gradient.
- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-core@0.19.0
  - @drizztdourden08/brock-thread@0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- 70d80cf: The generated `.brock` files are never linted: `brockEslint` ignores `**/.brock/**`, the templates list it, and migration `eslint-brock-ignore` adds it to the ESLint config of the app and of the workspace root.
- 70d80cf: `brock sync` runs `tessera guide` when `tessera.config.json` sets `guide.parts`, and a new app sets it to `.brock/tessera-parts.ts`. Migration `guide-parts` asks an app to set it and to delete a hand-written parts list (archipelia-36, brock-24).
- 70d80cf: `brock migrate` runs `brock sync` again when a Brock migration changed the app, so a file it adds, such as `session.base.tsx`, reaches `.brock/screens.ts`.
- 70d80cf: A `.settings.ts` page written as a function keeps its build-time search rows: the literal reader follows the sections the function returns.
- 70d80cf: The static splash page draws with Tessera's `splash.css` kit and keeps only its look, mark and failure layout (T-09).
- 70d80cf: Widgets use Tessera's body padding and fill: the Performance widget drops its own padding, the Logs widget uses `padding: 'none'`, `fill` and LogPanel `height="fill"`, and widget `meta` accepts `padding` and `fill`.
- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-thread@0.18.0
  - @drizztdourden08/brock-core@0.18.0

## 0.17.1

### Patch Changes

- 1ebfc4c: `brock knip` counts a dependency an app declares for the Brock and workspace packages it bundles (their `dependencies` and `peerDependencies`) as used. Knip reads `package.json#main` (`dist/electron/main.js`) whenever it exists, so a fresh worktree flagged those packages as unused until a build ran, and the upgrade gate, which lints before it builds, went red. The template's `knip.json` no longer lists `@electron-toolkit/utils`, `velopack` and `zustand` in `ignoreDependencies`.
- Updated dependencies [1ebfc4c]
- Updated dependencies [1ebfc4c]
  - @drizztdourden08/brock-thread@0.17.1
  - @drizztdourden08/brock-core@0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: Main has a place for app services: `bootstrapApp(product, { services: (ctx) => createAppServices(ctx) })` builds them once, at the start of the modules boot task (after the paths, before the handlers), exposes them as `ctx.services`, typed through the new `AppServices` augmentation, and calls their `dispose()` on will-quit. Reading `ctx.services` before the build, or without the option, throws and says which. The `app-services` migration turns a WeakMap memo keyed by `MainContext` into a to-do.
- 3a35c8e: An IPC channel is declared once: `defineChannels({ engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'), onProgress: event<(p: number) => void>()('ap:engine:progress') })` from brock-core gives the preload maps (`maps.invoke`, `maps.send`, `maps.events`), the augmentation types (`InvokeContractOf`, `SendContractOf`, `EventContractOf`) and typed entries: main's `handle`, `on` and `emit` take an entry in place of the channel name, and brock-react's `channelApi(APP_CHANNELS)` types the renderer calls by method name. Channels written in the augmentation, a map and a handler keep working. The new app declares its channels this way, knip treats `src/ipc/contract.type.ts` as an entry, and the `channel-declarations` migration lists, as one to-do, every channel an app could move. docs/ipc.md shows both styles.
- 3a35c8e: Handler groups are picked up by file name: `brock sync` writes `.brock/handlers.main.ts` (`mainHandlers`) from `electron/handlers/<subject>-handlers.ts`, each exporting `<subject>Handlers`, and a change in that folder makes `.brock` stale. The new app passes `handlers: mainHandlers`. The `handlers-by-file` migration rewrites `electron/main.ts` the same way when its hand list (in `electron/handlers/index.ts` or inline) names exactly those groups, removing an index that held only the list, and leaves a to-do with both lists otherwise.
- 3a35c8e: Apps add their own review steps: each `src/review/<id>.step.ts` (default export `defineReviewStep({ run })`) runs as step `<id>` after the built-in steps, in the same report. `run(tour)` gets the built-in helpers: `check`, `report`, `capture` (named `<id>-<name>`), `find`, `findAll`, `click`, `hover`, `typeText` (inputs and textareas), `press`, `waitFor`, `settle`, `delay`, `openScreen`, `openWidget`, `resetUi`, plus `platform` and `api`. A step that finishes gets a passing `step-ran` check, and an id that is a built-in step's name fails. `brock structure` accepts `<id>.step.ts` files and the lint preset allows their default export. The new app ships `src/review/notes.step.ts`.
- 3a35c8e: The review tours the app's real content: `src/review/seed.ts` (default export `defineReviewSeed({ run })`) runs as the `seed` step right after the profile step, so the screens and widgets that follow are captured with data. The seed fills the app through its own channels, a store, or fixture files written with `tour.platform.files`. `brock sync` lists it in `.brock/review.ts`, `src/main.tsx` passes `review={appReview}` to `BrockApp` (the `review-files` migration adds it), and the new app writes a note for the Notes widget. docs/review-steps.md shows how to write one.
- d358df3: A base screen is a file now: `src/screens/<id>.base.tsx`, one per app, default-exports its component (`BaseProps`) with `title` and `icon` in `meta`. `brock sync` lists it, `BrockApp` draws it under every hub, Escape closes down to it and opens `config.home` from it, and `brock structure` rejects a second one, one inside a bucket and one named like a bucket. The `base-screen-file` migration moves a hand `defineScreen` passed through `screens` and `home` into that file, or leaves a to-do naming the file when the screen holds more than a title, an icon and a component.
- d358df3: Sub-pages: `<page>/<sub>.sub.tsx` beside a page is a route under it (`meta.path`, such as `':id/edit'`), drawn in the page frame with "Back to <page>" before its title. It goes into the history, Escape and Back go up to the page, search finds the ones without params, and a page opens one with `openSub(id, params)`. `useUnsavedChanges(dirty)` asks "Discard changes?" before any navigation leaves a dirty page and adds its message to the quit confirm.
- e70afc3: An app puts its own items in the title bar without a module: `src/title-bar/<id>.action.ts` default-exports `defineTitleBarItem({ kind: 'button' | 'menu' | 'status', ... })` or a hook that returns one. `brock sync` writes `.brock/title-bar.ts` and `BrockApp` takes it as `titleBar`. A `menu` item opens a dropdown of its own, a `status` item is a tag drawn while its status is set, and every item folds into the main menu when the bar is narrow. App items come after Search, Report a bug and the module items, whose order stays fixed. The `title-bar-files` migration wires `src/main.tsx`.
- 87fa9a3: A default widget layout and Reset layout. `src/widgets/layout.ts` default-exports `defineLayoutPreset({ rows, sizes, widths })`: rows of widget ids around the `main` view, with an array of ids tabbing them in one pane. `brock sync` exports it from `.brock/widgets.ts` as `appWidgetLayout` (undefined without the file), and `src/main.tsx` passes `widgetLayout={appWidgetLayout}` to `BrockApp`. A profile with no saved layout starts from it, and `meta.defaultOpen` opens a widget the preset does not place on its default side. `widgets.reset()` and the new Reset layout entry at the end of the Widgets menu put the layout back to that default. The `widget-layout-prop` migration wires `src/main.tsx`; the template ships a layout with Notes beside the main view.

### Patch Changes

- 3a35c8e: `.brock/*.ts` stays committed, as the template and `brock adopt` already wrote it, and app-structure.md now says why: a fresh checkout type-checks without a sync and `brock check` catches a stale registry. The `brock-dir-tracked` migration adds `!.brock/` and `.brock/profile-config.json` to a `.gitignore` whose `.*/` rule hid the folder, up to the workspace root.
- 3a35c8e: `brock adopt` ignores `public/logos/mark.svg`, which `brock icons` writes beside the other logos. The `mark-svg-ignored` migration adds the line next to the other logo lines and leaves a to-do when git already tracks the file.
- 3a35c8e: `brock migrate --report <file>` writes the report relative to the current directory, not to `--root`, and prints where it wrote it.
- 3a35c8e: `brock structure` warns when a renderer file imports a workspace package's barrel that reaches a Node builtin through its re-exports, and names a subpath export to import instead. app-structure.md says a renderer imports such packages through their per-subject subpaths.
- 055bb91: `SearchEntrySeed` takes an optional `id` and `params`. `id` is the entry's key, so two entries with the same label and no anchor no longer collapse into one, and `params` are passed to `open` when the entry is picked (a Presets entry opens with its `presetId`). A hub search keeps live entries with params. A custom page's literal `searchEntries` may carry both too.
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
  - @drizztdourden08/brock-core@0.17.0
  - @drizztdourden08/brock-thread@0.17.0

## 0.16.0

### Minor Changes

- 7ef6122: `screens.config.ts` takes `settings: { bucket, page? }`: the Settings entry, the palette and Mod+Comma open that page when it is set, instead of the first settings page in nav order. `brock structure` names a `settings.page` the bucket does not hold.
- 7ef6122: `brock dev`, `build` (and so `package`), `start` and the repo command's `launch` run `brock sync` first when `.brock` is missing or older than its inputs (`brock.config.ts`, `package.json`, `src/screens`, `src/widgets`, `src/boot`, `electron/boot`), so a fresh checkout that ignores `.brock` launches. `dev` and `build` stop with a message naming the missing file when `src/main.tsx` imports a `.brock` file that does not exist, instead of starting a renderer that errors and hangs. `brock sync --if-stale` is the step `launch` runs.
- 7ef6122: A tab page takes its meta from `<page>.page.ts` beside its folder: a file that exports only `meta: ScreenMeta` (title, icon, order, shortcut, devOnly, keywords). The screen sync writes it as a `page-meta` entry, the nav and the search index name and place the page with it, and `brock structure` names a `.page.ts` with no tab folder beside it or no `meta` export.
- 55befe4: `@drizztdourden08/brock-build/testing` exports `readDockLayout(page)` and `widgetWindows(app)`. `readDockLayout` returns the widget layout from brock-react's layout store (`layout`, the `docked`, `floating` and `popped` ids, the main view's rect and each drawn widget's rect); `widgetWindows` returns every popped widget window from main with its id, bounds, visibility, focus, minimized and always-on-top state. Neither reads Tessera's class names. brock-react's `WidgetHost` installs the layout reader on automation launches only.
- 7ef6122: Breaking: brock-updater no longer exports `UpdateBadge` or its CSS; the title bar status action from `useUpdateAction` replaced it. Apps that import `UpdateBadge` switch to `useUpdateAction`; migration `update-badge-removed` turns each import into a to-do.
- 7ef6122: `WidgetMeta.order` sorts the Widgets menu, then the label, instead of the file name order. `brock structure` accepts `order` as a widget meta field.

### Patch Changes

- 55befe4: `brock adopt` points the `$schema` of a new `tessera.config.json` at Tessera's schema wherever Tessera is installed: the root `node_modules`, else `packages/design`, else any workspace package, written relative to the repo root. With no install yet it keeps the root path.
- 7ef6122: docs/app-structure.md lists which generated files are committed and which are ignored, and the Archipelia review moved out of it to docs/reviews/archipelia.md.
- 55befe4: `launchAppForTest` returns the app window, not the splash. It waits for the window that loads the renderer index (never `splash.html` or a widget window) and for the splash to close, which happens once every boot task resolved and the window was revealed. When it times out with the splash still open, the error says the boot never finished. An app no longer needs its own launcher for this.
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-core@0.16.0
  - @drizztdourden08/brock-thread@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0
  - @drizztdourden08/brock-thread@0.15.0

## 0.14.0

### Patch Changes

- @drizztdourden08/brock-core@0.14.0
- @drizztdourden08/brock-thread@0.14.0

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

<!-- @layer docs @kind doc -->
# brock-build

The tooling side of Brock: the config factories an app's managed files call, the
`brock` CLI, and the Electron install check. Plain `.mjs`, run by Node 24 with no
build step.

| Entry | Holds |
|---|---|
| `/config` | `defineBrockConfig(cfg)` for `brock.config.ts`; `loadBrockConfig(rootDir)` imports that file under Node's type stripping |
| `/vite` | `defineBrockViteConfig(rootDir, overrides?)`: the electron-vite config (main and preload from `electron/`, renderer from `src/` with `index.html` and `splash.html`, the splash preload beside the app preload, React plugin, react deduped, `@drizztdourden08/*` bundled instead of externalized) |
| `/vite-web` | `defineBrockWebConfig(rootDir, overrides?)`: the renderer alone for the web and Android targets (relative base, `dist/web`, the web app manifest) |
| `/builder` | `createBuilderConfig(product, { rootDir })` and `loadBuilderConfig(rootDir)` for electron-builder |
| `/vitest` | `defineBrockVitestConfig(rootDir, overrides?)`: the vitest config for an app that tests Brock source (see Unit tests) |
| `/testing` | `launchAppForTest({ appDir, args?, env?, timeoutMs?, userData? })` for app e2e tests, `waitForAppPage(app, timeoutMs?)`, `pageKindOf(url)`, `readDockLayout(page)`, `widgetWindows(app)`, `assertLaunchable(appDir)`, `unresolvableImports(outDir)` |
| `.` | Everything above plus `syncApp`, `resolveModules`, `ensureElectron` and the built-in module registry |

## The CLI

```
brock sync [--check]       regenerate the managed files, or report drift with --check
brock check                sync --check, for CI
                           at a repo root with brock.workspace.mjs, both run once per electron target's app
brock gate                 the app's own gate steps (gate in brock.config.ts): the clang-format check of
                           gate.clangFormat, each gate.scripts script, then the cargo lane while a Cargo.toml
                           is at the repo root; every step runs, exit 1 when one failed. A repo with no app
                           reads gate from brock.workspace.mjs
brock clang-format [--check]
                           rewrite the C sources of gate.clangFormat to the managed .clang-format, or list
                           the files that differ with --check
brock add <id | spec>      install a module package, record its id, sync
brock dev [-- args]        electron-vite dev
brock build [-- args]      electron-vite build; copies the brand icon set first when icons.brand is set
brock package [--full] [--channel <name>]
                           build, electron-builder --dir, vpk pack into release/velopack,
                           then on Windows the small installer and install.json
brock package --render-installer
                           Windows: build the installer stub and write its screens, the mark and
                           the Setup splash as PNGs into release/installer-preview; installs nothing
brock icons [--force]      copy the Tessera brand set into build/icons, build/splash and public/logos, draw the bot variant
                           and, for a Windows app, build/installer-splash.png on the dark ground
brock start [-- args]      run the built app with Electron (the app folder when package.json main is
                           dist/electron/main.js, so its name and version apply); args reach the app
brock adopt [--scope @x] [--local <brockRepo>] [--force]
                           give any repo the lint configs, pnpm files and the lint-config dependency,
                           plus its own command: bin/<repo>.mjs, linked by the postinstall
brock structure [--check] [--scope @x]
                           verify the folder standard: package names, barrels, folder names, depth
                           (the checks of @drizztdourden08/standards with Brock's extension, standards.extension.mjs)
brock lint [--changed | --all] [--no-cache] [files...] [-- eslint args]
                           eslint, cheap by default (see The lint step)
brock migrate --run <id> [--report <file>]
                           run one Brock migration by id, at any version, without the Tessera replay
brock migrate --from <version> [--to <version>] [--tessera-from <version>] [--report <file>]
                           run the Brock migrations after --from, up to --to, over the files the app owns,
                           then replay Tessera's RENAMES.json and pin brock.tessera;
                           --tessera-from alone replays only the Tessera renames;
                           an app with no brock.version is refused: brock adopt pins it first;
                           --tessera-from-copy <folder> --map <file> [--alias <alias>]... converts an app that holds
                           its own copy of the design system (see Tessera renames, A copy of the design system);
                           --report <file> (relative to the current directory) writes the run as JSON
brock platform list | add <id | bundle>... | remove <id | bundle>...
                           the targets in brock.config.ts; add runs the platform steps and the doctor,
                           add and remove rewrite targets and both workflows
brock doctor [id | bundle...]
                           check this machine for what the targets need; prints install commands only
brock web build | dev      the renderer alone into dist/web, from vite.web.config.ts
brock site add <name> [--brand <brand>] [--api <url | port offset>]
                           a site at apps/<name>: a Vite single-page app on Tessera beside the Brock app,
                           on a tool port of the app's block, with its own ci-<name>.yml (docs/app-structure.md, A site)
brock site dev | build | preview [-- vite args]
                           in a site folder: Vite with the site's port and /api proxy, its build into dist, a preview
brock site list            every site of the repo with its port and /api target
brock tessera <args...>    Tessera's own command line, such as tessera new compound SaveSlot, run in the
                           current folder so it finds tessera.config.json from there; every word after
                           tessera reaches it, --help too; Tessera comes from the app's or repo's node_modules
```

In a repo you do not type `brock`: you type the repo's own command (`my-app`,
`tessera`), which runs everything above and the thread verbs. That command is
`bin/<repo>.mjs`, a plain Node file with no dependencies that `brock adopt` and
`create-brock` write from `launcher.mjs.tmpl` in `@drizztdourden08/brock-thread` (`brock-thread link` writes it for a repo without brock-build); the root `package.json`
gets `"bin": { "<repo>": "./bin/<repo>.mjs" }` and a `postinstall` of
`node bin/<repo>.mjs --link` (appended with `&&` to one already there). `adopt` keeps an
existing `bin/<repo>.mjs` unless `--force` is given. The name is the one in
`brock.workspace.mjs`, else the scope without `@`.

It reaches the global `brock` (`@drizztdourden08/brock`, `packages/cli` in this repo),
which runs the `brock-build` the repo pinned in its own `node_modules`. First time on a
machine: `pnpm install` in the repo links the command, then running it once offers to
install Brock.

- `--link` writes `<repo>` (sh) and `<repo>.cmd` into the npm global bin folder (the
  `npm prefix -g` folder on Windows, its `bin` elsewhere). Each walks up from the current
  folder to the nearest `bin/<repo>.mjs` and falls back to the checkout recorded at link
  time. A shim already current is left alone and nothing is printed; `CI` set skips it; a
  failure prints one line and exits 0, so an install never fails on it.
- Any other call looks for `@drizztdourden08/brock` in the npm global folder (a `brock`
  on `PATH` first, then `npm root -g`) and runs it with the same arguments and folder.
- Not found, in a terminal: it asks, sets `@drizztdourden08:registry` when npm has none,
  checks `npm whoami` against GitHub Packages, prints the `gh auth refresh` and
  `npm config set //npm.pkg.github.com/:_authToken` fix when that fails (and offers to
  run it after a second question naming what it writes and where), then runs
  `npm install -g @drizztdourden08/brock` and the original command.
- Not found, without a terminal (CI, an assistant): it prints the install command and
  exits 1. It never asks and never installs.
- `BROCK_GLOBAL_PREFIX` replaces the npm global prefix for both the link and the lookup,
  for tests.

`--root <dir>` points at an app root other than the current directory. `dev`, `build`,
`package`, `icons`, `start`, `add`, `platform`, `web` and `server` work from any folder inside
the repo: they use the nearest folder above the current one that holds `brock.config.ts`,
else the only app of the workspace, and run from that folder. With several apps pass
`--app <dir>` (relative to the current folder or the workspace root), or the command fails and
lists them. `dev`, `build` and `start` check the Electron binary first and re-run its install
script when the postinstall was skipped or interrupted. If the binary is still missing they exit
1 and print `pnpm install` for the repo root. They never run `pnpm install --force` themselves. Everything after `--` reaches electron-vite or the app unchanged.
`brock add` installs with `pnpm add`.

## The lint step

`brock lint` is the eslint step of an app's `lint` script (`brock lint && stylelint ... && brock prose && brock knip && jscpd .`). It runs the eslint of the app, with the config the app already has, and costs less than `eslint .` in three ways.

- **Changed files by default.** A run with `CI` unset lints the files changed since the merge base with the default branch (`origin/HEAD`, else `origin/main`, `origin/master`, `main`, `master`; `BROCK_LINT_BASE` names another), including uncommitted and untracked files, and skips deleted ones. `CI` set or `--all` lints the whole tree. `--changed` forces changed mode under CI. Files named on the command line lint just those. `--all` and `--changed` together are an error. The whole tree is linted anyway when a changed file is an `eslint.config.*`, `standards.config.*` or `standards.extension.*` file, a `tsconfig*.json`, a `package.json`, a lockfile, `pnpm-workspace.yaml`, `.npmrc` or anything under `lint-config/`, because any of those can change every result, and when more than 300 files changed. The first line names the mode and the file count, for example `brock lint: changed mode, 12 files changed since 1a2b3c4d (merge base with origin/main)` or `brock lint: full tree (CI is set), 2410 files`.
- **A content cache.** Local runs add `--cache --cache-strategy content` with the cache under `node_modules/.cache/brock` (`BROCK_LINT_CACHE_DIR` moves it; full and changed runs keep separate files). CI and `--no-cache` skip it. eslint decides a cache hit from the file and the config alone, so a type-aware or cross-file rule can keep an old result after another file changed; the CI run is uncached and is the gate.
- **A memory ceiling.** The eslint child, and `brock knip`, start with `NODE_OPTIONS` gaining `--max-old-space-size=2048`. `BROCK_LINT_MEMORY_MB` sets another size. A heap flag already in `NODE_OPTIONS` wins and nothing is added.

The steps that need the whole tree stay whole-tree: the typecheck (tsc), jscpd, knip, prose and `brock structure`. They compare files with each other, so a changed-files list would hide the findings that matter. Type-aware rules share one TypeScript project service per run (`projectService` in `@drizztdourden08/standards`), so eslint does not build a program per file.

## How the pieces work

- `config.mjs` has no Node imports on purpose: the renderer bundles `brock.config.ts` through `src/product.ts`, so everything it reaches must be browser safe. `defineBrockConfig` is an identity function; validation happens in `defineProduct`. Loading from disk lives in `load-config.mjs`, which imports under Node's type stripping, so `brock.config.ts` keeps to erasable TypeScript.
- `run.mjs` resolves every tool from the app root, so the app's own electron-vite and Electron run, and bins run through the current Node executable instead of a shell shim. Outside an Electron process `require('electron')` returns the binary path read from the package's `path.txt`. On Windows pnpm is a `.cmd`, which needs a shell to start.
- `ensure-electron.mjs`: `node_modules/electron` is two parts, the JS shim and the downloaded binary in `dist/` plus `path.txt`, and either can go missing on its own; both look like an opaque `Error: Electron uninstall` from electron-vite. Repair order: run `install.js` when the shim is intact but the binary is missing or stale; when the shim is broken, remove the package and run `pnpm install --force` first. A failing `install.js` is swallowed because the post-repair check reports what is still wrong. Locked files are reported, never force-killed, because an app may be running from the tree.
- `vite-config.mjs`: the renderer has two pages (the app and the splash window page) in one output folder so both reach `./logos/*` the same way. The preload build adds `splash-preload` from `@drizztdourden08/brock-electron/splash-preload`. The `splash/` plugin is the one splash generator: it writes `splash.html` (served by the dev server, emitted by the build) and never touches `src/index.html`. The page is static HTML: Tessera's token stylesheets and the app theme (`theme.css` of `tessera.config.json`, else `src/theme.css`) inlined as they are, the Inter subset and the Chakra Petch 600 face inlined from Tessera's own `@font-face` rules, the resolved look as `--look-*` custom properties (with `--look-dark-from` and `--look-dark-to` only for an app with colours of its own), then `splash/splash-page.css` (tokens only: the failure layout and the entrance, no background or text colour, so Tessera's `splash.css` paints the palette's dark gradient and its tested text) and a short script that listens to `window.brockSplash`. The name and mark come from `defineProduct`, so `window.title` and `logos.mark` defaults apply. An app that keeps its own `src/splash.html` builds that one instead.
- `installer/`: the installer template. `installer-inputs.mjs` resolves the config, the look and the stub colours once. `installer-theme.mjs` reads `theme.dark` from the Tessera `tokens.json` and falls back to the built-in colours, logging once. `stub-colours.mjs` maps the theme and the look to the colours `product.h` carries. `mark-png.mjs` takes Tessera's mark PNG, or rasterises the mark SVG with resvg, or takes `build/installer/header.png`, `setup-splash-png.mjs` draws the Setup splash (or takes `build/installer/splash.png`) on the ground `splash-ground.mjs` picks: the palette's dark gradient, or the `darkPair` of an app with colours of its own, with the dark ground mark and a name that holds 4.5:1, set in Tessera's title font through `title-font.mjs` (Tessera's TrueType copy, `fonts/chakra-petch/chakra-petch-latin-600-normal.ttf`, which `rasterise-svg.mjs` hands resvg beside the system fonts, by the family `font-family.mjs` reads from its name table; Segoe UI when it fails), `render-installer-preview.mjs` is `brock package --render-installer`, and `check-installer-folder.mjs` is the `brock structure` rule for `build/installer/`.
- `look/`: `appLook` loads brock-core's `product` and `look` entries through the app's Vite (`runnerImport` of one small virtual entry, since core ships TypeScript source that Node cannot import; the whole package took three times as long) and returns `defineProduct(product)` with `resolveLook(config, sources)` and `darkPair(look, sources)`. The splash plugin keeps that result per dev server (`appLookCache`), starts it when the server starts, and works it out again only when `brock.config.ts` or a file it reads changes (by modification time; `lookFiles` lists them), so `index.html` and `splash.html` no longer load brock-core on every request. `darkPair` is the dark splash ground: null for a Tessera brand gradient or palette, whose `--c-gradient-dark-from` and `--c-gradient-dark-to` apply, and for a `theme.css` that sets `--p-gradient-dark-from` or `--p-gradient-dark-to` itself; for `product.look` or seeds of the app theme, the two ends of the look darkened toward black until the palette's `--c-text-dim` (`palettes.<brand>.dark.textDim` in `tokens.json`, else `theme.dark.textDim`) reads at 4.5:1 on each. `loadLookSources` reads the Tessera brand gradient from `tokens.json` in the Tessera package (`brands.<brand>.gradient`, optional `angle`) when that file exists, and the `--p-primary` and `--p-black` seeds from the app theme, falling back to the brand palette (`src/tokens/palettes/<brand>.css` in Tessera), then to Tessera's `palette.css`. `themePalette(rootDir, brand)` names the brand palette the app shows (none once `theme.css` sets a seed); the installer reads that palette's `palettes.<brand>.dark` from `tokens.json`. `appThemeCss(rootDir)` (also the `/theme` entry, which the managed `stylelint.config.mjs` reads for its token file) names that theme: `theme.css` of the `tessera.config.json` at or above the app, with the app's `apps` entry merged in, through the app's own `@drizztdourden08/tessera/config`; `src/theme.css` when there is no such file or the installed Tessera has no config entry. A file that breaks the schema stops the build with an error that names it. The installer reads the same look.
- `boot/`: `scanBootTasks` lists `<id>.task.ts` in `src/boot` and `electron/boot`; `renderBootFiles` writes `.brock/boot.renderer.ts` and `.brock/boot.main.ts` for `brock sync` and `brock check`; `dev` and `build` rewrite them when a task file was added, renamed or removed. `brock structure` accepts `<id>.task.ts` as a module file. Brock and Tessera packages ship TypeScript source, so they are bundled instead of externalized; the exclude list is every `@drizztdourden08/*` dependency of the app.
- `widgets/`: `scanWidgets` lists `src/widgets/<id>.widget.tsx`, `<id>.kit.ts` and `<id>.overlay.tsx`; `renderWidgetsFiles` writes `.brock/widgets.ts` and `.brock/widget-kits.ts` (always, empty without widgets or kits) for `brock sync` and `brock check`; `widgetsPlugin` rewrites it on any change under `src/widgets`, and `dev` and `build` rewrite it before electron-vite starts. `checkWidgets` is the `brock structure` rule for the folder: widget, kit and overlay files only, kebab-case ids, a default export, known `meta` and kit keys, no built-in id, and a `meta.kit` that names a kit file. `regenerate-plugin.mjs` is the watcher both the screens and the widgets plugins use, and `write-changed.mjs` writes generated files whose content changed.
- `optimize-deps/`: `optimizeDepsPlugin` sets the renderer `optimizeDeps` on the dev server (never on a build): `rendererOptimizeDeps` joins React, the renderer entries of Tessera and of the installed Brock packages (their exports, less `main`, `preload`, `node`, `worker`, `cli`, `config` and file subpaths), and `crawlRendererDeps`, which reads every file under `src/` and the linked packages it imports (64 files at a time) and keeps each import that resolves into `node_modules`, written `<linked> > <dep>` when the app root cannot reach it. Under `electron-vite dev` the read starts when the config loads, so it runs while main and preload build. The plugin also sets `BROCK_DEV_DEPS_METADATA` to the optimizer's `_metadata.json`, which brock-electron reads to keep the Chromium cache.
- `build-options/`: `appAliases` turns `build.aliases` into the alias map of every Vite side, `nodePolyfillPlugins` loads `vite-plugin-node-polyfills` from the app, and `withAliasPaths` adds the aliases to the managed `tsconfig.json`.
- `dev-only/`: `devOnlyPlugin` sits first in main, the renderer, its workers and the web build. In a `production` build it loads each generated `.brock/<name>.dev.ts` as `devRegistryStub`, the same exports as empty lists, so no dev-only screen or handler group reaches the bundle, and it stops the build when any other module reaches a `.dev` file of the app.
- `gate/`: `gateSteps` turns `gate` of `brock.config.ts` into steps, `runGate` runs them all and returns the failed ones, `cargoSteps` builds the cargo lane (with `findCargo`, `cargoRoot`, `scanRust` and `runRustComments` behind it) and `workspaceGate` reads `gate` for a repo with no app, `clangFormatFiles` is the managed `.clang-format` for sync, `cSources` lists the C files, `findClangFormat` picks the binary and `runClangFormat` checks or rewrites in batches of 40 files.
- `builder-config.mjs` works on the raw product input and fills the defaults it needs (`artifactPrefix`, `fileAssociations`, `protocols`) the same way `defineProduct` does. It passes `protocols` to electron-builder (Info.plist `CFBundleURLTypes`, the `.desktop` `x-scheme-handler`), gives each file type a mime type (`application/x-<ext>` when none is set, since Linux needs one) and ships each file type's `build/<icon>.ico` as `resources/file-icons/<ext>.ico` on Windows, where the registry entry points. The managed `deb-postinst.sh` refreshes the mime and desktop databases for a product that declares a protocol or a file type, and the stub's `BROCK_REGISTERS_OS` has a portable install run `--os-integration=register`. With `icons.brand` set it points electron-builder at the copied set (`win.icon: build/icons/icon.ico`, `mac.icon: build/icons/icon.png`, `linux.icon: build/icons/linux`, `directories.buildResources: build`); without it the `ico`, `png512` and `png256` fields map to win, mac and linux as written.
- `icons/`: Brock owns no icon art. `copyBrandIcons` resolves `@drizztdourden08/tessera/package.json` from the app root, takes `brand/<brand>/` beside it and copies the set (`icon.ico`, `icon.png` from the 1024, `png/icon-<size>.png`, the same sizes as `linux/<size>x<size>.png` (the names electron-builder reads from an icon folder), `maskable-512.png`, `android/*`, `splash/*`) into `build/`, plus `icon.svg`, `icon.ico` and `icon-256.png` into `public/logos/` for the About screen and the window icon, `icon-32.png` and `icon-24.png` for the title bar (`product.logos.app` defaults to `./logos/icon-32.png` with a brand, so the 20 px logo is not a 256 px image scaled down), and `brand/dark-ground/<brand>.svg`, the mark without its tile in the colours Tessera draws it on the dark splash ground, as `public/logos/mark.svg` for the splash page and the boot failure splash.
- `icons.rim` (`'light'`) picks Tessera's rimmed set: `brand/light-rim/<brand>/` and `brand/light-rim/<brand>.svg`, which mirror the plain layout, carry a thin outline in the rim colour and are never tiled. It defaults to `'light'` for the `brock` brand, the light rim on dark surfaces, and to no rim for any other brand. `brandRim` resolves it from the raw config, `brandFolder` names the folder, and every reader takes it: `brock icons` (with `dev` and `build`), so the window icon, `public/logos`, `build/icons` and the bot variant all come from that tree (the splash mark comes from `brand/dark-ground/` whatever the rim), and the installer's downloader mark (`mark/mark-256.png`, else `<brand>.svg`); the Setup splash takes the same files from `brand/dark-ground/`. `icons/bot/` then writes the instance variant a named instance shows: `icon-bot.svg`, `icon-bot-256.png` and `icon-bot.ico`, the brand icon with a bot badge in the corner, drawn with pngjs and a small ICO writer. A brand folder with a `bot/` set of its own (`icon.svg`, `png/icon-256.png`, `icon.ico`) is copied instead. A file whose destination already holds the same bytes is skipped, so switching to a rim recopies the set and redraws the bot variant; `--force` copies all. `dev` and `build` run the same copy first, so a fresh clone gets its logos on the first run. A missing Tessera package or brand folder fails with the path it looked for.
  `icons/filetype-icons.mjs` adds the file type icons: for each `product.fileAssociations` entry whose extension or name matches a folder of `brand/<brand>/filetypes/`, `icon.ico`, `icon.icns` and `png/icon-<size>.png` (16 to 512) go to `build/filetypes/<ext>.ico`, `build/filetypes/<ext>.icns` and `build/filetypes/linux/<ext>/<size>x<size>.png`, and `createBuilderConfig` names `filetypes/<ext>` as the `icon` of each association that sets none once the `.ico` exists. `brock sync` ignores `build/filetypes/` with the other generated icon files.
- `modules/resolve.mjs` finds a package whose exports map hides `package.json` by walking `node_modules` up from the app root. Missing packages are reported, never thrown, so the caller decides: the CLI fails, the scaffolder warns and continues. `specifierFor` returns the package's exports key when one points at the manifest subpath, else the file path inside the package.
- `modules/generate.mjs`: a module contributes to a side (main, preload, renderer) only when its manifest names a subpath for it. The arrays are empty when the app has no modules, so the app code that imports them never changes. `identifierOf` turns `port-kit` into `portKit` plus the side suffix.
- `modules/sync.mjs` leaves the manifest's `generatedAt` out of the drift comparison, so a check passes on a tree synced at another time. A managed file is regenerated verbatim: an app that needs a different shape changes the factory call's arguments through a Brock release, not the file.
- `modules/prepare-modules.mjs` runs each listed module's manifest `prepare` script before `dev` and `build`, with the module package as its folder; a failing step is reported and the command goes on. `modules/module-packaging.mjs` turns the manifest `extraResources` into electron-builder entries with absolute `from` paths, and each `packExclude` glob into a `!**/node_modules/<package>/<glob>` line under `files`. `loadBuilderConfig` adds both.
- `commands/add.mjs` edits `brock.config.ts` textually and touches only the `modules: [...]` array literal; a one-entry-per-line array keeps the indentation of its first entry and the trailing comma. A built-in id is looked up in the registry; anything else is an npm spec and the id then comes from the installed package manifest.
- `brock build` writes `dist/electron`, `dist/preload` and `dist/renderer`; `brock package` is the release step on top of it.
- `packaging/`: `commands/package.mjs` runs the build, electron-builder with `--config electron-builder.config.cjs` for the current OS, the Setup splash and `vpk pack`. `vpk-args.mjs` builds the pack arguments from the product and `product.installer` (pure, so it is the part to test), `run-vpk.mjs` finds `vpk` in `~/.dotnet/tools` before `PATH`, `name-pack-outputs.mjs` gives the downloads their release names and fails when vpk's own naming moved, `build-installer-stub.mjs` writes `product.h` (`stub-product-header.mjs`), the resource script, the icon, the mark and the licence text into `release/installer-stub` and compiles `installer-stub/` with `cl.exe` through `vcvars64.bat`, `write-install-manifest.mjs` writes the install manifest, `ship-installer.mjs` runs both after a Windows pack, and `after-pack.mjs` is the electron-builder hook that prunes the foreign Velopack bindings and unused Electron DLLs and stamps the exe icon with rcedit.
- `release/`: the workflow Builder. `composeWorkflows({ targets, appDir, prefix, systemSteps, baselines })` expands the targets, asks each chosen platform for its CI job and its release job, and fills `ci-workflow.yml.tmpl` (the `quality` and `review` jobs every app gets, then the platform CI jobs) and `release-workflow.yml.tmpl` (the `prepare` job, the platform build jobs, then `release` with `needs` and the Downloads list built from each job's downloads). `setup-steps.yml.tmpl` is the checkout, pnpm, Node and install every job starts with; a module's manifest `ci` steps go in before the install on the runners whose `os` matches. `collectWorkflowSteps` checks the step lists of the modules (`brock.workflows`), the repo command's plugins and the app (`workflows.steps`), and each job splices them in at its step points through `ctx.setup` and `ctx.stepsAt`. `brock sync` writes both files for a standalone app; `brock adopt` writes `release.yml` once for a repo with `apps/<app>`. An app's release notes live in the `release-notes/` folder beside its `brock.config.ts`; when the app folder has none and the repo root has one, Brock reads the root's and prints one line saying so. `releaseLayout` resolves it once (`notesRoot`, `notesDir`, `notesAtRoot`, through `resolveNotesRoot` of brock-thread), and `brock release`, `brock release-notes check` and the workflows' `NOTES_DIR` all read that answer.
- `platforms/`: one Strategy per platform, `<id>/<id>.platform.mjs`, each built with `definePlatform({ id, label, doctor, scaffold, ciJob, releaseJob, secrets, secretsHint, managed })`, one step per file. See Platforms below.

`brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test: the
window opens off screen and unfocused, and the app writes under `<dir>`. Add `--review` for the
automated review, which writes `<dir>/Data/review/review/report.md` and exits 1 on a failed check.

## The server kind

An app with `server` in `targets` is built by `brock server build` (Vite SSR, one file in `dist/server/main.mjs`), started by `brock server dev` and packaged by `brock server package [--arch x64,arm64] [--deb]` into `release/server`. `brock platform add server` adds the target and writes `server/main.ts`, `server/start.ts` and, for an app with a window, the boot task that embeds the server. The design, the packaging and the security notes on the deb unit and the account checks are in `docs/architecture.md`, section The server kind. The pinned Node and the workflows follow.

## Server packaging: the pinned Node

`brock server package` bundles a Linux Node binary. Brock pins the sha256 of the official `node-v<version>-linux-<x64 | arm64>.tar.gz` archives of its default version in `SERVER_NODE_SHA256` (`src/platforms/server/server.constants.mjs`). The download must match the pin, and `SHASUMS256.txt` from nodejs.org must agree with it; either mismatch stops the build before anything is staged. A `server.node` version that Brock does not pin is checked against `SHASUMS256.txt` alone.

To move the default Node version:

1. Pick the release on nodejs.org and open `https://nodejs.org/dist/v<version>/SHASUMS256.txt`.
2. Copy the two lines for `node-v<version>-linux-x64.tar.gz` and `node-v<version>-linux-arm64.tar.gz`.
3. Set `SERVER_NODE_VERSION` and the two hashes in `SERVER_NODE_SHA256` to match. Better still, download the two archives yourself and run `sha256sum` on them, so the pin does not rest on the same file it cross-checks.
4. Run the server tests, then add a changeset.

## Server workflows

An app with `server` in `targets` gets three jobs from `brock sync`. A desktop-only app gets none of them, and its `ci.yml` and `release.yml` stay byte for byte what they were.

- CI job `server`: `brock server build`, then the bundle starts on a temporary data folder, the job waits up to 30 seconds for `main.mjs health` to exit 0, and stops the server. A server that exits early or never reports healthy fails the run. An app whose only target is `server` has no `review` job, since there is no window to launch.
- Release job `build-server`, on ubuntu-24.04: `brock server package --arch <server.arch> --deb`. It uploads `<prefix>server-linux-<arch>.tar.gz` and `<prefix>server_<version>_<arch>.deb` as the `release-server` artifact, so the release job attaches them and links them in the release body. It uploads the Docker build context as the `server-docker` artifact, which the release does not attach. `server.arch` is `['x64']` unless the app lists `arm64` too.
- Image job `publish-server-image`, after the release job (`needs: [prepare, release]`), so no image exists for a release that failed. It is the only job with `packages: write` (and `contents: read`); the workflow keeps `contents: write` and `packages: read`. It builds the `server-docker` context with docker buildx and pushes `<image>:<version>`, plus `<image>:latest` only when the run has `set_latest` on. A draft or pre-release never moves `latest`. QEMU is set up only when `server.arch` has `arm64`. The image is built for `linux/amd64`, plus `linux/arm64` then.

The image is `server.image`, or `ghcr.io/<repo owner>/<product.id>-server` with the owner in lower case. The job logs in to `ghcr.io` with `GITHUB_TOKEN`, so `server.image` must live under `ghcr.io/`; `brock sync` refuses another registry. A new GHCR package starts private. To make it public, open the package on GitHub (the Packages list of the repository), choose Package settings, then Change visibility. GitHub offers that switch on the settings page only.

The Docker actions are pinned to full commit SHAs in `src/platforms/server/server-actions.constants.mjs`, and the generated workflow names the version beside each pin:

| Action | Version | Commit |
|---|---|---|
| docker/setup-qemu-action | v4.4.0 | 99012661954931238ded8c8b007157a8430204e1 |
| docker/setup-buildx-action | v4.4.1 | f87e5991a6d7451dcb8d9637bfbc97413f497069 |
| docker/login-action | v4.6.0 | dbcb813823bdd20940b903addbd779551569679f |
| docker/build-push-action | v7.4.0 | c3c9e263c25d99ce0380d002d59b67737d91b0dc |

To move a pin, take a release at least two weeks old, read the commit its tag points at, and change the `sha` and the `version` together. Steps an app adds with `workflows.steps` reach the server jobs through `platforms: ['server']`, or `jobs: 'server'` in CI and `jobs: 'build-server'` in the release.

## Ports and the dev server

The Vite factory reads `product.ports.base` (or `derivePortBase(product.id)` when unset) and the checkout's port slot, and sets the renderer `server.port` to `base + 10 x slot` with `strictPort` from `product.ports.strict`, true by default. `devServerPort(rootDir, product)` returns that pair. The scheme lives in brock-thread (`/ports`); `portFor`, `portSlotOf`, `derivePortBase` and `PORT_OFFSETS` are re-exported here.

## Unit tests

Brock packages ship TypeScript and TSX source, so an app's vitest compiles brock-react, brock-core and Tessera itself. Vitest's esbuild uses the classic JSX transform when no tsconfig sits beside a file, and a package under `node_modules` is not compiled at all by default, so importing brock-react in a test failed with `React is not defined`. `defineBrockVitestConfig` from `/vitest` fixes both: esbuild `jsx: 'automatic'` with `jsxImportSource: 'react'`, `test.server.deps.inline` for every `@drizztdourden08/*` package, react, react-dom, zustand and Tessera deduped, and the `@app` and `build.aliases` aliases of `brock.config.ts`.

An app whose `package.json` has a `test` script gets a managed `vitest.config.ts` from `brock sync` (`brock check` reports drift). A `vitest.config.ts` the app wrote itself, without the managed header, is left alone: call the factory there, `export default defineBrockVitestConfig(import.meta.dirname, { test: { include: [...] } })`. A repo root that runs vitest over several packages does the same, and the factory needs no `brock.config.ts` there.

## App e2e tests

`--review` covers the shell. For checks only the app knows, `launchAppForTest` from `/testing` starts the built app the way the review does, headless:

```ts
import { launchAppForTest } from '@drizztdourden08/brock-build/testing';

const { page, close } = await launchAppForTest({ appDir: join(import.meta.dirname, '..') });
await page.getByRole('button', { name: 'Settings' }).click();
await close();
```

It refuses first when `dist/electron/main.js` or a chunk beside it imports a package or a file Node cannot find from there, and lists each one. It then runs the app's own Electron with `--no-focus --muted` and a fresh `--user-data` under the system temp folder, waits for the app window, the one that loads the renderer index and not `splash.html` or a widget window, and for the splash to close, which means every boot task resolved and the window was revealed (60 s by default). It puts the tail of the main output in the error when that fails, and says when the splash was still open. `close()` quits and removes the folder. Playwright is an optional peer: add `playwright-core` (or `playwright`) to the app's dev dependencies.

```ts
const { app, page } = await launchAppForTest({ appDir });
const dock = await readDockLayout(page);   // { layout, docked, floating, popped, main, rects }
const popped = await widgetWindows(app);   // [{ id, bounds, visible, focused, minimized, alwaysOnTop }]
```

`readDockLayout` reads brock-react's widget layout store through a reader the renderer installs on automation launches only, plus the rect of the main view and of each drawn widget. `widgetWindows` reads every popped widget window's state from main. Neither depends on Tessera's class names.

## brock adopt

`adopt` pins `package.json#brock.version` to its own version when the repo has no pin, and prints it. That is where an app that was never on Brock starts: `brock migrate` and `upgrade` run only the migrations after the pin, and `brock migrate` refuses an app with no pin at all instead of running every migration since 0.1.1 over code Brock never wrote.

Beside the lint configs and the repo command, `adopt` writes `tessera.config.json` at the repo root when it is missing: `$schema` alone for a single app, pointing at Tessera's schema wherever Tessera is installed (the root `node_modules`, else `packages/design`, else any workspace package); with a `packages/design` package, `package` set to its name, `parts` pointing at its `src/primitives`, `src/composites` and `src/compounds`, and an `apps` entry per app for its `src/views` (and its `src/theme.css` when it has one). `--force` never replaces it. The root `stylelint.config.mjs` takes every theme that file names as a token file. It also writes `knip.json` with `brock.workspace.mjs` as an entry, `.worktrees/**` ignored and, with `--local`, `@drizztdourden08/brock-thread` in `ignoreDependencies`. It appends to `.gitignore` every generated output it lacks: `node_modules/`, `dist/`, `release/`, `.user-data/`, `.brock-port-slot`, and at any depth `build/icons/`, `build/splash/`, `build/installer-splash.png`, the eight generated `public/logos` files and `.brock/profile-config.json`. It writes no splash or logo markup, and prints the app pages (`src/index.html`) that still hold a hand-written boot splash or `./logos/` path.

## What sync writes

```
.brock/modules.main.ts        MainModule[]        from each module's manifest `main`
.brock/modules.preload.ts     PreloadNamespace[]  from `preload`
.brock/modules.renderer.ts    RendererModule[]    from `renderer`
.brock/manifest.json          brock version, modules, timestamp
electron.vite.config.ts       defineBrockViteConfig(import.meta.dirname)
electron-builder.config.cjs   loadBuilderConfig(__dirname)
eslint.config.mjs             brockEslint({ ... })
stylelint.config.mjs          brockStylelint({ ... })
.markdownlint-cli2.mjs        brockMarkdownlint()
tsconfig.json                 extends the lint-config react base
package.json                  brock.version, and every Brock dependency on it
.github/workflows/ci.yml      composed from the targets (standalone app only)
.github/workflows/release.yml composed from the targets (standalone app only)
vite.web.config.ts            defineBrockWebConfig(import.meta.dirname), for web or android
capacitor.config.json         appId, appName, webDir dist/web, android.path mobile/android (and includePlugins when a built-in module is out of modules), for android
build/linux/deb-postinst.sh   module udev rules and build/linux/after-install.sh, for linux
.clang-format                 at the repo root, while gate.clangFormat names C sources
.brock/screens.dev.ts         the dev-only screens, while src/screens holds a .dev file
.brock/handlers.main.dev.ts   the dev-only handler groups, while electron/handlers holds a .dev file
```

The two `.dev.ts` registries are written only while a dev-only file exists, and removed with the last one. The `tsconfig.json` paths carry `build.aliases` after `@app`.

`brock.version` in `package.json` is the one Brock version an app runs. Sync adds it
from the installed `brock-build` when it is missing. It then sets every
`@drizztdourden08/brock*` and `create-brock` dependency with a registry spec to
`^<version>`. A `link:` or `workspace:` spec stays as it is, and a workspace member
whose Brock packages are all `workspace:` gets no pin. `brock adopt` and
`create-brock` write the pin the same way. Tessera is not a Brock package and keeps its
own spec.

Each module import is the package's exports key that points at the manifest file, or
the file path inside the package when no key does. The imported binding is the
subpath's default export. `--check` compares every file but the manifest's timestamp
and exits 1 on any difference.

## Migrations

A breaking change ships a migration: an idempotent codemod over the files the app
owns. `brock migrate` collects them, orders them by version and runs each one.

- brock-build keeps its own in `migrations/<version>/<id>.mjs`. A module lists its
  own in its manifest: `brock.migrations: [{ version, entry, summary }]`, with `entry`
  relative to the package folder.
- A migration file exports `migration`: `{ id, summary, files, apply }`, `{ id, summary, workspace }`, or both. `files` is a
  RegExp over root-relative paths. `apply({ path, source })` returns
  `{ source, todos, rename? }`; a changed `source` is written back, a `rename` path moves
  the file there (or becomes a to-do when that path exists), and each
  `{ line, message }` in `todos` becomes a numbered to-do.
- `workspace({ rootDir })` is for a change no single file can make, such as a new package: it may create, move and
  rewrite files anywhere in the repo and returns `{ touched, moved, todos }`, every path relative to `rootDir`.
  It runs before the migration's own `apply`, and the owned files are read again after it. Within one version
  the file steps of every migration run first and the workspace steps last, so codemods see each file where it
  was; an earlier to-do whose file sits under a `moved` path follows it.
- Owned files are everything but the files sync writes, the launcher and the
  generated folders (`node_modules`, `dist`, `out`, `release`, `.brock`, `.user-data`,
  `.worktrees`).
- A change the codemod cannot make safely is a to-do, never a guess. The runner
  records every file each migration touched; `--report` writes that and the to-dos as
  JSON for the upgrade verb. Its path is relative to the current directory, never to
  `--root`, and the command prints where it wrote it.
- `src/upgrade/codemods/` holds the helpers: `findJsxProps` reads a JSX element's
  props, with type arguments and nested braces, `removeSpans` deletes them and the
  lines they leave empty, and `patternTodos` turns each match of a list of rules into a
  to-do on its line, for a change that only the app author can make. `importMoves`
  takes a list of `{ from, to, names }` module moves and rewrites each named import and
  `export { … } from` re-export of those names: it splits a mixed list, joins an import
  of the same kind (type or value) already on the new module, drops a name that import
  already holds instead of writing it twice, and leaves a default import, a namespace
  import and `export *` where they are.

The 0.1.1 folder holds these, each with a test in `tests/`:

- `brock-app-logo-src` removes a `logoSrc` or `instanceLogoSrc` prop that `BrockApp`
  no longer takes when it holds the default path. Any other value becomes a to-do that
  names the `product.logos` field to set.
- `base-setting-controls` gives the `windowMode` and `masterVolume` setting rows the
  control a non-boolean row now needs, when the item sits on one line.
- `menu-built-in-about` drops an app menu entry that only repeats the built-in About
  entry, and flags one that replaces it without an icon.
- `gitignore-generated-files` adds the bot logos, the installer splash and the
  profile store and the port slot file that newer Brock writes to `.gitignore`, so an
  upgrade never commits them.
- `removed-shell-exports` turns each import of a shell export Tessera replaced into a
  to-do naming the composite to use.
- `custom-layer-rename` (breaking) renames each root `src/screens/<id>.custom.tsx` to
  `<id>.layer.tsx`, since `.custom.tsx` now names a custom page inside a bucket. The
  report lists each `old -> new` path.
- `knip-custom-pages` adds `src/screens/**/*.custom.tsx` to the knip entries after
  `src/main.tsx`, since the build reads a custom page's `searchEntries` instead of
  importing it.
- `widget-layout-v2` (breaking) flags code that still patched a widget through the
  layout store's `update`, read the flat `layout.widgets`, passed `topOffset` or
  `onUpdate` to `WidgetManager`, or gave `widgets` to `StandardOverlays`. Stored layouts
  need nothing: the host runs `migrateLayout` on load.
- `hero-slots` (breaking) flags a hero page that fills `Facts` with children, which now
  takes `rows`, or puts its heading inside `Backdrop`, which is now the scene behind the
  Hero composite.

The 0.2.0 folder adds `design-package` (a workspace step). A single-app repo gets a
root `tessera.config.json` with `$schema` alone. A monorepo (apps under the workspace
globs) gets `packages/design` named `@<scope>/design` (scope from `brock.workspace.mjs`,
else `brock.scope`, else the root package name) with `package.json`, `tsconfig.json`, a
barrel `src/index.ts` and empty `src/primitives`, `src/composites` and `src/compounds`;
a root `tessera.config.json` with `package`, `parts` there and an `apps` entry per app
(`src/views`, and `src/theme.css` when the app has one); and a `packages/design` entry in
a `knip.json` that lists workspaces. Each app compound moves to
`packages/design/src/compounds` only when its own imports stay inside it, reach another
compound that moves too, or name a package the app lists, its `index.ts` holds only
`export { ... } from` lines, and every import of it elsewhere goes through that
`index.ts` from an import statement. Those imports become `@<scope>/design`, joined into
one statement per file, and each package that holds one gains the dependency. Any other
compound stays, with a to-do naming each import that keeps it; a component folder or
file in an app's `src` outside the parts folders and Brock's own folders is a to-do too.

The 0.7.0 folder adds two, each with a test in `tests/`:

- `title-bar-actions` (breaking) rewrites `RendererModule.titleBar`, whose slots the
  title bar no longer draws, where that is mechanical: `UpdateBadge` becomes
  `titleBarActions: [useUpdateAction]` with its import, and `SearchButton` and
  `BugReportButton` drop out because Search and Report a bug are standard actions. Any
  other slot, `TitleBarSlot`, `STANDARD_TITLE_BAR_SLOTS` and `.conditional = true` become
  to-dos naming the `WindowTitleBarAction` API.
- `gitignore-title-bar-logos` adds `public/logos/icon-32.png` and `icon-24.png` beside
  an ignored `icon-256.png`.

### Tessera renames

Tessera ships `RENAMES.json`: its renamed custom properties, components, classes, props,
prop values and config keys, its removed exports and its parts that changed entry point,
grouped by release, oldest first. After the
Brock migrations, `brock migrate` replays it over the app's code (`src/upgrade/tessera/`),
and `brock upgrade` gets it through the `brock migrate` step of its gate.

- Range: from `--tessera-from`, else `package.json#brock.tessera` (the Tessera version
  the code was last replayed to), else `0.3.0`, the baseline; up to the installed
  Tessera's `package.json` version. Each release in that range replays in order. A
  `next` release (Tessera linked to main) replays every time; the pin is still the
  installed version. `brock upgrade` passes `--tessera-from` with each app's own pin, else the
  root's, else the Tessera version installed before the upgrade. The step then writes
  `brock.tessera`.
- An entry whose value is also a key of the same release would rename twice on a second
  replay, so it is skipped with a warning.
- Files: `.ts`, `.tsx`, `.mts`, `.mjs`, `.css` and `.json` (not `package.json`) under the
  app's `src`, `electron` and `tests`, and in every workspace package of its monorepo that
  depends on Tessera (its `package.json` names it, or its `node_modules` holds it), through
  the owned-files walk. A file whose head says it is generated is skipped. Scripts are
  parsed with the app's TypeScript compiler API, else Brock's.
- Each map is one pass, longer keys first, so a renamed name is never renamed again:
  - `cssCustomProperties`: the whole `--token` (not followed by a name character), in
    stylesheets, every script string and JSON.
  - `components`: only a name imported from `@drizztdourden08/tessera*` in that file;
    the import, its JSX tags and its type and value references. An aliased import
    renames the imported name alone; a re-export is a to-do for its importers.
  - `components` in a usage file (`<Name>.usage.ts`, which `tessera guide` reads): the
    `use` of each `avoidWhen` entry names a part in a string, so it is renamed when it is
    a key, and a note there is a to-do. The `example` string is code that the guide
    compiles, so it replays as a file of its own: its Tessera imports, their references
    and the release's moves, written back with the escapes its quotes need. No other
    string of the usage file changes, and a `use` key anywhere else is left alone.
  - `cssClasses`: selectors in stylesheets (`.old` not followed by a name character,
    outside comments, strings and `url()`); class tokens in strings under a `class*`
    JSX attribute, a `cx`, `cn`, `clsx` or `classnames` call or a `*Class(Name)(s)`
    binding; and `.old` in other strings, such as a `querySelector` selector. A
    class-list value (`range-slider` to `slider slider--range`) writes every class.
    A longer name built from a key that RENAMES.json does not list
    (`tab-bar__strip`, `` `tab-bar--${tone}` ``) is a to-do, and so is a string that is
    exactly an old class anywhere else.
  - `props` `Component.prop`: the JSX attribute on that Tessera component, when the
    new value is a bare prop name (`CommandInput.aria-label` to `label`) or a prop of
    the same component or of its plain rename; otherwise a to-do.
  - `props` `Type.prop` on object literals (`SettingsRowAction.onClick` to `onSelect`):
    the prop, method or shorthand (`onClick` becomes `onSelect: onClick`) of an object
    literal whose type is that Tessera type, or its `TypeProps` type for a component
    key, declared by Tessera's own package. The type
    is the literal's contextual type from the TypeScript checker, else its own type, so
    an annotation, `as`, `satisfies`, a return type, a call argument, an array element
    and a JSX prop value all count. A new value that is a bare name or `Type.newProp`
    is written; a note is a to-do on the prop. The checker runs once per release, over
    only the files holding an object literal with a prop some key names, or naming a
    component a wildcard key covers, and only those literals are asked; files the
    program reads beside them are parsed once and shared between releases.
  - `props` `Component.prefix*` (`CommandInput.aria-*`, `CommandInput.on*`,
    `CommandInput.*`): every prop of that component starting with the text before the
    `*`, on its JSX attributes and on object literals typed as its props type. An exact
    key comes first, then the longest matching prefix, so `aria-label` follows
    `CommandInput.aria-label` and `aria-hidden` follows `CommandInput.aria-*`, not
    `CommandInput.*`. A prop the component still takes is left alone
    (`aria-describedby`, `onKeyDown`), and so is `key`: the checker reads the props
    type of the tag or the literal from the installed Tessera. When it cannot (Tessera's
    types do not resolve), a release's `keep` list (`{ "CommandInput": ["onKeyDown"] }`)
    stands in; without one, the to-do says Brock could not tell and asks to check. The
    value is always a note: each covered prop is a to-do naming the prop and the key,
    never a rename.
  - `propValues` `Component.prop`: a string literal the attribute can take (ternary
    branches, `??` and `||` fallbacks), under its old or renamed prop. A bare type key
    (`WidgetVisibility`) renames literals annotated with that Tessera type, `as` or
    `satisfies` it; any other string holding an old value is a to-do.
  - `removedExports`: a to-do at each import or re-export of the name.
  - `moves` `{ Name: { from, to } }`, run after the release's renames, so a key is the
    name after them and a type is listed on its own: `from` and `to` are `exports`
    subpaths of the Tessera package (`primitives`, `composites`, `brand`, `data` and the others).
    The moves are grouped by pair and replayed with `importMoves`: an import or
    re-export of the name from `@drizztdourden08/tessera/<from>` takes it from
    `@drizztdourden08/tessera/<to>`. The root import never moves. The published
    `tessera-part-moves` (0.19.0) and `tessera-tier-moves` (0.23.0) migrations made the
    0.17 and 0.20 moves before RENAMES.json held them; they stay, and since a move finds
    nothing left to move and never repeats a name, the migration and the replay give the
    same imports in either order and on every rerun.
  - `configKeys`, grouped by file name (`tessera.config.json`, `package.json`): each key
    is a dotted path into that file, `*` standing for any one key such as an app folder,
    and the value is the path the same value moves to. Every such file at the app root,
    the repo root and each workspace package is edited in place: the key text is renamed
    where it stands when the parent stays the same, an object whose every key moves to
    the same new sibling is renamed whole, and anything else is cut and pasted at the
    indentation of its new place, with an emptied parent removed. The rest of the file,
    its order, layout and indentation, stays as it was. A target path that is already set
    is never overwritten; it becomes a to-do.
- A value that is not a name (it has spaces or parentheses, such as
  `Slider (with range; see MIGRATION.md)`) is never written: each occurrence becomes a
  to-do with the note. Rerunning the step changes nothing it already changed.
- The report is the migration report: one `tessera-renames` entry per release, its
  to-dos numbered after the Brock ones, and a `tessera` summary with the range, the pin
  and the warnings.

#### A copy of the design system

`brock migrate --tessera-from-copy <folder> --map <file> [--alias <alias>]...`
(`src/upgrade/tessera-copy/`) is for an app that imports its own copy of what became
Tessera instead of the package. `<folder>` is relative to `--root`; each `--alias` is an
import alias for it (`@ds`). The command holds no table of any one copy: `--map` names a
JSON file, relative to the current directory, that `readCopyMap` reads (the format is in
docs/upgrading-an-app.md): `from`, the release the copy matches (0.3.0 when left out),
`entries`, folder of the copy to Tessera entry point, `stylesheets`, `attributes`, props
a copy component gains, and `overlay`, rename entries added to a release.

- Refusals: no `--map`, a map that is missing, not JSON or names no Tessera entry point,
  the folder is missing, Tessera is not installed (its `RENAMES.json` drives the run),
  TypeScript is not installed, or `--tessera-from` is given too.
- Scope: every owned `.ts`, `.tsx`, `.mts`, `.mjs` and `.css` under `--root` outside the
  copy, generated files skipped.
- Imports (`tessera-copy` entry): a named import or `export { … } from` whose path
  resolves into the copy, relative or through an alias, takes the entry the map gives the
  deepest folder that holds it, and a mapped stylesheet takes its Tessera stylesheet.
  Imports of one entry and kind join into one statement. A tag of a component the map's
  `attributes` names gains the props it lacks. A namespace or default import, an
  `export *`, a side-effect import of an unmapped file, any other string that names a
  copy path, a stylesheet `@import` or `url()` into it, and every copy reference in a file
  that already imports Tessera are to-dos, left as they are.
- Renames: the Tessera renames step runs from the map's `from` to the installed version
  over the converted files, and on the first run (no `brock.tessera` yet) over every other
  file in scope that does not import Tessera, with the map's `overlay` over each release.
- Check (`tessera-copy-check` entry): the TypeScript checker lists what each Tessera
  entry exports. In a converted file, an imported name its entry lacks moves to the entry
  that has it (`importMoves`); a name no entry has is a to-do unless a rename note or a
  removal already flags it; a name some replayed release renamed away and Tessera now
  exports as another part, with no later rename giving it back, is a to-do.
  Every config file (`tsconfig*.json`, `*.config.*`) line that names an alias or the
  folder, and the folder itself, end the list.
- A second run converts only what is left and changes nothing it already changed.

## Platforms

Each platform is a Strategy in `src/platforms/<id>/`. The CLI and the workflow Builder only
walk the chosen strategies; neither names a platform.

| Platform | doctor | scaffold | CI job | release job | secrets |
|---|---|---|---|---|---|
| windows | .NET 8 SDK, vpk, MSVC C++ tools (on Windows) | brand icons | none | `build-windows`: `brock package` on windows-latest, vpk, the small installer | none |
| macos | Xcode command line tools (on macOS) | brand icons | none | `build-macos`: dmg and zip, ad hoc signed | none |
| linux | .NET 8 SDK and vpk (on Linux), module libraries | brand icons; `build/linux/deb-postinst.sh` through sync | none | `build-linux`: deb and the vpk AppImage | none |
| android | JDK 21, `ANDROID_HOME`, `platform-tools`, `platforms;android-36`, `build-tools;36.0.0`, plus the modules' `android.sdkPackages` | no `capacitor.config.ts` or `.js`, Capacitor packages, ignore lines, `cap add android`, `@capacitor/assets`, the module Android sides, Gradle signing, `versionCode` | none | `build-android`: JDK 21, setup-android, `brock mobile build --release` | `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` |
| web | nothing beyond Node and pnpm | `build:web` and `dev:web` scripts | `web`: `brock web build` | `build-web`: `dist/web` zipped | none |
| server | `dpkg-deb` (on Linux) | `server/main.ts`, `server/start.ts` and `server/data-domains.ts`, and the embedding boot task `electron/boot/server.task.ts` for an app with a window; knip entries | `server`: build, start, wait for `health` | `build-server`: tarball and .deb per `server.arch`; `publish-server-image` after the release | none (the image push uses `GITHUB_TOKEN`) |
| ios | reserved: choosing it says it is not supported yet | | | | |

- `doctor` checks run on the machine and only report: each result is `ok`, `missing` with the install command for this OS, or `skip` when the check belongs to another OS. `brock doctor` exits 1 when anything is missing. A module adds its own through its manifest `doctor` entries (`name`, `os`, `probe`, `install`); the input module checks `pkg-config --exists libusb-1.0` on Linux and macOS.
- `scaffold` steps are `files` steps (edit the tree, may ask for an install) or `tools` steps (need `node_modules`). Each returns `done`, `skipped`, `pending` or `failed` and skips what is already there, so `platform add` can run again. A step two platforms share runs once.
- Android lives in `mobile/android` with `capacitor.config.json` at the app root, so `cap` runs from the app's own `package.json` and finds its plugins there. The first scaffold step fails while a `capacitor.config.ts` or `capacitor.config.js` sits at the app root: the Capacitor CLI reads those before the JSON, so the managed file would be ignored. An app that had one moves its Android project as docs/upgrading-an-app.md (Android) says. The Gradle patches read `BROCK_KEYSTORE_FILE`, `BROCK_KEYSTORE_PASSWORD`, `BROCK_KEY_ALIAS` (and `BROCK_KEY_PASSWORD`, which falls back to the store password) from the environment or Gradle properties; without them a release stays unsigned. `versionCode` is `major * 10000 + minor * 100 + patch` of `package.json`. `<app> mobile keystore` (brock-thread) makes the keystore with `keytool` once you agree and prints the `gh secret set` lines; it never runs them.
- A module ships its Android side as a Capacitor plugin: an `android/` Gradle library and `package.json#capacitor.android.src`, so `cap sync` wires it like any plugin. The module Android sides step runs `cap update android` when a module in `modules` has one and `mobile/android/capacitor.settings.gradle` does not include it yet. A built-in module that is installed but not in `modules` stays out: the managed `capacitor.config.json` then lists `android.includePlugins`, every declared package but those. A module's `brock.android.sdkPackages` (the input module's NDK and CMake) join the doctor's SDK packages.
- Linux: a module's manifest `udevRules` file and the app's own `build/linux/after-install.sh` become `build/linux/deb-postinst.sh`, which `brock sync` keeps and electron-builder runs as the deb `afterInstall`. The input module ships the controller rules (Nintendo, Sony, Microsoft, 8BitDo, `TAG+="uaccess"`).
- Web: `vite.web.config.ts` builds `src/index.html` with a relative base into `dist/web`, which Capacitor also wraps, and writes `manifest.webmanifest` from the product with the brand icons. There is no deploy job; the release carries the zip.

`brock platform add <id | bundle>...` writes the targets, runs the `files` steps, `pnpm
install` when a step asks, `brock sync`, the `tools` steps, then the doctor and the secrets
checklist for what it added. `remove` writes the targets, deletes the managed files only
the removed platforms rendered and runs `brock sync`; scaffolded folders such as
`mobile/` stay. `list` shows every platform, which are chosen and through which bundle.

## Module ids

`updater`, `secrets`, `input`, `display`, `port-kit` and `tools` map to
`@drizztdourden08/brock-<id>`. Any other `brock add` argument is an npm spec; the id
comes from the installed package's `package.json#brock.id`.

## brock.config.ts

```ts
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'Me' }, ports: { base: 41800 } },
  targets: ['desktop'],
  modules: [],
});
```

`product.window.titleBar.controls` turns title bar buttons off: `{ fullscreen, pin, minimize,
maximize }`, each `true` by default; close always stays. `maximize: false` also makes the main
window not maximizable, and `fullscreen: false` makes it not fullscreenable and turns F11 and
Alt+Enter off. `product.widgets.mainLabel` names the main view in the widget dock (default `Main`).
`product.widgets.keepFocusWithApp` (default `true`) keeps the keyboard with the app: a mouse
click on a widget's button, tab or slider no longer leaves the focus there, so the arrows, Enter
and Space keep driving the app. Tab still moves into a widget, and text fields keep the focus.
Set it to `false` to turn it off.

```ts
product: { /* ... */ window: { titleBar: { controls: { fullscreen: false, pin: false } } }, widgets: { mainLabel: 'Board', keepFocusWithApp: false } },
```

`targets` takes platform ids (`windows`, `macos`, `linux`, `android`, `web`; `ios` is
reserved) and bundles: `desktop` is Windows, macOS and Linux, `mobile` is Android today and
iOS once it is supported, with no config change. `web: { manifest: false }` drops the web app
manifest from the web build. `review: { baselines: true }` makes the CI review job compare its
captures with the `tests/baselines/linux` screenshot baselines and gives the CI workflow a `bless`
input that uploads a fresh set (docs/architecture.md, Screenshot baselines).

`build` sets options of the managed Vite configs, so the one-line `electron.vite.config.ts` and
`vite.web.config.ts` stay managed:

```ts
build: {
  aliases: { '@shared': '../../shared', '@ds': 'src/ui/design-system' },
  nodePolyfills: { globals: { Buffer: true, process: true } },
},
```

- `aliases`: import prefixes beside `@app`, each a folder relative to the app folder. Main, preload,
  the renderer, its workers and the web build resolve them, and `brock sync` adds `"<alias>/*"` to
  the managed `tsconfig.json` paths. `@app` stays Brock's. They are meant for a migration, while code
  moves into `src/` or a workspace package.
- `nodePolyfills`: `true` or the options of `vite-plugin-node-polyfills`, which the app adds as a dev
  dependency (brock-build loads it from the app; `brock knip` counts it as used). The renderer and
  every worker build get a fresh plugin.
- Workers need no option: the renderer builds them as ES modules (`worker.format: 'es'`), so
  `new Worker(new URL('./x.worker.ts', import.meta.url), { type: 'module' })` and `import X from
  './x.worker?worker'` take static and dynamic imports.
- `public/` is the renderer's public folder in every build, so `public/wasm/core.wasm` is served at
  `/wasm/core.wasm` in dev and copied to `dist/renderer/wasm/` (and `dist/web/wasm/`) as it is.
- `define`: globals replaced at build time in main, preload, the renderer, its workers and the web
  build, `{ __APP_BUILD__: '2026.10', __FLAGS__: { beta: true } }`. Each value is a JSON value; Brock
  turns it into the expression Vite's `define` takes, so the code reads it as written. Declare each
  name in a `.d.ts` of the app (`declare const __APP_BUILD__: string;`).
- `optimizeDeps`: `{ include, exclude, entries, worker }`, added to the renderer dev server's
  `optimizeDeps`. Brock already lists what the renderer pre-bundles: React, the renderer entries of
  Tessera and of the Brock packages installed in `node_modules`, and every package import of the
  files under `src/` and of the linked workspace packages they reach (deep imports such as
  `@iconify-icons/<set>/<icon>` and the imports of worker files included), so a cold start runs the
  optimizer once. `include` adds to that list, `exclude` drops from it and keeps Vite from
  pre-bundling, `entries` replaces the `index.html` the scanner starts from, and `worker` names what
  only a renderer Web Worker imports and the source read cannot see, such as Node built-ins served
  through `nodePolyfills` (`worker: ['fs', 'crypto', 'path']`), so they are bundled at start instead
  of when the worker first loads, which re-runs the optimizer and reloads the page.

`tsconfig.compilerOptions` merges over the managed `tsconfig.json`: key by key, and `paths` entry by
entry beside `@app` and the aliases. `brock sync` writes the merged file and `brock check` compares it,
so the options stay in the config:

```ts
tsconfig: { compilerOptions: { noUncheckedIndexedAccess: false } },
```

`workflows` adds the app's own steps to the managed CI and release workflows, and can leave a
workflow to the app (`ci: 'own'`, `release: 'own'`); the step points, the step keys and what an owned
workflow gives up are in docs/architecture.md, Workflows, App steps.

```ts
workflows: {
  steps: {
    ci: { beforeBuild: [{ name: 'Build the core', run: 'pnpm run core:build' }] },
    release: { afterPackage: [{ name: 'Ship the data file', run: 'cp "$APP_DIR/out/data.bin" upload/' }] },
  },
},
```

`packaging` adds to the managed electron-builder config and to `vpk pack`:

```ts
packaging: {
  extraResources: [{ from: 'native/build/addon.node', to: 'native/addon.node' }],
  afterPack: 'build/after-pack.mjs',
  fileAssociations: { mypack: { role: 'Editor', icon: 'mypack' } },
  velopackIcons: { windows: 'build/setup.ico', linux: 'build/setup.png' },
},
```

- `extraResources`: copied into the resources folder after the module resources, `from` relative to the app.
- `afterPack`: a module of the app; its default export (or `afterPack`) gets electron-builder's
  `AfterPackContext` after Brock's own hook (the Velopack bindings, the unused Electron files, the exe icon).
- `fileAssociations`: per extension of `product.fileAssociations`, the macOS `role` (`Editor`, `Viewer`,
  `Shell`, `None`) and an `icon` in place of the product's; the Windows file icon follows it. An icon set here
  or in `product.fileAssociations` wins over the brand's file type icon.
- `velopackIcons`: the icon `vpk pack` takes, an `.ico` on Windows and a `.png` on Linux, in place of the app icon.

`helpers` names the standalone Node scripts an outside program runs, such as a stdio MCP helper:

```ts
helpers: { 'bxel-mcp': 'src/helper/main.ts' },
```

`brock build` and `brock dev` bundle each one into `dist/helpers/<name>.mjs` (one ES module for Node 22
or later, every import inlined but Node's built-ins, no Electron import allowed), and the managed
electron-builder config ships them in `resources/helpers`, outside the asar. The bridge the helper
talks to and the MCP client config are in docs/architecture.md, Outside helpers and the bridge.

The app's `package.json` must say `"type": "module"`: the managed `electron.vite.config.ts` and
`vite.web.config.ts` pass `import.meta.dirname`, which a CommonJS package leaves empty, and
`brock check` fails while it is missing.

`fuses` sets the Electron fuses of the packaged app. The managed electron-builder config turns off
`EnableNodeOptionsEnvironmentVariable` and `EnableNodeCliInspectArguments` (no `NODE_OPTIONS`, no
`--inspect`), and turns on `OnlyLoadAppFromAsar`, `EnableCookieEncryption` and, on Windows and macOS,
`EnableEmbeddedAsarIntegrityValidation`. Electron has no asar integrity on Linux, so that fuse stays off
there. `RunAsNode` is on only when `helpers` is declared, because a helper starts through
`ELECTRON_RUN_AS_NODE`; an app without a helper has no use for it, so it is off. `fuses: { runAsNode: true }`
turns it on for an app that needs it anyway, and `false` beside `helpers` is refused. `brock dev` and the
headless launches run the dev Electron, which has no fuses flipped. The cookie fuse is one way: a store
written with it cannot be read without it.

`gate` declares the app's own gate steps, which `brock gate` runs, and with it the managed CI
`quality` job and `<repo> upgrade`:

```ts
gate: {
  scripts: ['codegen:check', 'schema:check'],
  clangFormat: ['native/src'],
},
```

- `scripts`: `package.json` scripts, run in order with `pnpm run`, from the app's `package.json`
  when it has the script, else the workspace root's. A script neither declares fails the gate.
- `clangFormat`: folders or files of C sources (`.c`, `.h`, searched under each folder outside
  dot-folders and `node_modules`), relative to the repo root (the workspace root, else the app).
  While it names any, `brock sync` writes the managed `.clang-format` at that root and `brock gate`
  runs `clang-format --dry-run --Werror` against it first; `brock clang-format` rewrites the files.
  The style is the house C style: two-space indent, attached braces,
  short ifs, loops, cases and functions on one line, `int *p`, binary operators leading a broken
  line, trailing comments left where they are, includes not sorted, and no column limit, so the line
  breaks the code already has stay. It needs clang-format 16 or later, pinned so CI and every machine
  format alike: add `clang-format-node` with an exact version (`pnpm add -D -E clang-format-node`) to the
  app or the repo root, and Brock runs its `clang-format` bin; `brock knip` counts it as used.
  `clang-format-node` ships LLVM's own binaries, built from source for Windows, macOS and Linux and
  released for every LLVM release, where the older `clang-format` npm wrapper has not had a release
  since 2023. `BROCK_CLANG_FORMAT` names another binary instead. With neither, the C check fails, names
  the package and says where a clang-format of the machine (the `PATH`, the Visual Studio C++ tools) is.
- `cargo`: the Rust lane, `{ enabled?: boolean, path?: string, clippyArgs?: string[] }`.

### The cargo lane

The lane runs after the other steps, when a `Cargo.toml` with a `[workspace]` or `[package]`
table sits at the repo root (the workspace root, else the app). `cargo.path` names another
folder, relative to the repo root, and fails the gate when it holds no such `Cargo.toml`.
`cargo.enabled: false` turns the lane off. Two apps that share a repo root run the lane once.
These steps run, every one of them, each reported with its name and counted in the failures:

1. `rust comment check`: Rust follows the same no-comment rule as the TypeScript. In every `.rs`
   file under the root (not `target`, `node_modules` or dot-folders) a `//` comment fails with
   its `file:line`, and so does a trailing comment and any `/* */` block comment, doc blocks
   included. Only `///` (docs on an item) and `//!` (module docs) pass, and a `// SAFETY:`
   comment passes when it sits directly above a line with `unsafe`. Strings, raw strings and
   char literals are not read as comments.
2. `cargo fmt --all -- --check`
3. `cargo clippy --workspace --all-targets -- -D warnings -W clippy::too_many_lines -W clippy::cognitive_complexity`,
   then `cargo.clippyArgs`. The two `-W` lints are off by default in clippy; they hold a
   function to 60 lines and a cognitive complexity of 10. The thresholds come from a
   `clippy.toml` that Brock ships (`too-many-lines-threshold = 60`,
   `cognitive-complexity-threshold = 10`) and applies through `CLIPPY_CONF_DIR`, only while
   the cargo root has no `clippy.toml` or `.clippy.toml` of its own. A repo file wins whole:
   it must then set both thresholds itself. `clippyArgs` are lint flags and go after the
   `--`, for example `['-A', 'clippy::module_name_repetitions']`.
4. `cargo test --workspace`

Each cargo step is spawned without a shell, with the argument list above, in the cargo root.
If `cargo` is not on `PATH` the lane does not skip: it fails with a message that says to
install Rust or to set `cargo.enabled: false`, after the comment check, which needs no cargo.
`BROCK_CARGO` names another cargo (a `.js` or `.mjs` file runs under Node). One concern per
module file stays a review rule; the gate does not check it. `jscpd` is not a gate step: it
runs in the repo's `lint` script, so a Rust repo adds `"rust"` to `format` in its
`.jscpd.json`, with the same `threshold: 0`. CI needs a Rust toolchain with `rustfmt` and
`clippy` installed before the gate step.

A repo with no Brock app, such as a Cargo workspace with a plain Vite app, runs `brock gate`
too. It needs `@drizztdourden08/brock-build` as a dev dependency and nothing else: no
`brock.config.ts`. At the repo root, `brock gate` first looks for an app (a `brock.config.ts`
at the root or in a workspace package, or an electron target of `brock.workspace.mjs`). With
none, it takes the `gate` key of `brock.workspace.mjs` (`export default defineWorkspace({ name,
gate: { scripts: ['lint', 'test'], cargo: { clippyArgs: [] } } })`), or an empty gate when the
root has a `Cargo.toml`. `scripts` run with `pnpm run` from the root `package.json`, so
the TypeScript gates of such a repo are its own scripts. With no `Cargo.toml` and no `gate`,
the command fails and says so. Import `defineWorkspace` from `@drizztdourden08/brock-build` (or `@drizztdourden08/brock-thread`).

Erasable TypeScript only: Node imports this file directly, so no enums, no parameter
properties, no extensionless relative imports.

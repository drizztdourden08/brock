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
| `/testing` | `launchAppForTest({ appDir, args?, env?, timeoutMs? })` for app e2e tests, `readDockLayout(page)`, `widgetWindows(app)`, `assertLaunchable(appDir)`, `unresolvableImports(outDir)` |
| `.` | Everything above plus `syncApp`, `resolveModules`, `ensureElectron` and the built-in module registry |

## The CLI

```
brock sync [--check]       regenerate the managed files, or report drift with --check
brock check                sync --check, for CI
                           at a repo root with brock.workspace.mjs, both run once per electron target's app
brock add <id | spec>      install a module package, record its id, sync
brock dev [-- args]        electron-vite dev
brock build [-- args]      electron-vite build; copies the brand icon set first when icons.brand is set
brock package [--full] [--channel <name>]
                           build, electron-builder --dir, vpk pack into release/velopack,
                           then on Windows the small installer and install.json
brock package --render-installer
                           Windows: build the installer stub and write its screens, the mark and
                           the Setup splash as PNGs into release/installer-preview; installs nothing
brock icons [--force]      copy the Tessera brand set into build/icons, build/splash and public/logos, and draw the bot variant
brock start [-- args]      run the built app with Electron (the app folder when package.json main is
                           dist/electron/main.js, so its name and version apply); args reach the app
brock adopt [--scope @x] [--local <brockRepo>] [--force]
                           give any repo the lint configs, pnpm files and the lint-config dependency,
                           plus its own command: bin/<repo>.mjs, linked by the postinstall
brock structure [--check] [--scope @x]
                           verify the folder standard: package names, barrels, folder names, depth
                           (the checks of @drizztdourden08/standards with Brock's extension, standards.extension.mjs)
brock migrate --from <version> [--to <version>] [--tessera-from <version>] [--report <file>]
                           run the Brock migrations after --from, up to --to, over the files the app owns,
                           then replay Tessera's RENAMES.json and pin brock.tessera;
                           --tessera-from alone replays only the Tessera renames;
                           --report <file> (relative to the current directory) writes the run as JSON
brock platform list | add <id | bundle>... | remove <id | bundle>...
                           the targets in brock.config.ts; add runs the platform steps and the doctor,
                           add and remove rewrite targets and both workflows
brock doctor [id | bundle...]
                           check this machine for what the targets need; prints install commands only
brock web build | dev      the renderer alone into dist/web, from vite.web.config.ts
brock tessera <args...>    Tessera's own command line, such as tessera new compound SaveSlot, run in the
                           current folder so it finds tessera.config.json from there; every word after
                           tessera reaches it, --help too; Tessera comes from the app's or repo's node_modules
```

In a repo you do not type `brock`: you type the repo's own command (`archipelia`,
`tessera`, `rotp`), which runs everything above and the thread verbs. That command is
`bin/<repo>.mjs`, a plain Node file with no dependencies that `brock adopt` and
`create-brock` write from `src/launcher/launcher.mjs.tmpl`; the root `package.json`
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

`--root <dir>` points at an app root other than the current directory. `dev`, `build`
and `start` check the Electron binary first and repair it when the postinstall was
skipped or interrupted. Everything after `--` reaches electron-vite or the app unchanged.
`brock add` installs with `pnpm add`.

## How the pieces work

- `config.mjs` has no Node imports on purpose: the renderer bundles `brock.config.ts` through `src/product.ts`, so everything it reaches must be browser safe. `defineBrockConfig` is an identity function; validation happens in `defineProduct`. Loading from disk lives in `load-config.mjs`, which imports under Node's type stripping, so `brock.config.ts` keeps to erasable TypeScript.
- `run.mjs` resolves every tool from the app root, so the app's own electron-vite and Electron run, and bins run through the current Node executable instead of a shell shim. Outside an Electron process `require('electron')` returns the binary path read from the package's `path.txt`. On Windows pnpm is a `.cmd`, which needs a shell to start.
- `ensure-electron.mjs`: `node_modules/electron` is two parts, the JS shim and the downloaded binary in `dist/` plus `path.txt`, and either can go missing on its own; both look like an opaque `Error: Electron uninstall` from electron-vite. Repair order: run `install.js` when the shim is intact but the binary is missing or stale; when the shim is broken, remove the package and run `pnpm install --force` first. A failing `install.js` is swallowed because the post-repair check reports what is still wrong. Locked files are reported, never force-killed, because an app may be running from the tree.
- `vite-config.mjs`: the renderer has two pages (the app and the splash window page) in one output folder so both reach `./logos/*` the same way. The preload build adds `splash-preload` from `@drizztdourden08/brock-electron/splash-preload`. The `splash/` plugin is the one splash generator: it writes `splash.html` (served by the dev server, emitted by the build) and never touches `src/index.html`. The page is static HTML: Tessera's token stylesheets and the app theme (`theme.css` of `tessera.config.json`, else `src/theme.css`) inlined as they are, the Inter subset and the Chakra Petch 600 face inlined from Tessera's own `@font-face` rules, the resolved look as `--look-*` custom properties, then `splash/splash-page.css` (tokens only) and a short script that listens to `window.brockSplash`. The name and mark come from `defineProduct`, so `window.title` and `logos.mark` defaults apply. An app that keeps its own `src/splash.html` builds that one instead.
- `installer/`: the installer template. `installer-inputs.mjs` resolves the config, the look and the stub colours once. `installer-theme.mjs` reads `theme.dark` from the Tessera `tokens.json` and falls back to the built-in colours, logging once. `stub-colours.mjs` maps the theme and the look to the colours `product.h` carries. `mark-png.mjs` takes Tessera's mark PNG, or rasterises the mark SVG with resvg, or takes `build/installer/header.png`, `setup-splash-png.mjs` draws the Setup splash (or takes `build/installer/splash.png`), `render-installer-preview.mjs` is `brock package --render-installer`, and `check-installer-folder.mjs` is the `brock structure` rule for `build/installer/`.
- `look/`: `appLook` loads brock-core through the app's Vite (`runnerImport`, since core ships TypeScript source that Node cannot import) and returns `defineProduct(product)` with `resolveLook(config, sources)`. `loadLookSources` reads the Tessera brand gradient from `tokens.json` in the Tessera package (`brands.<brand>.gradient`, optional `angle`) when that file exists, and the `--p-primary` and `--p-black` seeds from the app theme, falling back to the brand palette (`src/tokens/palettes/<brand>.css` in Tessera), then to Tessera's `palette.css`. `themePalette(rootDir, brand)` names the brand palette the app shows (none once `theme.css` sets a seed); the installer reads that palette's `palettes.<brand>.dark` from `tokens.json`. `appThemeCss(rootDir)` (also the `/theme` entry, which the managed `stylelint.config.mjs` reads for its token file) names that theme: `theme.css` of the `tessera.config.json` at or above the app, with the app's `apps` entry merged in, through the app's own `@drizztdourden08/tessera/config`; `src/theme.css` when there is no such file or the installed Tessera has no config entry. A file that breaks the schema stops the build with an error that names it. The installer reads the same look.
- `boot/`: `scanBootTasks` lists `<id>.task.ts` in `src/boot` and `electron/boot`; `renderBootFiles` writes `.brock/boot.renderer.ts` and `.brock/boot.main.ts` for `brock sync` and `brock check`; `dev` and `build` rewrite them when a task file was added, renamed or removed. `brock structure` accepts `<id>.task.ts` as a module file. Brock and Tessera packages ship TypeScript source, so they are bundled instead of externalized; the exclude list is every `@drizztdourden08/*` dependency of the app.
- `widgets/`: `scanWidgets` lists `src/widgets/<id>.widget.tsx`; `renderWidgetsFiles` writes `.brock/widgets.ts` (always, empty without widgets) for `brock sync` and `brock check`; `widgetsPlugin` rewrites it on any change under `src/widgets`, and `dev` and `build` rewrite it before electron-vite starts. `checkWidgets` is the `brock structure` rule for the folder: widget files only, kebab-case ids, a default export, known `meta` keys, no built-in id. `regenerate-plugin.mjs` is the watcher both the screens and the widgets plugins use, and `write-changed.mjs` writes generated files whose content changed.
- `builder-config.mjs` works on the raw product input and fills the two defaults it needs (`artifactPrefix`, `fileAssociations`) the same way `defineProduct` does. With `icons.brand` set it points electron-builder at the copied set (`win.icon: build/icons/icon.ico`, `mac.icon: build/icons/icon.png`, `linux.icon: build/icons/png`, `directories.buildResources: build`); without it the `ico`, `png512` and `png256` fields map to win, mac and linux as written.
- `icons/`: Brock owns no icon art. `copyBrandIcons` resolves `@drizztdourden08/tessera/package.json` from the app root, takes `brand/<brand>/` beside it and copies the set (`icon.ico`, `icon.png` from the 1024, `png/icon-<size>.png`, `maskable-512.png`, `android/*`, `splash/*`) into `build/`, plus `icon.svg`, `icon.ico` and `icon-256.png` into `public/logos/` for the About screen and the window icon, `icon-32.png` and `icon-24.png` for the title bar (`product.logos.app` defaults to `./logos/icon-32.png` with a brand, so the 20 px logo is not a 256 px image scaled down), and `brand/<brand>.svg`, the mark without its tile, as `public/logos/mark.svg` for the splash.
- `icons.rim` (`'light'` or `'dark'`) picks Tessera's rimmed set: `brand/<rim>-rim/<brand>/` and `brand/<rim>-rim/<brand>.svg`, which mirror the plain layout, carry a thin outline in the rim colour and are never tiled. It defaults to `'light'` for the `brock` brand, the light rim on dark surfaces, and to no rim for any other brand. `brandRim` resolves it from the raw config, `brandFolder` names the folder, and every reader takes it: `brock icons` (with `dev` and `build`), so the window icon, `public/logos`, `build/icons`, the splash mark and the bot variant all come from that tree, and the installer and Setup splash mark (`mark/mark-256.png`, else `<brand>.svg`). `icons/bot/` then writes the instance variant a named instance shows: `icon-bot.svg`, `icon-bot-256.png` and `icon-bot.ico`, the brand icon with a bot badge in the corner, drawn with pngjs and a small ICO writer. A brand folder with a `bot/` set of its own (`icon.svg`, `png/icon-256.png`, `icon.ico`) is copied instead. A file whose destination already holds the same bytes is skipped, so switching to a rim recopies the set and redraws the bot variant; `--force` copies all. `dev` and `build` run the same copy first, so a fresh clone gets its logos on the first run. A missing Tessera package or brand folder fails with the path it looked for.
- `modules/resolve.mjs` finds a package whose exports map hides `package.json` by walking `node_modules` up from the app root. Missing packages are reported, never thrown, so the caller decides: the CLI fails, the scaffolder warns and continues. `specifierFor` returns the package's exports key when one points at the manifest subpath, else the file path inside the package.
- `modules/generate.mjs`: a module contributes to a side (main, preload, renderer) only when its manifest names a subpath for it. The arrays are empty when the app has no modules, so the app code that imports them never changes. `identifierOf` turns `port-kit` into `portKit` plus the side suffix.
- `modules/sync.mjs` leaves the manifest's `generatedAt` out of the drift comparison, so a check passes on a tree synced at another time. A managed file is regenerated verbatim: an app that needs a different shape changes the factory call's arguments through a Brock release, not the file.
- `modules/prepare-modules.mjs` runs each listed module's manifest `prepare` script before `dev` and `build`, with the module package as its folder; a failing step is reported and the command goes on. `modules/module-packaging.mjs` turns the manifest `extraResources` into electron-builder entries with absolute `from` paths, and each `packExclude` glob into a `!**/node_modules/<package>/<glob>` line under `files`. `loadBuilderConfig` adds both.
- `commands/add.mjs` edits `brock.config.ts` textually and touches only the `modules: [...]` array literal; a one-entry-per-line array keeps the indentation of its first entry and the trailing comma. A built-in id is looked up in the registry; anything else is an npm spec and the id then comes from the installed package manifest.
- `brock build` writes `dist/electron`, `dist/preload` and `dist/renderer`; `brock package` is the release step on top of it.
- `packaging/`: `commands/package.mjs` runs the build, electron-builder with `--config electron-builder.config.cjs` for the current OS, the Setup splash and `vpk pack`. `vpk-args.mjs` builds the pack arguments from the product and `product.installer` (pure, so it is the part to test), `run-vpk.mjs` finds `vpk` in `~/.dotnet/tools` before `PATH`, `name-pack-outputs.mjs` gives the downloads their release names and fails when vpk's own naming moved, `build-installer-stub.mjs` writes `product.h` (`stub-product-header.mjs`), the resource script, the icon, the mark and the licence text into `release/installer-stub` and compiles `installer-stub/` with `cl.exe` through `vcvars64.bat`, `write-install-manifest.mjs` is the port of rotp's `make-install-manifest.mjs`, `ship-installer.mjs` runs both after a Windows pack, and `after-pack.mjs` is the electron-builder hook that prunes the foreign Velopack bindings and unused Electron DLLs and stamps the exe icon with rcedit.
- `release/`: the workflow Builder. `composeWorkflows({ targets, appDir, prefix, systemSteps })` expands the targets, asks each chosen platform for its CI job and its release job, and fills `ci-workflow.yml.tmpl` (the `quality` and `review` jobs every app gets, then the platform CI jobs) and `release-workflow.yml.tmpl` (the `prepare` job, the platform build jobs, then `release` with `needs` and the Downloads list built from each job's downloads). `setup-steps.yml.tmpl` is the checkout, pnpm, Node and install every job starts with; a module's manifest `ci` steps go in before the install on the runners whose `os` matches. `brock sync` writes both files for a standalone app; `brock adopt` writes `release.yml` once for a repo with `apps/<app>`.
- `platforms/`: one Strategy per platform, `<id>/<id>.platform.mjs`, each built with `definePlatform({ id, label, doctor, scaffold, ciJob, releaseJob, secrets, secretsHint, managed })`, one step per file. See Platforms below.

`brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test: the
window opens off screen and unfocused, and the app writes under `<dir>`. Add `--review` for the
automated review, which writes `<dir>/Data/review/review/report.md` and exits 1 on a failed check.

## Ports and the dev server

The Vite factory reads `product.ports.base` (or `derivePortBase(product.id)` when unset) and the checkout's port slot, and sets the renderer `server.port` to `base + 10 x slot` with `strictPort` from `product.ports.strict`, true by default. `devServerPort(rootDir, product)` returns that pair. The scheme lives in brock-thread (`/ports`); `portFor`, `portSlotOf`, `derivePortBase` and `PORT_OFFSETS` are re-exported here.

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
capacitor.config.json         appId, appName, webDir dist/web, android.path mobile/android, for android
build/linux/deb-postinst.sh   module udev rules and build/linux/after-install.sh, for linux
```

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
  to-do on its line, for a change that only the app author can make.

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
prop values and config keys, and its removed exports, grouped by release, oldest first. After the
Brock migrations, `brock migrate` replays it over the app's code (`src/upgrade/tessera/`),
and `brock upgrade` gets it through the `brock migrate` step of its gate.

- Range: from `--tessera-from`, else `package.json#brock.tessera` (the Tessera version
  the code was last replayed to), else `0.3.0`, the baseline; up to the installed
  Tessera's `package.json` version. Each release in that range replays in order. A
  `next` release (Tessera linked to main) replays every time; the pin is still the
  installed version. `brock upgrade` passes `--tessera-from` with the Tessera version the
  worktree had before its install when the app has no pin yet. The step then writes
  `brock.tessera`.
- An entry whose value is also a key of the same release would rename twice on a second
  replay, so it is skipped with a warning.
- Files: `.ts`, `.tsx`, `.mts`, `.mjs`, `.css` and `.json` (not `package.json`) under the
  app's `src`, `electron` and `tests`, and every package and app of its monorepo, through
  the owned-files walk. A file whose head says it is generated is skipped. Scripts are
  parsed with the app's TypeScript compiler API, else Brock's.
- Each map is one pass, longer keys first, so a renamed name is never renamed again:
  - `cssCustomProperties`: the whole `--token` (not followed by a name character), in
    stylesheets, every script string and JSON.
  - `components`: only a name imported from `@drizztdourden08/tessera*` in that file;
    the import, its JSX tags and its type and value references. An aliased import
    renames the imported name alone; a re-export is a to-do for its importers.
  - `cssClasses`: selectors in stylesheets (`.old` not followed by a name character,
    outside comments, strings and `url()`); class tokens in strings under a `class*`
    JSX attribute, a `cx`, `cn`, `clsx` or `classnames` call or a `*Class(Name)(s)`
    binding; and `.old` in other strings, such as a `querySelector` selector. A
    class-list value (`range-slider` to `slider slider--range`) writes every class.
    A longer name built from a key that RENAMES.json does not list
    (`tab-bar__strip`, `` `tab-bar--${tone}` ``) is a to-do, and so is a string that is
    exactly an old class anywhere else.
  - `props` `Component.prop`: the JSX attribute on that Tessera component, when the
    new prop belongs to the same component or to its plain rename; otherwise a to-do.
  - `propValues` `Component.prop`: a string literal the attribute can take (ternary
    branches, `??` and `||` fallbacks), under its old or renamed prop. A bare type key
    (`WidgetVisibility`) renames literals annotated with that Tessera type, `as` or
    `satisfies` it; any other string holding an old value is a to-do.
  - `removedExports`: a to-do at each import or re-export of the name.
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

## Platforms

Each platform is a Strategy in `src/platforms/<id>/`. The CLI and the workflow Builder only
walk the chosen strategies; neither names a platform.

| Platform | doctor | scaffold | CI job | release job | secrets |
|---|---|---|---|---|---|
| windows | .NET 8 SDK, vpk, MSVC C++ tools (on Windows) | brand icons | none | `build-windows`: `brock package` on windows-latest, vpk, the small installer | none |
| macos | Xcode command line tools (on macOS) | brand icons | none | `build-macos`: dmg and zip, ad hoc signed | none |
| linux | .NET 8 SDK and vpk (on Linux), module libraries | brand icons; `build/linux/deb-postinst.sh` through sync | none | `build-linux`: deb and the vpk AppImage | none |
| android | JDK 21, `ANDROID_HOME`, `platform-tools`, `platforms;android-36`, `build-tools;36.0.0` | Capacitor packages, ignore lines, `cap add android`, `@capacitor/assets`, Gradle signing, `versionCode` | none | `build-android`: JDK 21, setup-android, `brock mobile build --release` | `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` |
| web | nothing beyond Node and pnpm | `build:web` and `dev:web` scripts | `web`: `brock web build` | `build-web`: `dist/web` zipped | none |
| ios | reserved: choosing it says it is not supported yet | | | | |

- `doctor` checks run on the machine and only report: each result is `ok`, `missing` with the install command for this OS, or `skip` when the check belongs to another OS. `brock doctor` exits 1 when anything is missing. A module adds its own through its manifest `doctor` entries (`name`, `os`, `probe`, `install`); the input module checks `pkg-config --exists libusb-1.0` on Linux and macOS.
- `scaffold` steps are `files` steps (edit the tree, may ask for an install) or `tools` steps (need `node_modules`). Each returns `done`, `skipped`, `pending` or `failed` and skips what is already there, so `platform add` can run again. A step two platforms share runs once.
- Android lives in `mobile/android` with `capacitor.config.json` at the app root, so `cap` runs from the app's own `package.json` and finds its plugins there. The Gradle patches read `BROCK_KEYSTORE_FILE`, `BROCK_KEYSTORE_PASSWORD`, `BROCK_KEY_ALIAS` (and `BROCK_KEY_PASSWORD`, which falls back to the store password) from the environment or Gradle properties; without them a release stays unsigned. `versionCode` is `major * 10000 + minor * 100 + patch` of `package.json`. `<app> mobile keystore` (brock-thread) makes the keystore with `keytool` once you agree and prints the `gh secret set` lines; it never runs them.
- Linux: a module's manifest `udevRules` file and the app's own `build/linux/after-install.sh` become `build/linux/deb-postinst.sh`, which `brock sync` keeps and electron-builder runs as the deb `afterInstall`. The input module ships the controller rules (Nintendo, Sony, Microsoft, 8BitDo, `TAG+="uaccess"`).
- Web: `vite.web.config.ts` builds `src/index.html` with a relative base into `dist/web`, which Capacitor also wraps, and writes `manifest.webmanifest` from the product with the brand icons. There is no deploy job; the release carries the zip.

`brock platform add <id | bundle>...` writes the targets, runs the `files` steps, `pnpm
install` when a step asks, `brock sync`, the `tools` steps, then the doctor and the secrets
checklist for what it added. `remove` writes the targets, deletes the managed files only
the removed platforms rendered and runs `brock sync`; scaffolded folders such as
`mobile/` stay. `list` shows every platform, which are chosen and through which bundle.

## Module ids

`updater`, `secrets`, `input`, `display` and `port-kit` map to
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
window not maximizable, and `fullscreen: false` makes it not fullscreenable and turns Alt+Enter
off. `product.widgets.mainLabel` names the main view in the widget dock (default `Main`).

```ts
product: { /* ... */ window: { titleBar: { controls: { fullscreen: false, pin: false } } }, widgets: { mainLabel: 'Board' } },
```

`targets` takes platform ids (`windows`, `macos`, `linux`, `android`, `web`; `ios` is
reserved) and bundles: `desktop` is Windows, macOS and Linux, `mobile` is Android today and
iOS once it is supported, with no config change. `web: { manifest: false }` drops the web app
manifest from the web build.

Erasable TypeScript only: Node imports this file directly, so no enums, no parameter
properties, no extensionless relative imports.

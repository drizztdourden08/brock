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
| `/testing` | `launchAppForTest({ appDir, args?, env?, timeoutMs? })` for app e2e tests, `assertLaunchable(appDir)`, `unresolvableImports(outDir)` |
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
brock migrate --from <version> [--to <version>] [--report <file>]
                           run the Brock migrations after --from, up to --to, over the files the app owns
brock platform list | add <id | bundle>... | remove <id | bundle>...
                           the targets in brock.config.ts; add runs the platform steps and the doctor,
                           add and remove rewrite targets and both workflows
brock doctor [id | bundle...]
                           check this machine for what the targets need; prints install commands only
brock web build | dev      the renderer alone into dist/web, from vite.web.config.ts
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
- `vite-config.mjs`: the renderer has two pages (the app and the splash window page) in one output folder so both reach `./logos/*` the same way. The preload build adds `splash-preload` from `@drizztdourden08/brock-electron/splash-preload`. The `splash/` plugin is the one splash generator: it writes `splash.html` (served by the dev server, emitted by the build) and never touches `src/index.html`. The page is static HTML: Tessera's token stylesheets and the app's `src/theme.css` inlined as they are, the Inter subset and the Chakra Petch 600 face inlined from Tessera's own `@font-face` rules, the resolved look as `--look-*` custom properties, then `splash/splash-page.css` (tokens only) and a short script that listens to `window.brockSplash`. The name and mark come from `defineProduct`, so `window.title` and `logos.mark` defaults apply. An app that keeps its own `src/splash.html` builds that one instead.
- `installer/`: the installer template. `installer-inputs.mjs` resolves the config, the look and the stub colours once. `installer-theme.mjs` reads `theme.dark` from the Tessera `tokens.json` and falls back to the built-in colours, logging once. `stub-colours.mjs` maps the theme and the look to the colours `product.h` carries. `mark-png.mjs` takes Tessera's mark PNG, or rasterises the mark SVG with resvg, or takes `build/installer/header.png`, `setup-splash-png.mjs` draws the Setup splash (or takes `build/installer/splash.png`), `render-installer-preview.mjs` is `brock package --render-installer`, and `check-installer-folder.mjs` is the `brock structure` rule for `build/installer/`.
- `look/`: `appLook` loads brock-core through the app's Vite (`runnerImport`, since core ships TypeScript source that Node cannot import) and returns `defineProduct(product)` with `resolveLook(config, sources)`. `loadLookSources` reads the Tessera brand gradient from `tokens.json` in the Tessera package (`brands.<brand>.gradient`, optional `angle`) when that file exists, and the `--p-primary` and `--p-black` seeds from `src/theme.css`, falling back to Tessera's `palette.css`. The installer reads the same look.
- `boot/`: `scanBootTasks` lists `<id>.task.ts` in `src/boot` and `electron/boot`; `renderBootFiles` writes `.brock/boot.renderer.ts` and `.brock/boot.main.ts` for `brock sync` and `brock check`; `dev` and `build` rewrite them when a task file was added, renamed or removed. `brock structure` accepts `<id>.task.ts` as a module file. Brock and Tessera packages ship TypeScript source, so they are bundled instead of externalized; the exclude list is every `@drizztdourden08/*` dependency of the app.
- `builder-config.mjs` works on the raw product input and fills the two defaults it needs (`artifactPrefix`, `fileAssociations`) the same way `defineProduct` does. With `icons.brand` set it points electron-builder at the copied set (`win.icon: build/icons/icon.ico`, `mac.icon: build/icons/icon.png`, `linux.icon: build/icons/png`, `directories.buildResources: build`); without it the `ico`, `png512` and `png256` fields map to win, mac and linux as written.
- `icons/`: Brock owns no icon art. `copyBrandIcons` resolves `@drizztdourden08/tessera/package.json` from the app root, takes `brand/<brand>/` beside it and copies the set (`icon.ico`, `icon.png` from the 1024, `png/icon-<size>.png`, `maskable-512.png`, `android/*`, `splash/*`) into `build/`, plus `icon.svg`, `icon.ico` and `icon-256.png` into `public/logos/` for the title bar, the About screen and the window icon, and `brand/<brand>.svg`, the mark without its tile, as `public/logos/mark.svg` for the splash. `icons/bot/` then writes the instance variant a named instance shows: `icon-bot.svg`, `icon-bot-256.png` and `icon-bot.ico`, the brand icon with a bot badge in the corner, drawn with pngjs and a small ICO writer. A brand folder with a `bot/` set of its own (`icon.svg`, `png/icon-256.png`, `icon.ico`) is copied instead. A file whose destination is newer than its source is skipped; `--force` copies all. `dev` and `build` run the same copy first, so a fresh clone gets its logos on the first run. A missing Tessera package or brand folder fails with the path it looked for.
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

It refuses first when `dist/electron/main.js` or a chunk beside it imports a package or a file Node cannot find from there, and lists each one. It then runs the app's own Electron with `--no-focus --muted` and a fresh `--user-data` under the system temp folder, waits for the first window (60 s by default) and puts the tail of the main output in the error when that fails. `close()` quits and removes the folder. Playwright is an optional peer: add `playwright-core` (or `playwright`) to the app's dev dependencies.

## brock adopt

Beside the lint configs and the repo command, `adopt` writes `knip.json` with `brock.workspace.mjs` as an entry, `.worktrees/**` ignored and, with `--local`, `@drizztdourden08/brock-thread` in `ignoreDependencies`. It appends to `.gitignore` every generated output it lacks: `node_modules/`, `dist/`, `release/`, `.user-data/`, `.brock-port-slot`, and at any depth `build/icons/`, `build/splash/`, `build/installer-splash.png`, the six generated `public/logos` files and `.brock/profile-config.json`. It writes no splash or logo markup, and prints the app pages (`src/index.html`) that still hold a hand-written boot splash or `./logos/` path.

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
- A migration file exports `migration`: `{ id, summary, files, apply }`. `files` is a
  RegExp over root-relative paths. `apply({ path, source })` returns
  `{ source, todos, rename? }`; a changed `source` is written back, a `rename` path moves
  the file there (or becomes a to-do when that path exists), and each
  `{ line, message }` in `todos` becomes a numbered to-do.
- Owned files are everything but the files sync writes, the launcher and the
  generated folders (`node_modules`, `dist`, `out`, `release`, `.brock`, `.user-data`,
  `.worktrees`).
- A change the codemod cannot make safely is a to-do, never a guess. The runner
  records every file each migration touched; `--report` writes that and the to-dos as
  JSON for the upgrade verb.
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

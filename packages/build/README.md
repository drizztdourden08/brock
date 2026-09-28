<!-- @layer docs @kind doc -->
# brock-build

The tooling side of Brock: the config factories an app's managed files call, the
`brock` CLI, and the Electron install check. Plain `.mjs`, run by Node 24 with no
build step.

| Entry | Holds |
|---|---|
| `/config` | `defineBrockConfig(cfg)` for `brock.config.ts`; `loadBrockConfig(rootDir)` imports that file under Node's type stripping |
| `/vite` | `defineBrockViteConfig(rootDir, overrides?)`: the electron-vite config (main and preload from `electron/`, renderer from `src/` with `index.html` and `splash.html`, React plugin, react deduped, `@drizztdourden08/*` bundled instead of externalized) |
| `/builder` | `createBuilderConfig(product, { rootDir })` and `loadBuilderConfig(rootDir)` for electron-builder |
| `.` | Everything above plus `syncApp`, `resolveModules`, `ensureElectron` and the built-in module registry |

## The CLI

```
brock sync [--check]       regenerate the managed files, or report drift with --check
brock check                sync --check, for CI
brock add <id | spec>      install a module package, record its id, sync
brock dev [-- args]        electron-vite dev
brock build [-- args]      electron-vite build; copies the brand icon set first when icons.brand is set
brock icons [--force]      copy the Tessera brand set into build/icons, build/splash and public/logos, and draw the bot variant
brock start [-- args]      run dist/electron/main.js with Electron; args reach the app
brock adopt [--scope @x] [--local <brockRepo>] [--force]
                           give any repo the lint configs, pnpm files and the lint-config dependency,
                           plus its own command: bin/<repo>.mjs, linked by the postinstall
brock structure [--check] [--scope @x]
                           verify the folder standard: package names, barrels, folder names, depth
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
- `vite-config.mjs`: the renderer has two pages (the app and the boot splash) in one output folder so both reach `./logos/*` the same way. The `splash/` plugin writes both splashes from `brock.config.ts`: the splash window page (`splash.html`, served by the dev server and emitted by the build) and the boot splash inside an empty `#root` of `src/index.html`, with the product title, `logos.app`, `window.backgroundColor` and `window.splash.accent`. The index also gets the `booting` class and a `<title>` when it has none. An app that keeps its own `src/splash.html` builds that one instead. Brock and Tessera packages ship TypeScript source, so they are bundled instead of externalized; the exclude list is every `@drizztdourden08/*` dependency of the app.
- `builder-config.mjs` works on the raw product input and fills the two defaults it needs (`artifactPrefix`, `fileAssociations`) the same way `defineProduct` does. With `icons.brand` set it points electron-builder at the copied set (`win.icon: build/icons/icon.ico`, `mac.icon: build/icons/icon.png`, `linux.icon: build/icons/png`, `directories.buildResources: build`); without it the `ico`, `png512` and `png256` fields map to win, mac and linux as written.
- `icons/`: Brock owns no icon art. `copyBrandIcons` resolves `@drizztdourden08/tessera/package.json` from the app root, takes `brand/<brand>/` beside it and copies the set (`icon.ico`, `icon.png` from the 1024, `png/icon-<size>.png`, `maskable-512.png`, `android/*`, `splash/*`) into `build/`, plus `icon.svg`, `icon.ico` and `icon-256.png` into `public/logos/` for the title bar, the About screen, the splash pages and the window icon. `icons/bot/` then writes the instance variant a named instance shows: `icon-bot.svg`, `icon-bot-256.png` and `icon-bot.ico`, the brand icon with a bot badge in the corner, drawn with no image dependency (a small PNG and ICO codec). A brand folder with a `bot/` set of its own (`icon.svg`, `png/icon-256.png`, `icon.ico`) is copied instead. A file whose destination is newer than its source is skipped; `--force` copies all. `dev` and `build` run the same copy first, so a fresh clone gets its logos on the first run. A missing Tessera package or brand folder fails with the path it looked for.
- `modules/resolve.mjs` finds a package whose exports map hides `package.json` by walking `node_modules` up from the app root. Missing packages are reported, never thrown, so the caller decides: the CLI fails, the scaffolder warns and continues. `specifierFor` returns the package's exports key when one points at the manifest subpath, else the file path inside the package.
- `modules/generate.mjs`: a module contributes to a side (main, preload, renderer) only when its manifest names a subpath for it. The arrays are empty when the app has no modules, so the app code that imports them never changes. `identifierOf` turns `port-kit` into `portKit` plus the side suffix.
- `modules/sync.mjs` leaves the manifest's `generatedAt` out of the drift comparison, so a check passes on a tree synced at another time. A managed file is regenerated verbatim: an app that needs a different shape changes the factory call's arguments through a Brock release, not the file.
- `commands/add.mjs` edits `brock.config.ts` textually and touches only the `modules: [...]` array literal; a one-entry-per-line array keeps the indentation of its first entry and the trailing comma. A built-in id is looked up in the registry; anything else is an npm spec and the id then comes from the installed package manifest.
- `brock build` writes `dist/electron`, `dist/preload` and `dist/renderer`; packaging is a separate electron-builder run over `electron-builder.config.cjs`.

`brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test: the
window opens off screen and unfocused, and the app writes under `<dir>`.

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
```

Each module import is the package's exports key that points at the manifest file, or
the file path inside the package when no key does. The imported binding is the
subpath's default export. `--check` compares every file but the manifest's timestamp
and exits 1 on any difference.

## Module ids

`updater`, `secrets`, `input`, `display` and `port-kit` map to
`@drizztdourden08/brock-<id>`. Any other `brock add` argument is an npm spec; the id
comes from the installed package's `package.json#brock.id`.

## brock.config.ts

```ts
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';

export default defineBrockConfig({
  product: { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'Me' } },
  targets: ['desktop'],
  modules: [],
});
```

Erasable TypeScript only: Node imports this file directly, so no enums, no parameter
properties, no extensionless relative imports.

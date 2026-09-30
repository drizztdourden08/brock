<!-- @layer docs @kind doc -->
# Brock architecture

Brock is the base-app foundation for Electron + React desktop apps that share the Tessera design system. It is delivered as packages plus a builder: an app installs the packages it needs, and `create-brock` generates the thin skeleton around them. Fixes arrive through `pnpm update` and `brock sync`, never through a git merge.

## Packages

| Package | Runs in | Holds |
|---|---|---|
| `@drizztdourden08/brock-lint-config` | tooling | ESLint rules and factories, stylelint, markdownlint, tsconfig bases |
| `@drizztdourden08/brock-core` | everywhere | product config, the open IPC contract, platform ports, storage and profiles, settings and feature gating, log bus, module manifest type, automation flags, registry |
| `@drizztdourden08/brock-electron` | main, preload | `/main`: `bootstrapApp`, paths, portable mode, window, splash, window state, IPC handlers, diagnostics, crash forensics, session log. `/preload`: `createPreloadBridge` |
| `@drizztdourden08/brock-react` | renderer | `BrockApp`, platform provider and hosts, stores kit, screen registry, shell views, settings engine |
| `@drizztdourden08/brock-build` | tooling | Vite and electron-builder config factories, ensure-electron, the platform strategies and the workflow Builder, the `brock` CLI (sync, check, add, dev, build, package, start, platform, doctor, web) |
| `@drizztdourden08/create-brock` | tooling | the scaffolder: `pnpm create @drizztdourden08/brock` |
| `@drizztdourden08/brock-updater` | module | Velopack updater, the title bar update badge, UpdateDialog |
| `@drizztdourden08/brock-secrets` | module | safeStorage secret store, device-code sign-in |
| `@drizztdourden08/brock-input` | module | SDL3 controllers, mapping DB, calibration, haptics, InputTester |
| `@drizztdourden08/brock-display` | module | refresh rate, synced rate, display mode switch |
| `@drizztdourden08/brock-port-kit` | module | WASM game core lifecycle, save slots, SRAM, presenter, audio adapter, live settings, ROM source, asset pipeline framework, ensure-wasm |

Dependency direction: `lint-config` (dev) <- everything. `core` <- `electron`, `react`, `build`. `react` peer-depends on Tessera, React and zustand. Modules depend on `core`, and on `electron` or `react` for the side they touch. Tessera never depends on Brock.

Every package but `lint-config`, `build` and `create-brock` ships TypeScript source (like Tessera): the consumer's Vite compiles it. The three tooling packages are plain `.mjs`, runnable by Node with no build step.

## The one augmentation point

`@drizztdourden08/brock-core/augment` declares every open interface: `InvokeContract`, `SendContract`, `EventContract`, `IpcNamespaces`, `Capabilities`, `PlatformPorts`, `ProfileExtension`, `ProfileCreateExtension`, `ProfilePatchExtension`. A module or an app adds members with `declare module '@drizztdourden08/brock-core/augment' { interface InvokeContract { ... } }`. Runtime maps cannot be augmented, so Brock exports `BASE_INVOKE_MAP` and friends and the app composes `{ ...BASE_INVOKE_MAP, ...MY_MAP }` for the preload.

## Modules

A module is an npm package with a manifest at `package.json#brock` (`BrockModuleManifest` in core):

```json
{ "brock": { "id": "updater", "description": "...", "main": "./src/main/index.ts", "preload": "./src/preload/index.ts", "renderer": "./src/renderer/index.ts", "automationFlags": [], "dataDirs": [], "peers": ["velopack"] } }
```

`peers` names packages the app must declare itself, usually a native addon that loads from the app's `node_modules` at runtime. `brock add` installs each one the app lacks, at the module's own version range.

Each subpath exports one object:

- `main`: a `MainModule` (brock-electron): `{ id, onBoot?(product), register(ctx), onWindow?(win, ctx), onWillQuit?(ctx) }`. `onBoot` runs before anything else in `bootstrapApp`, which is where the updater runs the Velopack hooks.
- `preload`: a `PreloadNamespace` (brock-electron): `{ id, build(tools) }` returning the nested `window.api.<id>` object.
- `renderer`: a `RendererModule` (brock-react): `{ id, screens?, settingsTabs?, menu?, Provider?, titleBar?, ports? }`.

`brock.config.ts` lists module ids. `brock sync` reads each manifest and regenerates `.brock/modules.main.ts`, `.brock/modules.preload.ts` and `.brock/modules.renderer.ts`, which import the module objects and export them as arrays. The app's own `electron/main.ts`, `electron/preload.ts` and `src/main.tsx` import those arrays. `brock add <id | package>` installs the package (the built-in registry maps `updater`, `secrets`, `input`, `display`, `port-kit` to their package names; anything else is an npm spec), appends the id to `brock.config.ts` and runs sync. App code is never edited by the tool.

## App skeleton

```
my-app/
  brock.config.ts                  OWNED      product input, targets, modules
  package.json                     OWNED ONCE
  electron.vite.config.ts          MANAGED    defineBrockViteConfig(import.meta.dirname)
  electron-builder.config.cjs      MANAGED
  eslint.config.mjs, stylelint.config.mjs, .markdownlint-cli2.mjs, tsconfig.json   MANAGED
  .brock/modules.{main,preload,renderer}.ts, .brock/manifest.json               MANAGED
  .brock/screens.ts                MANAGED    the screen registry, written from src/screens
  electron/main.ts                 OWNED ONCE bootstrapApp(product, { modules: mainModules, handlers, ... })
  electron/preload.ts              OWNED ONCE createPreloadBridge({ maps, namespaces: preloadNamespaces })
  src/product.ts                   OWNED ONCE defineProduct(config.product)
  src/index.html                   OWNED ONCE the page with an empty #root; the build adds the title and the boot splash
  src/main.tsx                     OWNED ONCE <BrockApp product screenTree modules settings />
  src/theme.css                    OWNED      Tessera palette seeds
  src/settings.type.ts             OWNED      AppSettings
  src/settings.constants.ts        OWNED      the settings defaults
  src/ipc/contract.type.ts         OWNED      the augmentation
  src/ipc/contract.constants.ts    OWNED      the channel maps
  src/screens/screens.config.ts    OWNED      buckets, their menu placement, home
  src/screens/**                   OWNED      one screen per file, named by kind (see Screens by convention)
  public/logos/icon.*, icon-bot.*  GENERATED by brock icons from the Tessera brand (icons.brand); OWNED when the app ships its own art
  build/icons/*, build/splash/*    GENERATED by brock icons
```

Managed files are one-liners regenerated by `brock sync`; `brock check` fails CI on drift. Owned-once files are written at create and never touched again; a breaking skeleton change ships a migration.

`brock.config.ts` uses erasable TypeScript only (annotations, `satisfies`), because the `brock` CLI imports it under Node's type stripping, where relative imports need extensions and only `.mjs` packages resolve.

## Main process

```ts
bootstrapApp(product: ProductConfig, options: BootstrapOptions): void

interface BootstrapOptions {
  modules?: MainModule[];
  handlers?: HandlerGroup[];             // { id, register(ctx), devOnly? }, appended to the base set
  automationFlags?: string[];            // app flags the launch guard counts
  dataDomains?: DataDomainDef[];         // storage:getSummary rows
  profileHooks?: ProfileStoreHooks;
  rendererFlags?: (argv: string[]) => string[];   // extra --startup-* args
  onReady?: (ctx: MainContext) => void | Promise<void>;  // after paths, before the window
  onWindow?: (win: BrowserWindow, ctx: MainContext) => void;
  onWillQuit?: (ctx: MainContext) => void;
  paths?: { preload?: string; renderer?: string; splash?: string };  // defaults: ../preload/preload.js, ../renderer/index.html, ../renderer/splash.html from dist/electron
}

interface MainContext {
  product: ProductConfig;
  isDev: boolean;
  flags: AutomationFlags;                // core createAutomationFlags(base + modules + app)
  instance: { name: string | null; profile: string | null };
  paths: { userData: (...seg: string[]) => string; data: (...seg: string[]) => string };
  files: FileStore;                      // Node FileStore rooted at Data/
  profiles: ProfileStore;
  window: () => BrowserWindow | null;
  handle, on, emit;                      // typed against the augmented contracts
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
}
```

Boot order: Velopack hooks (updater module) -> portable mode -> `--user-data` -> `app.setName(product.id)` -> crash forensics -> app identity (AppUserModelId `product.appId` on every Windows launch, `<appId>.instance.<name>` for a named instance) -> privileged schemes (`product.schemes` + modules) -> whenReady: paths, data dirs (`product.dataDirs` + modules), session log rotation, base handlers, module `register`, app handlers, createWindow (title and size from `product.window`, icon from the renderer `logos/` folder), module `onWindow`, app `onWindow` -> quit hooks.

Base handlers: window, app, dialog, file, storage, profiles, config, sessions, uiViews, diagnostics, session log, test:screenshot.

Window rules are fixed: an automation launch (`flags.isHeadlessLaunch()`) opens off every monitor, `focusable: false`, `showInactive`, kept in the background; a normal launch opens at opacity 0 with the splash child window and is revealed on `window:shellReady` or an 8 s watchdog. `--muted` and `--sound` are forwarded to the renderer as `--startup-muted` / `--startup-sound`, never applied to the webContents.

## Preload

```ts
createPreloadBridge({
  maps: { invoke: INVOKE_MAP, send: SEND_MAP, events: EVENT_MAP },
  namespaces?: PreloadNamespace[],       // module and app nested objects
  helpers?: Record<string, unknown>,     // extra non-IPC values
  exposeAs?: string,                     // default 'api'
  debugGlobal?: { name: string; values: Record<string, string | null> },
}): void
```

The bridge adds `isDev`, `os`, `getFilePath`, `startup` (`fresh`, `automation`, `muted`, `sound`, `flags`) and `instance` (`name`, `profile`), parsed from the `--startup-*` flags main forwards through `additionalArguments`.

## Renderer

```tsx
<BrockApp<S>
  product={product}
  settings={{ defaults: DEFAULT_SETTINGS }}
  screenTree={screenTree}         // from .brock/screens.ts
  modules={rendererModules}
/>
```

An app not yet on the convention still passes `screens`, `home` (the base layer once a profile is active), `menu`, `homeScreen` and `credits`, and `settings.tabs`. Both can be given: the `screens` and `menu` props are added beside the generated ones.

- `defineScreen({ id, title, icon?, render(ctx), layer?: 'fullscreen' | 'own', keepMounted?, devOnly?, group?, shortcut?, requiresProfile?, subtitle?(ctx), extra?(ctx), floating?(ctx) })`. A fullscreen screen sits in the reference frame: a 90% card over a scrim, one header with title, subtitle, `extra` and the close button, `floating` overhanging the top edge, a 0.2 s entrance that is off while booting. Built-in screens: `profiles` (list, create, delete; the setup screen when no profile exists), `settings` (the hub over `settings.tabs`), `about`, and `credits` when the app gives credits.
- `defineHub` makes a fullscreen screen too: the hub title and profile name in the header, the page tabs as `extra`, the hub switch as `floating` when two hubs or more exist.
- Home: `product.homeScreen` (default `settings`) is the target of the Home menu entry and of Escape when nothing is open.
- Menu order: Home, Profiles, Settings (unless it is home), app entries, sections, module entries, Credits, About, Quit, each built-in with an icon. `MenuItem.section` files an entry under a submenu (`widgets`, `advanced`, or a new one named after the id); `devOnly` entries and the built-in Dev Console need developer tools (development, or the `developerToolsEnabled` setting).
- `useNavigation()`: `{ active, params, open(id, params?), close() }`, backed by a zustand store so non-React code can call `nav.open`. Escape order: a registered escape layer (`useEscapeLayer`), the dialog, the open screen, then open home.
- `useProfiles()`: `{ profiles, active, select, create, remove, refresh, lastProfileId }` over the platform `FileStore` and `createProfileStore`. `setLast` is skipped on an automation launch.
- `useSettings<S>()`: `{ settings, patch, hydrated }` from `createSettingsStore<S>({ defaults, load, save })`, one per profile, debounced save to `config.json`.
- Startup: pinned instance profile (fail loudly if missing) -> single profile -> last profile -> the `profiles` screen. `useShellReady` signals main once startup settled and two frames painted.
- Logos come from `product.logos`: `app` (default `./logos/icon-256.png`) in the title bar, the about screen and both splashes, `instance` (default `./logos/icon-bot.svg`) for a named instance. The title bar hides in `borderless` and `fullscreen` window modes, read from the `windowMode` setting.
- Shell views (each with a Storylite story): `TitleBar` (product name, menu slot, instance badge, module slots beside the title, window controls), `BootProgressBar`, `About`, `SettingsHub<S>` + `SettingsLayout<S>` + `SettingsPage`, `ConfirmDialog`, `ScreenLayer`.
- `RendererModule { id; screens?; settingsTabs?; menu?; Provider?; titleBar?: TitleBarSlot[]; searchActions?: SearchAction[]; widgets?: WidgetDef[]; ports?: Partial<Record<HostShell, Partial<PortCreators>>> }`. A module menu entry with `section` joins that submenu; one without sits before Credits. Ports are merged into the host factory with `withPorts`.
- `titleBar` is how a module puts something in the title bar, since brock-react cannot import a module. A `TitleBarSlot` is a `ComponentType` with no props: it reads its own store and renders a small control, or `null`. `BrockApp` merges the slots of every module in load order and `TitleBar` renders them after the title and the instance badge, keyed by `displayName`. A slot that is empty most of the time sets `conditional = true`, and the review stops expecting it to draw. The updater contributes its "Update available" badge this way.

Every app gets the standard features below. `StandardOverlays` mounts them in one place inside `AppShell`: `<StandardOverlays menu={fullMenu} actions={merged.searchActions} widgets={merged.widgets} />`.

- Search palette: Ctrl+K (Cmd+K on macOS) or the `SearchButton` title bar slot opens it; Escape or the scrim closes it. It searches the built menu, the registered screens, the settings tabs, every settings field and the registered actions. A boolean field gets an inline toggle, and Ctrl+Enter flips it from the keyboard. Picking a field opens `settings` with `{ tab, anchor }` and scrolls to the row. An app or module adds actions with `RendererModule.searchActions`, `registerSearchActions(actions)` (returns the unregister call) or `useSearchActions(actions)`. `palette.open()`, `palette.close()` and `usePaletteOpen()` drive it from outside.
- Bug report: `bugReport.open()` or the `BugReportButton` title bar slot opens a dialog for a title and a description. It attaches the debug text (app version, runtime, platform, recent log lines, and the host facts from `diagnostics:getSystem`) and opens a prefilled GitHub issue on `product.repo` in the browser. No token is involved. Without a repo the report goes to the clipboard.
- About: Version, Runtime, Engine and Platform rows, and Copy debug info with the same debug text (`useDebugText`).
- Toasts: `toast(message, { variant?, duration? })` works from anywhere and returns an id for `dismissToast(id)`. `ToastHost` renders the Tessera `ToastContainer`.
- Widgets: `defineWidget({ id, label, render, ... })` describes a floating or docked panel over the Tessera `WidgetManager`. Widgets come from `RendererModule.widgets`, the `widgets` prop of `StandardOverlays` or `registerWidgets(defs)`. The layout and each widget's `useWidgetPref` values are kept per profile in `ui-views.json` through the `uiViews` IPC, under `profile:<id>`. `useWidgetMenuEntries()` returns checkable items for a Widgets menu, and `widgets.open(id)`, `widgets.close(id)` and `widgets.toggle(id)` work outside React. The built-in `logs` widget is a filterable, searchable view of the log bus.
- The menu files the `useWidgetMenuEntries()` items under Widgets and adds Report a bug to Advanced. The palette and the bug report dialog are escape layers, so Escape closes them before anything else.
- `STANDARD_TITLE_BAR_SLOTS` (`SearchButton`, `BugReportButton`) come before the module slots.

Tessera is imported as `@drizztdourden08/tessera/*`; `tokens.css` first, then the app's `theme.css`.

## Screens by convention

A screen is a file. Its folder and its suffix decide what it is, and one config file lists the buckets.

```
src/screens/
  screens.config.ts           defineScreens({ buckets, home, settings? })
  game/                       a bucket: one hub, one pill in the bucket switch
    home.hero.tsx             the hub home, drawn in the hero frame
    saves.page.tsx            a page in the bucket's own group
    video/                    a nav group, labelled from config groups
      display.settings.ts     a settings page from sections
    tracker/                  a page with header tabs
      items.tab.tsx
      map.tab.tsx
  credits.card.tsx            a card screen, outside the buckets
  playfield.custom.tsx        a screen that draws its own layer
```

| Suffix | What Brock draws | The file default-exports |
|---|---|---|
| `.hero.tsx` | the bucket hub home | a component taking `HeroProps` |
| `.page.tsx` | a hub page in the section nav | a component taking `PageProps` |
| `<page>/<tab>.tab.tsx` | one header tab of that page | a component taking `PageProps` |
| `.settings.ts` | a settings page with search and reset | `Section[]`, or `(settings) => Section[]` |
| `.card.tsx` | a card screen with header and close | a component taking `CardProps` |
| `.custom.tsx` | nothing: the screen draws its own layer | a component taking `CardProps` |

A file may also export `meta: ScreenMeta` (`title`, `icon`, `order`, `shortcut`, `devOnly`, `requiresProfile`). Without a title the label comes from the file name. Pages sort by `order`, then by label.

```ts
interface BucketDef { id; title; icon: IconName; menu: 'entry' | 'submenu' | 'hidden'; groups?: { id; label }[]; shortcut? }
interface ScreensConfig { buckets: BucketDef[]; home: string; settings?: { bucket: string } }
interface CardProps { params; profile; open(target, params?); close() }
interface PageProps extends CardProps { bucket: BucketDef; page: string; tab: string | null }
interface HeroProps extends PageProps { slots: { Backdrop; Art; Facts; Actions } }
```

- `brock sync` scans `src/screens` and writes `.brock/screens.ts`. It imports each file's default export and its `meta`, and calls `buildScreenTree(config, entries)`. The renderer Vite plugin writes it again when the build starts and whenever a file under `src/screens` is added, renamed, changed or deleted, so `brock dev` reloads with the new registry. `brock check` fails when the file drifts.
- `buildScreenTree` makes one hub per bucket, in config order. The hero is the hub home; a bucket without one opens on its first page. Pages in the bucket folder form the bucket's own group, named after the bucket; group folders follow in the order of `groups`, then any other group by name. Card and custom files become screens; settings files become settings tabs.
- The bucket switch lists the buckets in config order and shows once there are two. The menu comes from the config: `entry` adds the bucket, `submenu` adds the bucket with one child per page, `hidden` adds nothing. The home bucket is the Home entry, and card screens get an entry of their own, except the ones Brock already lists (credits, about, profiles, settings). The derived entries go first among the app entries.
- Escape and Home open `config.home`. When the app has no base screen, the home bucket opens once at startup when a profile is already active.
- Settings live in a bucket: `settings.bucket`, or the home bucket. The app's `.settings.ts` pages stay where their files are, and the built-in tabs (`settings.tabs` and module tabs) join that bucket as one group per tab group. There is no separate Settings screen then: the Settings menu entry, the palette and Mod+Comma open the first settings page of that bucket, or the page a tab names.
- `open('<bucket>/<page>/<tab>')` opens a hub page directly, and a menu item can name `{ bucket, page, tab }` instead of `screen`.
- The hero frame has one wiring point, `packages/react/src/screens/kinds/hero-frame.constants.ts`. It maps the root and the four slots to Tessera parts; the Tessera Hero composite replaces them there.
- `brock structure` rejects a file with an unknown suffix, a bucket folder the config does not declare, a declared bucket with no folder, two heroes in a bucket, two pages with the same id in a bucket, a tab outside a page folder, a card or custom screen inside a bucket, and folders deeper than `<bucket>/<group>/<page>`. `screens.config.ts` may import only `defineScreens` and types, since the check loads it under Node.

## Build

```ts
defineBrockViteConfig(rootDir, overrides?)   // electron-vite: main electron/main.ts, preload electron/preload.ts, renderer src/ with index.html, the splash plugin (splash.html and the boot splash from the product config), React plugin, dedupe react, externalizeDeps excluding @drizztdourden08/*
createBuilderConfig(product, { rootDir })    // electron-builder: appId, productName, icons, artifact names, file associations, asarUnpack for Velopack, the afterPack hook
```

`brock` CLI: `sync [--check]`, `add <id | spec>`, `dev` (electron-vite dev), `build` (electron-vite build), `icons [--force]` (copies the Tessera brand set into `build/` and `public/logos/` and draws the bot variant; `dev` and `build` run it first), `start [-- args]` (runs `dist/electron/main.js` with Electron; automation args pass through, so `brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test), `package [--full] [--channel <name>]`.

## Packaging and releases

Apps ship the way Relic of the Past does: Velopack installs and updates them, GitHub Releases hosts the feed.

`brock package` is its own command because it is a release step, not part of the build loop: it needs electron-builder and the `vpk` .NET tool, and it takes minutes. It runs:

1. `brock build`.
2. electron-builder with `--dir` on Windows, `--dir` and `deb` on Linux, and `--mac` on macOS (dmg and zip). The `afterPack` hook removes the Velopack bindings for other platforms, drops `dxcompiler.dll` and `dxil.dll` on Windows, and stamps the app icon on the exe with rcedit, since `signAndEditExecutable` is off.
3. On Windows, `build/installer-splash.png`: the brand icon centred on `product.window.backgroundColor` at the splash size.
4. `vpk pack` into `release/velopack`, with the pack id, title, author and icon from the product, `release-notes/v<version>.md` as the notes when it exists (app root, then repo root), and `product.updateChannel` or `--channel` as the channel. `product.accent` becomes the installer progress colour. A routine release is the update package and the delta only; `--full` adds the Velopack setup as `<prefix>windows-payload.exe` and the portable build as `<prefix>windows-directory.zip`. Linux gets `<prefix>linux.AppImage`.
5. On Windows, with `product.repo` set, the small installer: `installer-stub/` (C++ and Win32, about 600 KB) compiled with the Visual Studio C++ tools after `product.h` is written from the product (name, pack id, main exe, accent, the `install.json` address), saved as `<prefix>windows-setup.exe`. It is built on every release, so `releases/latest/download/<prefix>windows-setup.exe` always resolves.
6. `install.json`, the recipe the stub reads from `releases/latest/download/install.json`: the stub generation, the version, and the URL and SHA-256 of the stub, the payload (run with `--silent`) and the directory zip. An entry this release does not carry is taken from the previous manifest, so a routine release still points at the last full one; the first release has to be `--full`.

### Platforms

`targets` in `brock.config.ts` lists platform ids (`windows`, `macos`, `linux`, `android`, `web`; `ios` is reserved and choosing it says it is not supported yet) and bundles (`desktop` is Windows, macOS and Linux; `mobile` is Android today and gains iOS later with no config change). Brock expands them. Each platform is a Strategy in `packages/build/src/platforms/<id>/` built with `definePlatform`: `doctor` checks this machine (Node 24 and pnpm for every app; .NET 8, vpk and the MSVC tools for Windows; .NET 8 and vpk for Linux, plus libusb and pkg-config when the input module is there; Xcode tools for macOS; JDK 21, `ANDROID_HOME` and the SDK packages for Android) and prints the install command for what is missing, never installing it. `scaffold` sets the platform up, one step per file. `ciJob` and `releaseJob` are the platform's jobs in the two workflows, and `secrets` lists what the release job reads. `create-brock` asks for the platforms (`--platforms a,b` without a terminal), and `<app> platform add | remove | list` changes them later through the same strategies. `<app> doctor [platform]` runs the checks alone.

- Android: `capacitor.config.json` at the app root (managed: `appId` from the product as a valid Java package, `appName`, `webDir: dist/web`, `android.path: mobile/android`), `cap add android`, the launcher icons and splash from the brand set through `@capacitor/assets`, and `mobile/android/app/build.gradle` patched to sign from `BROCK_KEYSTORE_*` and to read `versionCode` and `versionName` from `package.json`. `<app> mobile build [--release]` builds the APK beside the debug `mobile push`; `<app> mobile keystore` makes the release keystore with `keytool` once you agree and prints the `gh secret set` lines for `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS`.
- Web: the managed `vite.web.config.ts` builds the renderer alone with a relative base into `dist/web` and writes a web app manifest from the product (`web: { manifest: false }` drops it). The release carries it as a zip; there is no deploy job.
- Linux: `build/linux/deb-postinst.sh` (managed) installs each module's `udevRules` (the input module's controller rules) and runs the app's own `build/linux/after-install.sh`; electron-builder runs it after `dpkg -i`.

### Workflows

Both workflows are managed files: `brock sync` composes them from the chosen platforms for a standalone app, and `brock check` fails when they drift. `ci.yml` runs on pull requests and from the Actions tab with a `quality` job (install, `brock build`, `brock check`, lint and typecheck, markdown, structure, tests) and a `review` job that runs `<app> launch main none --prod --review` under xvfb on Linux and keeps the report, then each platform's CI job (`web` builds the web app). `release.yml` runs on `workflow_dispatch` with `version`, `full`, `prerelease` and `set_latest`: `prepare` checks the notes and the tag, lints, commits the version bump and tags it; one build job per platform (`build-windows`, `build-macos`, `build-linux` run `brock package`, Windows and Linux after `vpk download` fetched the previous release for the delta; `build-android` signs the APK from the secrets; `build-web` zips `dist/web`); `release` creates the GitHub release with the notes file as the body plus a Downloads list whose Windows link is the stub on the latest release. A module's manifest `ci` steps run before the install on the runners whose `os` matches. `brock adopt` writes `release.yml` once for a repo with `apps/<app>`. `brock release [version]` dispatches it.

## Automated review

Every Brock app carries a built-in review: `--review` (or `--review=<name>`, default `review`) is a headless automation flag like `--screenshot`. Run it with `<app> launch main none --review`, or `brock start -- --review --no-focus --muted --user-data=<dir>` after a build.

Once the shell is ready the renderer drives the real UI with DOM clicks and key presses and asks main for a PNG after each step. The tour covers the title bar (title, logo, search and bug report buttons, module slots), the first-run profile form, the menu (Home, Profiles, Settings unless it is home, About, Quit, icons, the Advanced section, Escape), every registered screen in its FullScreenLayer frame, each generated bucket and card (reached from the menu or the bucket switch, the hub listing every page, each page opening from its nav entry), Escape opening the home screen, the Ctrl+K palette, the bug report dialog, the About logo and version, and the logs widget. Main adds the global checks: the tour finished, the app version is not the Electron version, no renderer console errors, no failed loads, no main log errors, and a resolved window icon.

Main writes `Data/review/<name>/report.json` and `report.md` with the steps and their screenshots (`NN-<step>.png`), every check with pass or fail and a reason, and the console errors, failed loads and main log warnings seen during the run. It prints the `report.json` path and exits 0 when every check passes, 1 otherwise. A 60 s watchdog writes a partial report and exits 1. The tour code is its own chunk, loaded only on a review launch.

## Acceptance for a blank app

1. `pnpm create @drizztdourden08/brock my-app --local X:\brock --yes` writes the skeleton with `link:` dependency specs into the checkout, a `pnpm-workspace.yaml` holding the catalog of the versions the template uses, and `.npmrc`.
2. `pnpm install`, `pnpm lint` (tsc + eslint + stylelint) green.
3. `pnpm build` produces `dist/`.
4. `pnpm brock start -- --no-focus --muted --user-data=<tmp>` boots, writes `<tmp>/Data/app.json` and `profiles/`, and exits on `--screenshot=boot` or a timeout.
5. The owner launches it visibly from a handed-over command and sees the profiles screen, creates a profile, opens settings and about.

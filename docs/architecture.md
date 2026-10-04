<!-- @layer docs @kind doc -->
# Brock architecture

Brock is the base-app foundation for Electron + React desktop apps that share the Tessera design system. It is delivered as packages plus a builder: an app installs the packages it needs, and `create-brock` generates the thin skeleton around them. Fixes arrive through `pnpm update` and `brock sync`, never through a git merge.

## Packages

| Package | Runs in | Holds |
|---|---|---|
| `@drizztdourden08/brock-lint-config` | tooling | Brock's app preset on `@drizztdourden08/standards`: the same ESLint, stylelint and markdownlint factories and tsconfig bases, with Brock's extension |
| `@drizztdourden08/brock-core` | everywhere | product config, the open IPC contract, platform ports, storage and profiles, settings and feature gating, log bus, module manifest type, automation flags, registry |
| `@drizztdourden08/brock-electron` | main, preload | `/main`: `bootstrapApp`, paths, portable mode, window, splash, window state, IPC handlers, diagnostics, crash forensics, session log. `/preload`: `createPreloadBridge` |
| `@drizztdourden08/brock-react` | renderer | `BrockApp`, platform provider and hosts, stores kit, screen registry, shell views, settings engine |
| `@drizztdourden08/brock-build` | tooling | Vite and electron-builder config factories, ensure-electron, the platform strategies and the workflow Builder, the `brock` CLI (sync, check, add, dev, build, package, start, platform, doctor, web) |
| `@drizztdourden08/create-brock` | tooling | the scaffolder: `pnpm create @drizztdourden08/brock` |
| `@drizztdourden08/brock-updater` | module | Velopack updater, the title bar update action, UpdateDialog |
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

- `main`: a `MainModule` (brock-electron): `{ id, onBoot?(product), register(ctx), onWindow?(win, ctx), onWillQuit?(ctx), bootTasks? }`. `onBoot` runs before anything else in `bootstrapApp`, which is where the updater runs the Velopack hooks.
- `preload`: a `PreloadNamespace` (brock-electron): `{ id, build(tools) }` returning the nested `window.api.<id>` object.
- `renderer`: a `RendererModule` (brock-react): `{ id, screens?, settingsTabs?, menu?, Provider?, titleBarActions?, ports? }`.

`brock.config.ts` lists module ids. `brock sync` reads each manifest and regenerates `.brock/modules.main.ts`, `.brock/modules.preload.ts` and `.brock/modules.renderer.ts`, which import the module objects and export them as arrays. The app's own `electron/main.ts`, `electron/preload.ts` and `src/main.tsx` import those arrays. `brock add <id | package>` installs the package (the built-in registry maps `updater`, `secrets`, `input`, `display`, `port-kit` to their package names; anything else is an npm spec), appends the id to `brock.config.ts` and runs sync. App code is never edited by the tool.

## App skeleton

```
my-app/
  brock.config.ts                  OWNED      product input (ports.base included), targets, modules
  package.json                     OWNED ONCE
  electron.vite.config.ts          MANAGED    defineBrockViteConfig(import.meta.dirname)
  electron-builder.config.cjs      MANAGED
  eslint.config.mjs, stylelint.config.mjs, .markdownlint-cli2.mjs, tsconfig.json   MANAGED
  .brock/modules.{main,preload,renderer}.ts, .brock/manifest.json               MANAGED
  .brock/screens.ts                MANAGED    the screen registry, written from src/screens
  .brock/boot.{main,renderer}.ts   MANAGED    the boot task lists, scanned from the two boot folders
  .brock/widgets.ts                MANAGED    the widget list, written from src/widgets
  electron/main.ts                 OWNED ONCE bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers, ... })
  electron/boot/<id>.task.ts       OWNED      a main boot task
  electron/preload.ts              OWNED ONCE createPreloadBridge({ maps, namespaces: preloadNamespaces })
  src/product.ts                   OWNED ONCE defineProduct(config.product)
  src/index.html                   OWNED ONCE the page with an empty #root; nothing loads inside it before the reveal
  src/boot/<id>.task.ts            OWNED      a renderer boot task
  src/main.tsx                     OWNED ONCE <BrockApp product screenTree widgets modules bootTasks settings />
  src/theme.css                    OWNED      overrides over the brand palette (theme.css of tessera.config.json moves it)
  tessera.config.json              OWNED      where Tessera's tools put parts; $schema alone keeps the defaults
  src/settings.type.ts             OWNED      AppSettings
  src/settings.constants.ts        OWNED      the settings defaults
  src/ipc/contract.type.ts         OWNED      the augmentation
  src/ipc/contract.constants.ts    OWNED      the channel maps
  src/screens/screens.config.ts    OWNED      buckets, their menu placement, home
  src/screens/**                   OWNED      one screen per file, named by kind (see Screens by convention)
  src/widgets/<id>.widget.tsx      OWNED      one widget per file (see Widgets by convention)
  src/views, src/compounds, ...    OWNED      Tessera parts, beside src/screens and src/widgets (docs/app-structure.md)
  public/logos/icon.*, icon-32.png, icon-24.png, icon-bot.*, mark.svg  GENERATED by brock icons from the Tessera brand (icons.brand, from its icons.rim set); OWNED when the app ships its own art
  build/icons/*, build/splash/*    GENERATED by brock icons
```

Managed files are one-liners regenerated by `brock sync`; `brock check` fails CI on drift. Owned-once files are written at create and never touched again; a breaking skeleton change ships a migration.

`brock migrate` runs the Brock migrations after `--from`, then replays Tessera's `RENAMES.json` over the code the app owns: each release after `--tessera-from`, else `package.json#brock.tessera`, else the 0.3.0 baseline, up to the installed Tessera, plus its `next` release when Tessera is linked to main, then pins `brock.tessera` to the installed version. Renames touch only names imported from Tessera, whole custom-property tokens and bounded class names; a note in place of a name becomes a numbered to-do in the same report the upgrade verb reads. The rules are in `packages/build/README.md`, Tessera renames.

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
  bootTasks?: MainBootTask[];            // .brock/boot.main.ts
  paths?: { preload?: string; renderer?: string; splash?: string; splashPreload?: string };  // defaults under dist/electron: ../preload/preload.mjs, ../renderer/index.html, ../renderer/splash.html, ../preload/splash-preload.mjs
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

Boot order: Velopack hooks (updater module) -> portable mode -> `--user-data` -> `app.setName(product.id)` -> crash forensics -> app identity (AppUserModelId `product.appId` on every Windows launch, `<appId>.instance.<name>` for a named instance) -> privileged schemes (`product.schemes` + modules) -> whenReady: paths, data dirs (`product.dataDirs` + modules), session log rotation, the splash window, then the main boot tasks (see Boot) -> quit hooks.

Base handlers: window, app, dialog, file, storage, profiles, config, sessions, uiViews, diagnostics, network, session log, test:screenshot. `network:lanAddresses` (`getLanAddresses` in `BASE_INVOKE_MAP`) returns `lanAddresses()`: every non-internal interface address, IPv4 first, as `{ interfaceName, address, family, cidr }`. Main code calls `lanAddresses()` from `@drizztdourden08/brock-electron/main` directly. `diagnostics:getSystem` (`getSystemDiagnostics`) returns the host facts for a bug report; `diagnostics:getProcesses` (`getProcessDiagnostics`) returns `ProcessDiagnostics`: every process of `app.getAppMetrics()` (`pid`, `type`, `name`, `cpuPercent`, `workingSetBytes`, `privateBytes`, and `window`: the Brock window a renderer process draws, `main` or a widget id, else `null`), the main process `process.memoryUsage()`, `uptimeSeconds`, `windowCount`, `widgetWindows` (`id`, `visible`, `sync`, `cluster`), `ipcCalls` (every invoke and send main has handled through `handle` and `on`), the runtime versions, the GPU feature status and `memoryTotalBytes`, the system memory. The performance widget polls it.

Window rules are fixed: the app window is created with `show: false` at its restored bounds and is never shown or resized before the reveal. An automation launch (`flags.isHeadlessLaunch()`) places both windows off every monitor, `focusable: false`, `showInactive`, kept in the background. `--muted` and `--sound` are forwarded to the renderer as `--startup-muted` / `--startup-sound`, never applied to the webContents.

## Boot

The splash window is the only loading screen. Nothing loads inside the app window before it appears.

1. On ready, main opens the splash: no frame, no border, no rounded corners, no shadow, not resizable, centred on the display the app will open on. It shows the gradient, the mark without its tile, the app name, a status line, a thin bar on the bottom edge and the version.
2. Main runs its boot tasks. `modules` registers the base handlers, module `register`, app handlers and `onReady`. `window-state` runs after it and creates the hidden app window at its saved bounds. Module and app main tasks run after `modules`.
3. The renderer runs its boot tasks: `profiles`, `settings`, `fonts`, `images` (the brand logos decoded), module and app tasks, then `first-frame`, which waits for every other task and resolves once the home screen has painted.
4. Both sides report weighted progress, the running label and a detail line. Main joins them and relays one bar to the splash.
5. When every task resolved and the first frame arrived, the splash fades from 1 to 0 while the app window shows at 0 and fades to 1 over the same 220 ms. Then the splash is destroyed.

A task is `defineBootTask({ label, weight?, after?, timeoutMs?, run })`. The id comes from the file name: `src/boot/<id>.task.ts` runs in the renderer, `electron/boot/<id>.task.ts` in main. `brock sync`, `brock build` and `brock dev` write the lists to `.brock/boot.renderer.ts` and `.brock/boot.main.ts`. Modules add tasks through `bootTasks` on `MainModule` and `RendererModule`. `run` receives `report(fraction, detail?)`, an `AbortSignal` and the side's context: the main context in main, `{ product, profile }` in the renderer. The runner in brock-core starts a task once everything in its `after` list is done, runs independent tasks together, aborts a task at its timeout (default 20 s) and stops on the first failure.

A failed or timed out task stops the boot on the splash with the error and Retry, Open logs and Quit. Retry reloads the app window when only a renderer task failed, and relaunches the app otherwise. The watchdog turns 8 s of silence from the renderer (30 s in development) into the same error screen; the renderer sends a heartbeat every second while its tasks run. The app window never shows half loaded.

The look comes from `resolveLook(product, sources)` in brock-core: `product.look = { gradient: [from, to, via?], angle? }` first, then the Tessera brand gradient (`brands.<brand>.gradient` and `angle` in the Tessera package `tokens.json`), then a gradient derived from the palette seeds (`--p-primary` from the app theme, `theme.css` of `tessera.config.json` or `src/theme.css`, else from the brand palette `palettes/<brand>.css`, else Tessera's default palette, into `--p-black`). The build resolves it and writes `splash.html`: static HTML with `data-palette` set to the brand, Tessera's token stylesheets, the brand palette, the app theme, two inlined font faces, the look as custom properties and the page stylesheet (`packages/build/src/splash/splash-page.css`, tokens only). The page talks to main through the splash preload (`window.brockSplash`). An app that ships `src/splash.html` replaces the generated page.

`--screenshot-splash=<name>` writes `Data/screenshots/<name>.png` of the splash mid-boot, and `<name>-failed.png` when the boot stops, then quits unless `--review` or `--screenshot` also runs.

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
  widgets={appWidgets}            // from .brock/widgets.ts
  modules={rendererModules}
/>
```

An app not yet on the convention still passes `screens`, `home` (the base layer once a profile is active), `menu`, `homeScreen` and `credits`, and `settings.tabs`. Both can be given: the `screens` and `menu` props are added beside the generated ones.

- `defineScreen({ id, title, icon?, render(ctx), layer?: 'fullscreen' | 'own', keepMounted?, devOnly?, group?, shortcut?, requiresProfile?, subtitle?(ctx), extra?(ctx), floating?(ctx) })`. `icon` is an icon name, as in menu entries and `ScreenMeta`, or an element. A fullscreen screen sits in the reference frame: a 90% card over a scrim (with a base screen under it, `ScreenHost` draws `screen-host__scrim`, Tessera's `--c-scrim`, over the base layer while the screen or hub is open, so the base content no longer shows through around the card or under the bucket switch), one header with title, subtitle, `extra` and the close button, `floating` overhanging the top edge, a 0.2 s entrance. Built-in screens: `profiles` (list, create, delete; the setup screen when no profile exists), `settings` (the hub over `settings.tabs`), `about`, and `credits` when the app gives credits.
- `defineHub` makes a fullscreen screen too: the hub title and profile name in the header, the hub switch as `floating` when two hubs or more exist.
- Home: `product.homeScreen` (default `settings`) is the target of the Home menu entry and of Escape when nothing is open.
- Menu order: Home, Profiles, Settings (unless it is home), app entries, sections, module entries, Credits, About, Quit, each built-in with an icon. `MenuItem.section` files an entry under a submenu (`widgets`, `advanced`, or a new one named after the id); `devOnly` entries and the built-in Dev Console need developer tools (development, or the `developerToolsEnabled` setting).
- `useNavigation()`: `{ active, params, open(id, params?), close() }`, backed by a zustand store so non-React code can call `nav.open`. Escape order: a registered escape layer (`useEscapeLayer`), the dialog, the open screen, then open home.
- `useProfiles()`: `{ profiles, active, select, create, remove, refresh, lastProfileId }` over the platform `FileStore` and `createProfileStore`. `setLast` is skipped on an automation launch.
- `useSettings<S>()`: `{ settings, patch, hydrated }` from `createSettingsStore<S>({ defaults, load, save })`, one per profile, debounced save to `config.json`.
- Startup is the `profiles` boot task: pinned instance profile (fail loudly if missing) -> single profile -> last profile -> the `profiles` screen. `useBootStore` holds the renderer boot phase; the review tour starts when it is `ready`.
- Logos come from `product.logos`: `app` (default `./logos/icon-32.png` with `icons.brand`, the 32 px icon that keeps the rim crisp at the title bar's 20 px; `./logos/icon-256.png` without one) in the title bar and the about screen, `mark` (default `./logos/mark.svg`, the mark without its tile) on the splash, `instance` (default `./logos/icon-bot.svg`) for a named instance's window icon. The title bar draws `logos.app` for every launch and marks a named instance with the instance badge alone. The title bar hides in `borderless` and `fullscreen` window modes, read from the `windowMode` setting.
- `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's rimmed icon set, `brand/<rim>-rim/<brand>/` and `brand/<rim>-rim/<brand>.svg`: the same layout as the plain set, with a thin outline in the rim colour that follows the silhouette, never tiled, so a dark mark reads on a dark title bar, taskbar or splash. `defineProduct` sets `'light'` when `icons.brand` is `'brock'` (Brock uses the light rim on dark surfaces) and no rim for other brands. `brock icons` copies `public/logos` and `build/icons` from that tree, so the window icon, the title bar logo, the splash mark and the bot variant carry the rim; the installer and Setup splash read their mark from it; the About panel draws the bare mark with `rim`.
- Shell views are Tessera composites wired by Brock: `WindowTitleBar` (product name, the hamburger menu, instance badge, the title bar actions, window controls), `CommandPalette`, `InfoScreen` for About, `SideNavLayout` with `SearchResults` for hubs and settings, `SettingsPage` with one `SettingsSection` per section, and `SideNav` as the screen rail. Brock keeps `SettingsHub<S>`, `SettingsLayout<S>`, `ConfirmDialog` and `ScreenLayer` as wiring.
- Brock compounds draw the app concepts Brock owns from Tessera parts. The root `tessera.config.json` lists their folders as `parts.compounds`: `packages/react/src/compounds` (`AboutPanel`, `ProfilesPanel`, `ReleaseNotesPanel`, exported from brock-react) and `packages/modules/input/src/compounds` (`CalibrationPanel`, exported from `@drizztdourden08/brock-input/renderer`). Each is made with `brock tessera new compound <Name> --into <folder>` and has a `<Name>.usage.ts`; with `guide.usage` set to `enforce` in `tessera.config.json`, Tessera's standards extension fails `brock structure` on a missing or stale usage file, and `brock tessera check` checks them on their own. The root `tsconfig.json` maps the two package entries so the usage examples import them by name. The built-in Profiles screen uses `ProfilesPanel` (pick, create, rename, delete), the updater dialog `ReleaseNotesPanel`, and the input tester `CalibrationPanel`.
- `RendererModule { id; screens?; settingsTabs?; menu?; Provider?; titleBarActions?: TitleBarActionSource[]; searchActions?: SearchAction[]; widgets?: WidgetDef[]; bootTasks?: RendererBootTask[]; ports?: Partial<Record<HostShell, Partial<PortCreators>>> }`. A module menu entry with `section` joins that submenu; one without sits before Credits. Ports are merged into the host factory with `withPorts`.
- `titleBarActions` is how a module puts something in the title bar, since brock-react cannot import a module. Each entry is a Tessera `WindowTitleBarAction` (`{ id, label, icon, onSelect, bar?: 'button' | 'status' | 'menu', status?, tone?, shortcut? }`), or a hook that returns one (`TitleBarActionHook`) when it reads state. `BrockApp` puts `STANDARD_TITLE_BAR_ACTIONS` (Search with Ctrl+K, Report a bug) first, then the actions of every module in load order, and resolves the hooks in that fixed order every render. `WindowTitleBar` draws each `button` action as an icon button and each `status` action as a pill while its `status` is set, and lists every action in the hamburger too, with `status` as the subtitle, beside a View sub-menu holding the pin and full screen. As the bar narrows the buttons fold away (last declared first), then the pin, then the pills, then full screen, then the title, and the logo shrinks. An action whose `id` is the key of a menu entry replaces that entry in the hamburger, so Report a bug and Check for updates are listed once; the palette still searches the full menu. Brock puts the trailing Quit in a group of its own, so the bar's group sits just above it. The updater contributes `useUpdateAction`: Check for updates, a `status` pill reading "Update available" while a found update waits, which opens the dialog.

Every app gets the standard features below. `StandardOverlays` mounts the overlays in one place inside `AppShell`: `<StandardOverlays menu={fullMenu} actions={merged.searchActions} />`: the confirm dialog, the palette, the bug report dialog and the toasts. A popped widget window mounts `<StandardOverlays />` too, without the palette, and registers the same escape layers, so `confirmAction`, `toast` and the bug report work there. The widgets are not an overlay: `AppShell` renders `WidgetHost` with the screen host as its `main` view, so docked widgets take room from the home or game view instead of covering it.

- Search palette: Ctrl+K (Cmd+K on macOS) or the Search title bar action opens it; Escape or the scrim closes it. Inside an open hub, Ctrl+K focuses the hub search instead. It searches the one index described under Search. A boolean field gets an inline toggle, and Ctrl+Enter flips it from the keyboard. Picking a result opens its bucket, page and tab, then scrolls to the row and flashes it. An app or module adds actions with `RendererModule.searchActions`, `registerSearchActions(actions)` (returns the unregister call) or `useSearchActions(actions)`. `palette.open()`, `palette.close()` and `usePaletteOpen()` drive it from outside.
- Bug report: `bugReport.open()` or the Report a bug title bar action opens a dialog for a title and a description. It attaches the debug text (app version, runtime, platform, recent log lines, and the host facts from `diagnostics:getSystem`) and opens a prefilled GitHub issue on `product.repo` in the browser. No token is involved. Without a repo the report goes to the clipboard.
- About: Version, Runtime, Engine and Platform rows, and Copy debug info with the same debug text (`useDebugText`). The screen is Tessera's `InfoScreen` (no page header, only the window title bar; the screen declares `header: 'none'`) holding Brock's `AboutPanel`, which shows the logo and the app name, with the legal text in its footer. When `product.icons.brand` is a Tessera brand whose name is the product name, `AboutPanel` draws that brand's app icon and wordmark, or its bare mark with the `product.icons.rim` rim when it has one; any other app shows `product.logos.app` and its name. Every Tessera copy button writes through `writeClipboard`, which `BrockApp` gives `TesseraProvider` as `overrides.writeText`; the `AboutPanel` copy button uses `useCopyText`.
- Title bar: `WindowTitleBar` draws the hamburger and the menu from `MenuGroup[]`. Brock keeps its own `MenuEntry` model and converts it at the edge with `toMenuGroups(menu, { openScreen })`: `key` becomes `id`, `screen`, `bucket`, `page`, `tab` and `onClick` become `onSelect`, `'separator'` becomes `{ separator: true }`, and a bucket's or a page's `shortcut` shows beside its entry (display only; `Mod` reads as Ctrl). An empty menu hides the hamburger. `product.window.titleBar.controls` (`fullscreen`, `pin`, `minimize`, `maximize`, each `true` by default) turns title bar buttons off; close always stays. With `maximize: false` the main window is created `maximizable: false`, and with `fullscreen: false` it is `fullscreenable: false` and Alt+Enter and the fullscreen IPC do nothing. It sits beside `product.widgets.mainLabel` in `brock.config.ts`.
- Toasts: `toast(message, { variant?, duration? })` works from anywhere and returns an id for `dismissToast(id)`. `ToastHost` renders the Tessera `ToastContainer`.
- Widgets: `defineWidget({ id, label, render, ... })` describes a tool panel for the Tessera `WidgetManager` v2, which draws a `DockLayout` split tree around the main view: panes docked on an edge or tabbed together, widgets floating over the main view, and widgets in their own OS window. The dock names the main view `product.widgets.mainLabel` (default `Main`); the saved layout key stays `main`. Widgets come from the app's `src/widgets` files (see Widgets by convention), `RendererModule.widgets`, the `widgets` prop of `BrockApp` or `WidgetHost`, or `registerWidgets(defs)`. The layout is `{ v: 2, dock, floating, popped, frame, poppedMemory? }`; a stored layout goes through `migrateLayout` on load, so the flat layouts of earlier builds keep working. The layout and each widget's `useWidgetPref` values are kept per profile in `ui-views.json` through the `uiViews` IPC, under `profile:<id>`. `useWidgetMenuEntries()` returns checkable items for a Widgets menu, sorted by the definition's `order`, then by label, and `widgets.open(id)`, `widgets.close(id)`, `widgets.toggle(id)` and `widgets.popOut(id)` work outside React. The built-in `logs` widget is a filterable, searchable view of the log bus. The built-in `performance` widget (closed by default, listed in the Widgets menu for everyone, since a bug report needs it most when developer tools are off) is drawn with Tessera's chart parts: a row of `StatTile`s (frame rate, CPU, memory, event loop lag), each with the latest value, its change since the previous sample with a trend arrow, and a `Sparkline` of the last 60 samples; `Gauge`s for the app's CPU, its share of system memory and the JS heap against its limit, each with warning and danger zones; a `StackedBar` of memory by process (main, renderer, GPU, utility, widget windows, other) with a legend; an Activity list of long tasks since the widget opened and the errors and warnings since start; and a collapsed Details section with every reading as `StatRow`s. A container query lays it out: two tiles a row and the panels stacked when docked (280 to 360 px), four tiles a row and the gauges beside memory and activity from 560 px; the gauges take the largest size that fits. The readings come from the renderer (frame rate and frame time from `requestAnimationFrame`, long tasks from a `longtask` `PerformanceObserver`, event loop lag from a 100 ms timer's drift, the JS heap where `performance.memory` exists, the DOM node count), from `diagnostics:getProcesses` (every process with its CPU, working set and window, the main process memory, uptime, window count, each widget window with its sync and how many windows it is snapped with, IPC calls per second from a counter in brock-electron's `handle` and `on`, the Electron, Chrome and Node versions, GPU compositing, the system memory) and from the app (version, screen and route, profile, open widgets, modules, warnings and errors counted by the app log bus). Its options panel sets the refresh (0.5, 1, 2 or 5 s, saved with `useWidgetPref`) and the sections shown (Renderer, Processes, App); a hidden section is neither drawn nor sampled. Sampling runs only while the widget is on screen (an `IntersectionObserver` on its root, plus the page visibility), so a closed, tabbed-away or minimized widget costs nothing; each sample is one state update and the chart parts change attributes on the same elements. The widget body is Tessera's slim `ScrollArea`, so the widget adds no scroll box of its own. Copy snapshot puts every reading on the clipboard as text for a bug report.
- Widget windows: a definition with `popOut: true` may leave the app for a frameless window of its own (the pop out button, the options panel, or a drag past the window edge, which opens the window under the cursor). brock-electron owns those windows end to end (`packages/electron/src/main/widgets`); Tessera only draws `DockLayout` and `Widget`. A popped window is synced with the main window by default: on Windows the app window owns it, so it never falls behind the app, and it hides, shows, minimizes, restores and raises with the app without taking the focus, and stays visible when another app takes the focus. A synced window has no taskbar entry unless its definition sets `taskbar: true`. Turning the per-widget `sync` option off ("Sync with main window" in the options panel) makes the window independent: its own taskbar entry, its own minimize, and the app no longer raises it. `sync` is saved with the popped entry, and a synced window also mirrors the app's own always-on-top. The pin is a separate choice of two: a normal window or always on top. The widget window passes `pin` and `onPinChange` to Tessera's `Widget`, which draws its pin menu in the title bar (the current choice as its icon, lit while on top, and a menu of both choices with a line on each), and to `WidgetOptions`, which draws the Pin row with the same two choices. The former `with-app` pin was the same thing as sync, so a saved `with-app` pin opens as `off` with `sync` on, and the corrected entry goes back to the layout. On `will-move` a dragged widget window snaps within 14 px to the app and to the other widget windows, from the cursor and the grab offset so a scaled display never grows the window; a plain drag is left to the OS, and on the tick a window crosses into a display of another scale the OS moves it alone. The app snaps the same way to the widget windows. A snap kept on release links the two windows. A snap cluster is every window that touches the dragged one, directly or through other windows, the app included: two windows touch when they have flush edges, within 1 DIP, that overlap, or share a corner. It is computed from the window bounds when a move or a resize starts, so a window touching two others belongs with both, joined with the saved links, which keep a cluster together while the app is maximized or minimized and are restored with the layout; nobody picks it. Dragging any window of a cluster moves the whole cluster rigidly: only the dragged window snaps, to windows outside the cluster, and a window or cluster it is dropped against joins it. Holding Ctrl while moving drags that window alone: it leaves its cluster, its links break (a window that was linked to it relinks to another window it is still flush with, if any) and it can snap elsewhere. A window that touches no other and has no link moves alone. A change of the app's size made by code, not by a drag, tows the windows linked to the edge that moved, and along the edge they keep their place while they still touch it. Every move, towed or not, reports its bounds, the reports are flushed when the app closes or quits, and the link is saved with the layout and restored when the window reopens. When a display is added, removed or changes, a window whose title strip is out of every work area comes back into the nearest one. Snapping also lines up corners: a window landing on an edge lines its other side up with the corners and edges of the windows around, within the same 14 px, and two windows meeting corner to corner snap without a link. On `will-resize` only the dragged edge moves: it snaps to the matching edges of the neighbours (left and right edges to left and right edges, top and bottom to top and bottom), so windows line up into a grid, and the edges on the dragged line at drag start are locked to it and follow, never below a window's minimum size (a window at its minimum stops the whole line): each facing edge across the seam that overlaps a window already reached along the line, and each edge on the same side, lined up within 1 DIP, that meets a window already reached end to end or overlaps it. Two widgets stacked with their left edges lined up therefore resize those edges together, two widgets stacked against the app's left edge both follow the app's edge, either widget's right edge moves the app's edge and the other widget's, and a widget's bottom lined up with the app's bottom moves the app's bottom. An edge that does not line up is left alone, and once Ctrl has moved an edge off the line it no longer follows. A resize never moves a cluster, and there is no proportional scaling outside a cluster maximize or full screen. The app's aspect lock (`window:setAspectRatioLock`) applies to the app window alone: it is enforced on the main window's `will-resize`, a widget window never inherits it, and while it is set the app keeps its proportions and is never bent by a widget's shared or lined-up edge. Holding Ctrl while resizing turns snapping off and resizes only the dragged window; main reads Ctrl from the `before-input-event` and `input-event` of every Brock window, so a key or mouse event in any of them updates it. The window being moved or resized, a widget window or the app, draws a guide over its own content with the mode, whether snapping is on, and the rules: touching windows move together, Ctrl moves one window alone, edges lined up with or touching the dragged edge move with it, an app with a locked aspect ratio keeps its shape, and Ctrl resizes one window alone without snapping. `widget:guide` goes to that window only, with `pointer`, the cursor (`screen.getCursorScreenPoint()`) in that window's client pixels, read again on every `will-move` and `will-resize`, so `WindowGuideOverlay` draws its card beside the cursor; the window that held the guide before gets a closed state, and the guide hides when the drag ends. A cluster acts as one window. Maximize scales every member's bounds proportionally from the cluster's bounding box into the work area of the display the cluster is mostly on (where a minimum size stops the scale, the shared edges are repacked so every member stays inside the area, in order and still flush), and restore puts back each member's exact bounds; full screen does the same into the display's full bounds, opens a frameless, non-focusable black backdrop window behind the members, holds them above other windows while one of them has the focus, and sends each renderer a `square` flag, which `BrockApp` passes as Tessera's `square` to the open screen's `ScreenLayer` and the widget window to its `Widget`, so they drop their radius and border; minimize and restore apply to every member. The app's own maximize, full screen and minimize controls, and Electron's maximize and minimize events, go through the cluster when the app is in one. Closing a widget closes that widget alone, and closing the app closes it as before (the widget windows close and stay in the layout). There are no manual window groups: a `group` left in a saved popped entry is dropped when the layout loads, and the old `config/window-group.json` is deleted at start. Tessera draws the controls: the popped options panel passes `sync` and `onSyncChange` to `WidgetOptions` (the "Sync with main window" switch), and the guide is Tessera's `WindowGuideOverlay` with Brock's own hints (`defaultHints={false}`), drawn by `WindowGuide` in the app shell and in each widget window. A button of Brock's own in a widget title bar goes through `Widget`'s `titleBarActions` or `WidgetManager`'s `widgetActions(id)`, never a portal into `.widget__titlebar-actions`. The `devOnly`, context-only and frame `show` gates apply to popped widgets too: a hidden one closes its window, keeps its place in the layout and reopens where it was. Dragging a window back in: while the cursor is on the dragged window and over the app content, and no other widget window lies above the app there, the window turns translucent and the app draws the dock drop hints; a release there docks it (the release is kept until the dock answers, so no render can lose it). Each window carries a sequence number so a late close never docks a widget popped again since, and closing the window itself (Alt+F4) closes the widget. Pop in docks the widget back into the pane it left, at the same place among that pane's tabs, while that pane still exists (Brock remembers it for the session when the widget pops out); otherwise it docks at `defaultSide`. The window loads the same renderer with `?widget=<id>`, where `BrockApp` draws only that widget in `Widget mode="out"`; `useWindowKind()` returns `{ kind: 'main' }` or `{ kind: 'widget', id }`, and `widgetWindowId()` the id or null, for code that must know where it runs; the main window relays the widget frames, the widget prefs, the active profile with the settings, and the log as increments to it (`widget:publish`, `widget:relay`), and a pref or a setting changed in the widget window goes back to the main window (`widget:setPrefs`, `widget:patchSettings`), which saves it with the profile as if the widget were docked. On an automation launch (`--no-focus`) a widget window opens off screen, cannot take the focus and stays behind; `--muted` mutes it. The IPC contract lives in brock-core, `ipc/widget-contract.type.ts`.
- The menu files the `useWidgetMenuEntries()` items under Widgets and adds Report a bug to Advanced. The palette and the bug report dialog are escape layers, so Escape closes them before anything else.
- `STANDARD_TITLE_BAR_ACTIONS` (Search, Report a bug) come before the module actions.

Small helpers every app gets from brock-react, one per file:

- `confirmAction({ title, message, confirmLabel?, cancelLabel?, variant? })` shows the shell's confirm dialog and resolves `true` on confirm, `false` on cancel or Escape. A second call cancels the first. It is the one confirmation API: `dialogs.confirmDelete` is deprecated and calls it with a red Delete button.
- `useNow(intervalMs, active = true)` returns `Date.now()` and ticks while `active`.
- `useCopyText(resetMs = 2000)` returns `{ copied, error, copy(text) }`; `copied` goes back to false after `resetMs`.
- `useKeyedGuard()` runs async work under a key: `guard(key, work)` marks the key busy, clears its old error and records a new one when the work throws. `isBusy(key?)`, `errorOf(key)` and `clearError(key?)` read and reset it, and `lastError` is the most recent error still set, for a view with one alert. The state lives in the pure `keyedGuardReducer`.
- `hostApi<M>()` returns `window.api` or null. `M` names the app's own maps (`{ invoke?, send?, events? }`, `typeof APP_INVOKE_MAP` and so on) and adds their methods to the base ones; without it the type is the base `IpcApi`. `requireHostApi<M>()` throws instead of returning null.
- `SearchAnchor` (`anchor`, `className?`, `children`) marks where a search hit on a custom page lands, so a page never writes `data-search-anchor` by hand.
- `redactSecrets(line)` (brock-core) masks bearer and basic credentials, `key=value` pairs whose key names a token, secret, password or key, credentials inside a URL, and known token shapes (GitHub, GitLab, npm, Slack, `sk-` keys, Google, AWS, JWT). The debug text and the bug report run every log line through it.

Tessera is imported as `@drizztdourden08/tessera/*`; `tokens.css` first, then the app's `theme.css`. `BrockApp` imports Tessera's brand palettes into the `ds.palette` layer and sets `data-palette` on the document root to `product.icons.brand`, so the app shows its brand's colours and an unlayered `theme.css` seed still wins. The installer takes its neutrals from `tokens.json` `palettes.<brand>.dark` while `theme.css` sets no seeds, else from `theme.dark`.

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
    tracker/                  a page with tabs beside its title
      items.tab.tsx
      map.tab.tsx
    tracker.page.ts           the tracker page's meta (icon, order)
    controls.custom.tsx       a custom page: standard frame, free content
  credits.card.tsx            a card screen, outside the buckets
  playfield.layer.tsx         a full-bleed screen that draws its own layer
```

| Suffix | What Brock draws | The file default-exports |
|---|---|---|
| `.hero.tsx` | the bucket hub home | a component taking `HeroProps` |
| `.page.tsx` | a hub page in the section nav | a component taking `PageProps` |
| `<page>/<tab>.tab.tsx` | one tab of that page, beside the page title | a component taking `PageProps` |
| `<page>.page.ts` | nothing: the meta of the tab page in the `<page>/` folder beside it | only `meta: ScreenMeta` |
| `.settings.ts` | a settings page with search and reset | `Section[]`, or `(settings) => Section[]` |
| `.custom.tsx` | a hub page whose content is built by hand | a component taking `PageProps`, and `searchEntries` |
| `.card.tsx` | a card screen with header and close | a component taking `CardProps` |
| `.layer.tsx` | nothing: the screen draws its own layer | a component taking `CardProps` |

A file may also export `meta: ScreenMeta` (`title`, `icon`, `order`, `shortcut`, `devOnly`, `requiresProfile`, `keywords`). Without a title the label comes from the file name. Pages sort by `order`, then by label. A tab page has no file of its own, so its meta sits in `<page>.page.ts` beside the folder: its `title`, `icon`, `order`, `shortcut`, `devOnly` and `keywords` name and place the page in the nav and the search index, and each tab file's own `meta` names that tab. Without the file the page is the folder name in title case with a list icon. The tabs draw in the page header beside the title, Tessera's `SettingsPage` `tabs`, the same strip a settings page uses for its section anchors.

```ts
interface BucketDef { id; title; icon: IconName; menu: 'entry' | 'submenu' | 'hidden'; groups?: { id; label }[]; shortcut? }
interface ScreensConfig { buckets: BucketDef[]; home: string; settings?: { bucket: string; page?: string } }
interface CardProps { params; profile; open(target, params?); close() }
interface PageProps extends CardProps { bucket: BucketDef; page: string; tab: string | null }
interface HeroProps extends PageProps { slots: { Title; Eyebrow; Backdrop; Shade; Art; Actions; Tools; Facts; Aside; Panel } }
```

- `brock sync` scans `src/screens` and writes `.brock/screens.ts` and `.brock/search.ts`. The first imports each file's default export and its `meta`, and calls `buildScreenTree(config, entries, searchIndex)`. The renderer Vite plugin writes both again when the build starts and whenever a file under `src/screens` is added, renamed, changed or deleted, so `brock dev` reloads with the new registry. `brock check` fails when either file drifts.
- `buildScreenTree` makes one hub per bucket, in config order. The hero is the hub home; a bucket without one opens on its first page. Pages in the bucket folder form the bucket's own group, named after the bucket; group folders follow in the order of `groups`, then any other group by name. Custom pages sit in the nav like any page. Card and layer files become screens; settings files become settings tabs. A generated hub has its search on.
- The bucket switch lists the buckets in config order and shows once there are two. The menu comes from the config: `entry` adds the bucket, `submenu` adds the bucket with one child per page, `hidden` adds nothing. The home bucket is the Home entry, and card screens get an entry of their own, except the ones Brock already lists (credits, about, profiles, settings). The derived entries go first among the app entries.
- Escape and Home open `config.home`. When the app has no base screen, the home bucket opens once at startup when a profile is already active.
- Settings live in a bucket: `settings.bucket`, or the home bucket. The app's `.settings.ts` pages stay where their files are, and the built-in tabs (`settings.tabs` and module tabs) join that bucket as one group per tab group. There is no separate Settings screen then: the Settings menu entry, the palette and Mod+Comma open `settings.page` when the config names a page of that bucket, else the first settings page of that bucket, or the page a tab names. `brock structure` names a `settings.page` the bucket does not hold.
- `open('<bucket>/<page>/<tab>')` opens a hub page directly, and a menu item can name `{ bucket, page, tab }` instead of `screen`.
- The hero frame has one wiring point, `packages/react/src/screens/kinds/hero-frame.constants.ts`: `HERO_FRAME` names the Tessera `Hero` composite and builds one slot component per Hero slot. A hero page renders the slot components it needs (`<Title>`, `<Eyebrow>`, `<Backdrop>`, `<Art src alt pixelated />`, `<Actions>`, `<Tools>`, `<Facts rows />`, `<Aside>`, `<Panel>`); each hands its value to the frame, which draws one `Hero` with them. The frame passes `product.icons.brand` to `Hero` as `brand` when it is a Tessera brand, so a branded app shows its brand backdrop, and a hero that renders no `<Art>` gets the brand's mascot (`mascotForBrand`), or its `BrandMark` when the brand has none. A hero left with no art and no backdrop (an app with no Tessera brand) shrinks to its content and sits at the top instead of keeping the full hero height.
- `brock structure` rejects a file with an unknown suffix, a bucket folder the config does not declare, a declared bucket with no folder, two heroes in a bucket, two pages with the same id in a bucket, a tab outside a page folder, a card or layer inside a bucket, a custom page at the root, a custom page without a `searchEntries` export or with one the build cannot read, and folders deeper than `<bucket>/<group>/<page>`. It also prints the number of custom pages per bucket, so the exceptions stay visible. `screens.config.ts` may import only `defineScreens` and types, since the check loads it under Node.

### Custom pages and layers

A custom page is `<page>.custom.tsx` inside a bucket. It keeps everything standard around it: the hub frame, the nav entry, the header with title and tabs, Escape and search. Only the content is free. It must export `searchEntries: SearchEntrySeed[]`, a literal list of `{ label, keywords?, anchor?, description? }`, so it never hides from search; an empty list is allowed. An element on the page is wrapped in `<SearchAnchor anchor="<anchor>">` for the jump.

A full-bleed layer at the root (a game view, a debug canvas) is `<id>.layer.tsx`. It used to be `<id>.custom.tsx`: the `custom-layer-rename` migration renames it, and `custom` now always means a page with the standard frame.

## Widgets by convention

A widget is a file too, placed like a screen: `src/widgets/<id>.widget.tsx`, flat, one per widget. The file name is the id.

```tsx
const meta: WidgetMeta = { label: 'Players', icon: 'users', defaultVisibility: 'context-only', defaultSide: 'top', popOut: true };

const PlayersWidget = () => <SessionWidget id="players" />;

export default PlayersWidget;
export { meta };
```

- The default export is the component. `meta: WidgetMeta` is optional and holds the `defineWidget` fields other than `id` and `render`: `label` (the id in title case without it), `icon`, `order` (the Widgets menu sorts by it, then by label), `popOut`, `devOnly`, `taskbar`, `defaultVisibility` (`'context-only'` shows it only while the app is in a context, a running session for example), `defaultSide`, `defaultDockedSize`, `defaultFloatingSize`, and `settings`, a component drawn in the widget's options panel.
- `brock sync` scans `src/widgets` and writes `.brock/widgets.ts`, which imports each file's default export and `meta` and exports `appWidgets = widgetsFromFiles([{ id, component, meta }])`. The file is written for every app, empty when there are no widgets, so `src/main.tsx` always imports it and passes `widgets={appWidgets}` to `BrockApp`. The renderer Vite plugin rewrites it when the build starts and on every change under `src/widgets`; `brock dev` and `brock build` also rewrite it before electron-vite starts; `brock check` fails when it drifts.
- `BrockApp` adds the `widgets` prop to the module widgets and hands the list to `WidgetHost` and, in a popped window, to `WidgetWindow`, so a widget file pops out like any other widget. `defineWidget`, `registerWidgets` and `RendererModule.widgets` keep working beside it; a module still ships its widgets through its renderer entry.
- `src/widgets` holds widget files only. `brock structure` reports a file that is not `<id>.widget.tsx`, a folder, an id that is not kebab-case, a widget file with no default export, a literal `meta` with a key that is not a widget field, and an id Brock's own widgets use (`logs`, `performance`). A widget with parts imports them from `src/views` or the design package. `brock-lint-config` lets widget files default-export and export `meta` beside it.
- Brock's built-in widgets follow the same shape inside brock-react: `packages/react/src/widgets/built-in/logs.widget.tsx` and `performance.widget.tsx`, each beside its component folder, listed by `BUILT_IN_WIDGETS` through the same `widgetsFromFiles`.
- The `widget-files` migration (0.11.0) adds `widgets={appWidgets}` and its import to `src/main.tsx`, and turns every hand-made widget (a `defineWidget` call, a `registerWidgets` call, a hand `widgets` prop) into a to-do naming `src/widgets/<id>.widget.tsx`. It moves nothing itself, because a hand definition can close over app state that a file of its own would lose.

Where every other kind of app code goes is in [app-structure.md](app-structure.md).

## Search

The global palette and each hub's search read one index. Every entry has one shape: `{ id, kind, label, keywords, breadcrumb, target: { route, anchor? }, icon }`, with `breadcrumb` the labels of bucket, group, page and tab. A hub searches the same index filtered to its bucket.

| What is found | Where it comes from | When |
|---|---|---|
| Buckets, pages, tabs, cards | the screen files and their `meta` (title, icon, keywords) | build: `.brock/search.ts` |
| Settings sections and rows | `.settings.ts` sections (title, label, description, keywords) | build |
| Custom page contents | the page's `searchEntries` | build |
| Module screens and settings tabs | the module registries | runtime, when the module loads |
| Widgets, menu entries, actions | the widget registry, the derived menu, `registerSearchActions` | runtime |
| Data a page shows | `useSearchEntries(entries)` | live, while the page or provider is mounted |

- The build never loads a page to read it. `.brock/search.ts` imports only `screens.config.ts` and `buildSearchIndex`: `brock sync` and the Vite plugin read `meta`, the sections and `searchEntries` from the source text as literals, so page code stays lazy and runs nowhere at build time. A value that is not a literal (a call, a reference to an import) is skipped; settings rows the build cannot read are still indexed at runtime from the settings tab. Keywords are folded once at build time: lower case, no accents, split into words.
- `useSearchEntries(entries, route?)` adds entries while the calling component is mounted and removes them on unmount. They point at the page that was open when it mounted, or at `route`. A page's entries exist while that page is shown; a module Provider mounted for the whole session passes its `route`. Pass a stable list (`useMemo`).
- Picking a result calls `nav.open(route)`, the same deep link as `open('game/tracker/map')`, then scrolls to the element whose `data-setting-key`, `data-section` or `data-search-anchor` matches `anchor` and flashes it with `search-hit`.
- A hub search shows its matches in SideNavLayout's results slot through Tessera's SearchResults, grouped by page in page order. A settings page (a `HubPage` with `settingsTab`) shows its live rows that match, under their section titles and editable in place, filtered by the same `resolveSections` the page uses, so the count is the rows drawn. Any other page shows link hits from the index that jump to the page and row. A page heading opens the page, and pages whose name matches are offered as jumps. A hub given `search.index` keeps its own index.

## Build

```ts
defineBrockViteConfig(rootDir, overrides?)   // electron-vite: main electron/main.ts, preload electron/preload.ts, renderer src/ with index.html, the splash preload entry, the splash plugin (splash.html from the product config and the look), React plugin, dedupe react, externalizeDeps excluding @drizztdourden08/*
createBuilderConfig(product, { rootDir })    // electron-builder: appId, productName, icons, artifact names, file associations, asarUnpack for Velopack, the afterPack hook
```

`brock sync` and `brock check` run from an app root, or from a repo root with `brock.workspace.mjs`: there they find the app folders from the workspace's electron targets (then from the `pnpm-workspace.yaml` globs) and run once per app.

`brock` CLI: `sync [--check]`, `add <id | spec>`, `dev` (electron-vite dev), `build` (electron-vite build), `sync --if-stale` (syncs only when `.brock/manifest.json` is missing or older than `brock.config.ts`, `package.json`, `src/screens`, `src/widgets`, `src/boot` or `electron/boot`), `icons [--force]` (copies the Tessera brand set into `build/` and `public/logos/` and draws the bot variant; `dev` and `build` run it first), `start [-- args]` (runs `dist/electron/main.js` with Electron, after the same stale check; automation args pass through, so `brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test), `package [--full] [--channel <name>]`.

`dev`, `build` (and so `package`), `start` and the repo command's `launch` run `brock sync` first when `.brock` is missing or stale, since a fresh checkout may ignore it, and touch the manifest after. `dev` and `build` then check that every `../.brock/*` file `src/main.tsx` imports exists, and stop with a message naming the missing file instead of starting a renderer that would error and hang.

## Ports

`product.ports = { base, strict? }` in `brock.config.ts` gives the app a block of local ports. The dev renderer serves on `base + 0`. Offsets `+1` to `+9` are reserved for the app's tools (a site, an API, a static server); `portFor(base, slot, offset)` from `@drizztdourden08/brock-build` computes one.

The main checkout is slot 0. `<repo> worktree create` gives each thread worktree the lowest free slot from 1 and writes it to `.brock-port-slot` at the worktree root, kept out of git through `.git/info/exclude`. `launch` writes it too for a worktree made before slots existed. Slot N moves the whole block to `base + 10 x N`, up to slot 19. `BROCK_PORT_SLOT` in the environment wins over the file.

`defineBrockViteConfig` sets the renderer `server.port` to that port and `strictPort` to `ports.strict`, true by default, so a port in use is an error, never a silent move to the next one.

Without `ports`, the base comes from the app id: an FNV-1a hash of the id picks one of 140 bases from 20000 to 47800 in steps of 200, below the Windows dynamic range. `create-brock` writes that base into `brock.config.ts`, so it is visible and can be changed.

## Packaging and releases

Apps ship the way Relic of the Past does: Velopack installs and updates them, GitHub Releases hosts the feed.

`brock package` is its own command because it is a release step, not part of the build loop: it needs electron-builder and the `vpk` .NET tool, and it takes minutes. It runs:

1. `brock build`.
2. electron-builder with `--dir` on Windows, `--dir` and `deb` on Linux, and `--mac` on macOS (dmg and zip). The `afterPack` hook removes the Velopack bindings for other platforms, drops `dxcompiler.dll` and `dxil.dll` on Windows, and stamps the app icon on the exe with rcedit, since `signAndEditExecutable` is off.
3. On Windows, `build/installer-splash.png`, the image Velopack's Setup shows while it installs. It is drawn from the look like the boot splash: the gradient, a soft glow, the mark and the app name. Velopack draws its progress bar over the bottom edge in the accent.
4. `vpk pack` into `release/velopack`, with the pack id, title, author and icon from the product, `release-notes/v<version>.md` as the notes when it exists (app root, then repo root), and `product.updateChannel` or `--channel` as the channel. On Windows it also passes the Setup splash, the accent as the progress colour, `--shortcuts` from `product.installer.shortcuts` and `--instLicense` from `product.installer.licence`. A routine release is the update package and the delta only; `--full` adds the Velopack setup as `<prefix>windows-payload.exe` and the portable build as `<prefix>windows-directory.zip`. Linux gets `<prefix>linux.AppImage`.
5. On Windows, with `product.repo` set, the small installer: `installer-stub/` (C++ and Win32, about 600 KB) compiled with the Visual Studio C++ tools after `product.h` is written from the config, saved as `<prefix>windows-setup.exe`. It is built on every release, so `releases/latest/download/<prefix>windows-setup.exe` always resolves.
6. `install.json`, the recipe the stub reads from `releases/latest/download/install.json`: the stub generation, the version, and the URL and SHA-256 of the stub, the payload (run with `--silent`) and the directory zip. An entry this release does not carry is taken from the previous manifest, so a routine release still points at the last full one; the first release has to be `--full`.

### The installer template

rotp's installer is two programs: the small downloader window and Velopack's Setup. Brock builds both for every app from config alone, so a new app ships the full installer with no files of its own.

The downloader reads everything from `product.h`, which `brock package` writes on each run:

- Colours: `BROCK_C_BG`, `_SURFACE`, `_HAIRLINE`, `_TEXT`, `_DIM`, `_FAINT`, `_ACCENT`, `_ON_ACCENT`, `_TRACK`, `_STAMP` and `_HEADER_INK`. They come from Tessera's resolved dark theme (`theme.dark` in the Tessera package `tokens.json`; `border` draws the outlines and `textMuted` the quiet lines when Tessera has them) and the accent from `resolveLook`. The ink on the accent is Tessera's `onPrimary` when the accent is Tessera's primary, else the most readable of `onPrimary` and `text`. The header ink is the look's `ink`, the text colour that reads on the gradient. Without `tokens.json` the stub keeps its built-in warm dark colours and `brock package` says so once.
- The look: `BROCK_LOOK_FROM`, `_VIA`, `_TO` and `_ANGLE`, the same gradient the splash uses. A GDI+ `LinearGradientBrush` paints it across the top of the window, and a veil fades it into the background by the first line of text, so no label sits on the gradient.
- The mark, without its tile: Tessera's `brand/<brand>/mark/mark-256.png` (`brand/<rim>-rim/<brand>/mark/mark-256.png` with `icons.rim`) when the app keeps the default `product.logos.mark`, else `public/logos/mark.svg` (or the mark the app names) or the Tessera brand SVG from the same tree, rasterised to 256 px with resvg. It is embedded as a resource. The exe and the shortcuts keep the tiled icon.
- `product.installer`: `scope` (`user` by default, `machine` makes the main button install for everyone with elevation), `shortcuts` (`desktop` and `startMenu`, both on), `launchAfterInstall` (on; off shows a done screen with Start and Close), `licence` (a `.md` or `.txt` file; the stub shows a licence screen before any install and the text goes to vpk) and `folderName` (the product name; the folder a chosen install goes into).
- The name, the description as the welcome line, the pack id and the main exe, as before.

Layout numbers stay in the C++ sources. An app that wants more than config can put `build/installer/header.png` (replaces the rendered mark) or `build/installer/splash.png` (replaces the Setup splash). `brock structure` rejects any other file in that folder.

`brock package --render-installer` builds the stub and writes its screens to `release/installer-preview/` without installing anything: `checking`, `welcome`, `licence` (with a licence), `location`, `location-portable`, `progress`, `done`, `error` and `handoff`, at twice the size. It also writes `mark.png` and `setup-splash.png`. The stub's own `--render-png=<file> --screen=<name> [--scale=<n>]` mode does the drawing, ported from rotp. Without the Visual Studio C++ tools it still writes the two images and exits 1.

### Platforms

`targets` in `brock.config.ts` lists platform ids (`windows`, `macos`, `linux`, `android`, `web`; `ios` is reserved and choosing it says it is not supported yet) and bundles (`desktop` is Windows, macOS and Linux; `mobile` is Android today and gains iOS later with no config change). Brock expands them. Each platform is a Strategy in `packages/build/src/platforms/<id>/` built with `definePlatform`: `doctor` checks this machine (Node 24 and pnpm for every app; .NET 8, vpk and the MSVC tools for Windows; .NET 8 and vpk for Linux, plus libusb and pkg-config when the input module is there; Xcode tools for macOS; JDK 21, `ANDROID_HOME` and the SDK packages for Android) and prints the install command for what is missing, never installing it. `scaffold` sets the platform up, one step per file. `ciJob` and `releaseJob` are the platform's jobs in the two workflows, and `secrets` lists what the release job reads. `create-brock` asks for the platforms (`--platforms a,b` without a terminal), and `<app> platform add | remove | list` changes them later through the same strategies. `<app> doctor [platform]` runs the checks alone.

- Android: `capacitor.config.json` at the app root (managed: `appId` from the product as a valid Java package, `appName`, `webDir: dist/web`, `android.path: mobile/android`), `cap add android`, the launcher icons and splash from the brand set through `@capacitor/assets`, and `mobile/android/app/build.gradle` patched to sign from `BROCK_KEYSTORE_*` and to read `versionCode` and `versionName` from `package.json`. `<app> mobile build [--release]` builds the APK beside the debug `mobile push`; `<app> mobile keystore` makes the release keystore with `keytool` once you agree and prints the `gh secret set` lines for `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS`.
- Web: the managed `vite.web.config.ts` builds the renderer alone with a relative base into `dist/web` and writes a web app manifest from the product (`web: { manifest: false }` drops it). The release carries it as a zip; there is no deploy job.
- Linux: `build/linux/deb-postinst.sh` (managed) installs each module's `udevRules` (the input module's controller rules) and runs the app's own `build/linux/after-install.sh`; electron-builder runs it after `dpkg -i`.

### Workflows

Both workflows are managed files: `brock sync` composes them from the chosen platforms for a standalone app, and `brock check` fails when they drift. `ci.yml` runs on pull requests and from the Actions tab with a `quality` job (install, `brock build`, `brock check`, lint and typecheck, markdown, structure, tests) and a `review` job that runs `<app> launch main none --prod --review` under xvfb on Linux and keeps the report, then each platform's CI job (`web` builds the web app). `release.yml` runs on `workflow_dispatch` with `version`, `full`, `prerelease` and `set_latest`: `prepare` checks the notes and the tag, lints, commits the version bump and tags it; one build job per platform (`build-windows`, `build-macos`, `build-linux` run `brock package`, Windows and Linux after `vpk download` fetched the previous release for the delta; `build-android` signs the APK from the secrets; `build-web` zips `dist/web`); `release` creates the GitHub release with the notes file as the body plus a Downloads list whose Windows link is the stub on the latest release. A module's manifest `ci` steps run before the install on the runners whose `os` matches. `brock adopt` writes `release.yml` once for a repo with `apps/<app>`. `brock release [version]` dispatches it.

## Automated review

Every Brock app carries a built-in review: `--review` (or `--review=<name>`, default `review`) is a headless automation flag like `--screenshot`. Run it with `<app> launch main none --review`, or `brock start -- --review --no-focus --muted --user-data=<dir>` after a build.

Once the app window is revealed the renderer drives the real UI with DOM clicks and key presses and asks main for a PNG after each step. The tour covers the title bar (title, logo, the search and bug report actions, every bar action drawn as its bar item), the first-run profile form, the menu (Home, Profiles, Settings unless it is home, About, Quit, icons, the sections it holds, every title bar action, the View sub-menu with the pin and full screen, Escape), every registered screen in its ScreenWindow frame, each generated bucket and card (reached from the menu or the bucket switch, the hub listing every page, each page opening from its nav entry), Escape opening the home screen, the Ctrl+K palette, search (a sample from each source typed into the palette must be in the top five results and open its target, a settings row must flash; inside a hub Ctrl+K must focus the hub search, the setting must show as its live row with its control, and the group's Open button must open the page), the bug report dialog, the About logo and version, the logs widget docking in a pane with no main view grip at rest (`WidgetHost` passes `mainGrip="dragging"`), the logs widget floating in the main view and resizing from its corner (a real mouse drag sent by main with `sendInputEvent`: the live resize shows and the new size stays, and shrinking stops at 240 by 160), the performance widget opening from the Widgets menu, sampling, drawing its four tiles with sparklines, the CPU and memory gauges and memory by process with main and renderer, sparklines and tiles moving within 2.5 s, no scroll box of its own inside the widget body, then popped out and captured narrow and wide, a pop-out capable widget opening in its own window headless (the window exists, has not taken the focus and closes with nothing left behind), the widget windows end to end through `review:widgetProbe` (a moved window's bounds reach the layout and the saved profile; a window snapped onto the app's right edge stays flush when the app grows from either side or moves, and the towed bounds and the link are saved; reopening from the saved layout restores the bounds and the link; the app snaps to a widget window and links it; every widget window sits in a work area and a lost one is rescued; a drop under a window pinned above the app does not count while a drop on the app's edge docks the widget; a context-only window closes over a page and comes back where it was; a devOnly window follows the developer tools setting, changed from a widget window; a synced window has no taskbar entry and stays visible when another window takes the focus, and an unsynced one gets its own; a window snaps onto the app's corner and a resized edge snaps to the app's edge; a left edge shared by two stacked windows moves both, and with Ctrl, sent as a real key event, only one; the right edge of a widget stacked over another against the app's left edge moves the app's edge and the other widget's; a widget snapped onto the app forms a cluster, dragging it moves the app by the same amount and dragging the app back takes it along; cluster maximize scales the app and a widget into the work area, every member inside it, and restore puts them back, on the real work area and on a simulated 1024x720 one; cluster full screen opens the black backdrop and squares every member, and leaving it removes both; a Ctrl move takes the widget out of the cluster alone; the guide is drawn in the widget window being moved, beside the pointer the probe passes, and not in the app, turns snapping off with Ctrl while resizing, moves to the app when the app moves and hides after; `review:captureGroup` composes the windows and the backdrop into one capture for the grid and the full screen group), and each hero home rendering the Hero composite with its title and slots. The boot step checks that the app window holds no loading overlay. Main adds the global checks: the tour finished, the splash window closed before the first capture, the app window stayed hidden until the last boot task, the app version is not the Electron version, no renderer console errors, no failed loads, no main log errors, and a resolved window icon.

Main writes `Data/review/<name>/report.json` and `report.md` with the steps and their screenshots (`NN-<step>.png`), every check with pass or fail and a reason, and the console errors, failed loads and main log warnings seen during the run. It prints the `report.json` path and exits 0 when every check passes, 1 otherwise. When the tour makes no progress for 30 s (no capture and no check), a partial report is written and the process exits 1. The tour code is its own chunk, loaded only on a review launch.

App-specific end-to-end tests use `launchAppForTest` from `@drizztdourden08/brock-build/testing`. The review covers the shell; this helper is for what only the app knows. It checks `dist/electron/main.js` first and refuses, with the list, when the built main imports a package or a file Node cannot find. It then starts the built app with Playwright's `_electron`, `--no-focus --muted` and a fresh temporary `--user-data`, waits for the first window, and returns `{ app, page, userData, close }`; `close()` quits the app and removes the folder. Playwright is an optional peer: the app adds `playwright-core` as a dev dependency when it writes such tests.

## What Brock gives an app

- The shell: title bar, menu, profiles, settings hub, About, search palette, bug report, toasts, the widget dock with its pop-out windows, the logs widget and the performance widget.
- The updater module, with the title bar update action and the update dialog.
- The automated review, `--review`, with a report and screenshots.
- A port block per app and per thread worktree, with `strictPort` (see Ports).
- `brock check` and `brock sync` at an app root or a workspace root.
- `brock adopt` for a repo: lint configs, knip entries (`brock.workspace.mjs`, `brock-thread` ignored when linked), `.gitignore` lines for the dot-folder rule (`.*/` plus a `!` line per tracked dot-folder) and every generated output (`build/icons`, `build/splash`, `build/installer-splash.png`, the generated `public/logos` files, `.brock/profile-config.json`, `.brock-port-slot`), and the repo command. It writes no splash or logo markup and names any app page that carries a hand-written one.
- `launchAppForTest` for app-specific e2e tests.
- `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard` in brock-react, `redactSecrets` in brock-core, and `lanAddresses()` with the `network:lanAddresses` channel in brock-electron.

A zip export and import of data domains stays in each app: what goes in the archive, the manifest and the checks on import depend on the app's own records.

## Acceptance for a blank app

1. `pnpm create @drizztdourden08/brock my-app --local X:\brock --yes` writes the skeleton with `link:` dependency specs into the checkout, a `pnpm-workspace.yaml` holding the catalog of the versions the template uses, and `.npmrc`.
2. `pnpm install`, `pnpm lint` (tsc + eslint + stylelint) green.
3. `pnpm build` produces `dist/`.
4. `pnpm brock start -- --no-focus --muted --user-data=<tmp>` boots, writes `<tmp>/Data/app.json` and `profiles/`, and exits on `--screenshot=boot` or a timeout.
5. The owner launches it visibly from a handed-over command and sees the profiles screen, creates a profile, opens settings and about.

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

- `main`: a `MainModule` (brock-electron): `{ id, onBoot?(product), register(ctx), onWindow?(win, ctx), onWillQuit?(ctx), bootTasks? }`. `onBoot` runs before anything else in `bootstrapApp`, which is where the updater runs the Velopack hooks.
- `preload`: a `PreloadNamespace` (brock-electron): `{ id, build(tools) }` returning the nested `window.api.<id>` object.
- `renderer`: a `RendererModule` (brock-react): `{ id, screens?, settingsTabs?, menu?, Provider?, titleBar?, ports? }`.

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
  electron/main.ts                 OWNED ONCE bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers, ... })
  electron/boot/<id>.task.ts       OWNED      a main boot task
  electron/preload.ts              OWNED ONCE createPreloadBridge({ maps, namespaces: preloadNamespaces })
  src/product.ts                   OWNED ONCE defineProduct(config.product)
  src/index.html                   OWNED ONCE the page with an empty #root; nothing loads inside it before the reveal
  src/boot/<id>.task.ts            OWNED      a renderer boot task
  src/main.tsx                     OWNED ONCE <BrockApp product screenTree modules bootTasks settings />
  src/theme.css                    OWNED      Tessera palette seeds
  src/settings.type.ts             OWNED      AppSettings
  src/settings.constants.ts        OWNED      the settings defaults
  src/ipc/contract.type.ts         OWNED      the augmentation
  src/ipc/contract.constants.ts    OWNED      the channel maps
  src/screens/screens.config.ts    OWNED      buckets, their menu placement, home
  src/screens/**                   OWNED      one screen per file, named by kind (see Screens by convention)
  public/logos/icon.*, icon-bot.*, mark.svg  GENERATED by brock icons from the Tessera brand (icons.brand); OWNED when the app ships its own art
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

Base handlers: window, app, dialog, file, storage, profiles, config, sessions, uiViews, diagnostics, network, session log, test:screenshot. `network:lanAddresses` (`getLanAddresses` in `BASE_INVOKE_MAP`) returns `lanAddresses()`: every non-internal interface address, IPv4 first, as `{ interfaceName, address, family, cidr }`. Main code calls `lanAddresses()` from `@drizztdourden08/brock-electron/main` directly.

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

The look comes from `resolveLook(product, sources)` in brock-core: `product.look = { gradient: [from, to, via?], angle? }` first, then the Tessera brand gradient (`brands.<brand>.gradient` and `angle` in the Tessera package `tokens.json`), then a gradient derived from the palette seeds (`--p-primary` from `src/theme.css` or Tessera, into `--p-black`). The build resolves it and writes `splash.html`: static HTML with Tessera's token stylesheets, the app theme, two inlined font faces, the look as custom properties and the page stylesheet (`packages/build/src/splash/splash-page.css`, tokens only). The page talks to main through the splash preload (`window.brockSplash`). An app that ships `src/splash.html` replaces the generated page.

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
  modules={rendererModules}
/>
```

An app not yet on the convention still passes `screens`, `home` (the base layer once a profile is active), `menu`, `homeScreen` and `credits`, and `settings.tabs`. Both can be given: the `screens` and `menu` props are added beside the generated ones.

- `defineScreen({ id, title, icon?, render(ctx), layer?: 'fullscreen' | 'own', keepMounted?, devOnly?, group?, shortcut?, requiresProfile?, subtitle?(ctx), extra?(ctx), floating?(ctx) })`. A fullscreen screen sits in the reference frame: a 90% card over a scrim, one header with title, subtitle, `extra` and the close button, `floating` overhanging the top edge, a 0.2 s entrance. Built-in screens: `profiles` (list, create, delete; the setup screen when no profile exists), `settings` (the hub over `settings.tabs`), `about`, and `credits` when the app gives credits.
- `defineHub` makes a fullscreen screen too: the hub title and profile name in the header, the page tabs as `extra`, the hub switch as `floating` when two hubs or more exist.
- Home: `product.homeScreen` (default `settings`) is the target of the Home menu entry and of Escape when nothing is open.
- Menu order: Home, Profiles, Settings (unless it is home), app entries, sections, module entries, Credits, About, Quit, each built-in with an icon. `MenuItem.section` files an entry under a submenu (`widgets`, `advanced`, or a new one named after the id); `devOnly` entries and the built-in Dev Console need developer tools (development, or the `developerToolsEnabled` setting).
- `useNavigation()`: `{ active, params, open(id, params?), close() }`, backed by a zustand store so non-React code can call `nav.open`. Escape order: a registered escape layer (`useEscapeLayer`), the dialog, the open screen, then open home.
- `useProfiles()`: `{ profiles, active, select, create, remove, refresh, lastProfileId }` over the platform `FileStore` and `createProfileStore`. `setLast` is skipped on an automation launch.
- `useSettings<S>()`: `{ settings, patch, hydrated }` from `createSettingsStore<S>({ defaults, load, save })`, one per profile, debounced save to `config.json`.
- Startup is the `profiles` boot task: pinned instance profile (fail loudly if missing) -> single profile -> last profile -> the `profiles` screen. `useBootStore` holds the renderer boot phase; the review tour starts when it is `ready`.
- Logos come from `product.logos`: `app` (default `./logos/icon-256.png`) in the title bar and the about screen, `mark` (default `./logos/mark.svg`, the mark without its tile) on the splash, `instance` (default `./logos/icon-bot.svg`) for a named instance. The title bar hides in `borderless` and `fullscreen` window modes, read from the `windowMode` setting.
- Shell views are Tessera composites wired by Brock: `WindowTitleBar` (product name, menu slot, instance badge, module slots, window controls), `CommandPalette`, `AboutPanel`, `ProfilePicker` with `InlineCreateForm`, `NavLayout` with `SearchResults` for hubs and settings, `SettingsPage` with `SettingsGroupList`, and `SectionNav` as the screen rail. Brock keeps `SettingsHub<S>`, `SettingsLayout<S>`, `ConfirmDialog` and `ScreenLayer` as wiring.
- `RendererModule { id; screens?; settingsTabs?; menu?; Provider?; titleBar?: TitleBarSlot[]; searchActions?: SearchAction[]; widgets?: WidgetDef[]; bootTasks?: RendererBootTask[]; ports?: Partial<Record<HostShell, Partial<PortCreators>>> }`. A module menu entry with `section` joins that submenu; one without sits before Credits. Ports are merged into the host factory with `withPorts`.
- `titleBar` is how a module puts something in the title bar, since brock-react cannot import a module. A `TitleBarSlot` is a `ComponentType` with no props: it reads its own store and renders a small control, or `null`. `BrockApp` merges the slots of every module in load order and the title bar renders them after the menu and the pin, keyed by `displayName`. A slot that is empty most of the time sets `conditional = true`, and the review stops expecting it to draw. The updater contributes its "Update available" badge this way.

Every app gets the standard features below. `StandardOverlays` mounts the overlays in one place inside `AppShell`: `<StandardOverlays menu={fullMenu} actions={merged.searchActions} />`. The widgets are not an overlay: `AppShell` renders `WidgetHost` with the screen host as its `main` view, so docked widgets take room from the home or game view instead of covering it.

- Search palette: Ctrl+K (Cmd+K on macOS) or the `SearchButton` title bar slot opens it; Escape or the scrim closes it. Inside an open hub, Ctrl+K focuses the hub search instead. It searches the one index described under Search. A boolean field gets an inline toggle, and Ctrl+Enter flips it from the keyboard. Picking a result opens its bucket, page and tab, then scrolls to the row and flashes it. An app or module adds actions with `RendererModule.searchActions`, `registerSearchActions(actions)` (returns the unregister call) or `useSearchActions(actions)`. `palette.open()`, `palette.close()` and `usePaletteOpen()` drive it from outside.
- Bug report: `bugReport.open()` or the `BugReportButton` title bar slot opens a dialog for a title and a description. It attaches the debug text (app version, runtime, platform, recent log lines, and the host facts from `diagnostics:getSystem`) and opens a prefilled GitHub issue on `product.repo` in the browser. No token is involved. Without a repo the report goes to the clipboard.
- About: Version, Runtime, Engine and Platform rows, and Copy debug info with the same debug text (`useDebugText`).
- Toasts: `toast(message, { variant?, duration? })` works from anywhere and returns an id for `dismissToast(id)`. `ToastHost` renders the Tessera `ToastContainer`.
- Widgets: `defineWidget({ id, label, render, ... })` describes a tool panel for the Tessera `WidgetManager` v2, which draws a `DockLayout` split tree around the main view: panes docked on an edge or tabbed together, widgets floating over the main view, and widgets in their own OS window. Widgets come from `RendererModule.widgets`, the `widgets` prop of `WidgetHost` or `registerWidgets(defs)`. The layout is `{ v: 2, dock, floating, popped, frame, poppedMemory? }`; a stored layout goes through `migrateLayout` on load, so the flat layouts of earlier builds keep working. The layout and each widget's `useWidgetPref` values are kept per profile in `ui-views.json` through the `uiViews` IPC, under `profile:<id>`. `useWidgetMenuEntries()` returns checkable items for a Widgets menu, and `widgets.open(id)`, `widgets.close(id)`, `widgets.toggle(id)` and `widgets.popOut(id)` work outside React. The built-in `logs` widget is a filterable, searchable view of the log bus.
- Widget windows: a definition with `popOut: true` may leave the app for a frameless window of its own (the pop out button, the options panel, or a drag past the window edge). brock-electron owns those windows (`packages/electron/src/main/widgets`): the pin (off, always on top, or with the app, which follows the app's own pin, focus, minimize and restore), snapping against the app and the other widget windows on `will-move`, from the cursor and the grab offset so a scaled display never grows the window, towing the windows linked to a moved one, clamping a remembered position to the display it lands on, and dragging a window back in: while the cursor is on the dragged window and over the app content, the app draws the dock drop hints, and a release there docks it. The window loads the same renderer with `?widget=<id>`, where `BrockApp` draws only that widget in `Widget mode="out"`; the main window relays the log entries, the widget frames and the widget prefs to it (`widget:publish`, `widget:relay`). On an automation launch (`--no-focus`) a widget window opens off screen, cannot take the focus and stays behind; `--muted` mutes it. The IPC contract lives in brock-core, `ipc/widget-contract.type.ts`.
- The menu files the `useWidgetMenuEntries()` items under Widgets and adds Report a bug to Advanced. The palette and the bug report dialog are escape layers, so Escape closes them before anything else.
- `STANDARD_TITLE_BAR_SLOTS` (`SearchButton`, `BugReportButton`) come before the module slots.

Small helpers every app gets from brock-react, one per file:

- `confirmAction({ title, message, confirmLabel?, cancelLabel?, variant? })` shows the shell's confirm dialog and resolves `true` on confirm, `false` on cancel or Escape. A second call cancels the first.
- `useNow(intervalMs, active = true)` returns `Date.now()` and ticks while `active`.
- `useCopyText(resetMs = 2000)` returns `{ copied, error, copy(text) }`; `copied` goes back to false after `resetMs`.
- `useKeyedGuard()` runs async work under a key: `guard(key, work)` marks the key busy, clears its old error and records a new one when the work throws. `isBusy(key?)`, `errorOf(key)` and `clearError(key?)` read and reset it. The state lives in the pure `keyedGuardReducer`.
- `redactSecrets(line)` (brock-core) masks bearer and basic credentials, `key=value` pairs whose key names a token, secret, password or key, credentials inside a URL, and known token shapes (GitHub, GitLab, npm, Slack, OpenAI style, Google, AWS, JWT). The debug text and the bug report run every log line through it.

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
    controls.custom.tsx       a custom page: standard frame, free content
  credits.card.tsx            a card screen, outside the buckets
  playfield.layer.tsx         a full-bleed screen that draws its own layer
```

| Suffix | What Brock draws | The file default-exports |
|---|---|---|
| `.hero.tsx` | the bucket hub home | a component taking `HeroProps` |
| `.page.tsx` | a hub page in the section nav | a component taking `PageProps` |
| `<page>/<tab>.tab.tsx` | one header tab of that page | a component taking `PageProps` |
| `.settings.ts` | a settings page with search and reset | `Section[]`, or `(settings) => Section[]` |
| `.custom.tsx` | a hub page whose content is built by hand | a component taking `PageProps`, and `searchEntries` |
| `.card.tsx` | a card screen with header and close | a component taking `CardProps` |
| `.layer.tsx` | nothing: the screen draws its own layer | a component taking `CardProps` |

A file may also export `meta: ScreenMeta` (`title`, `icon`, `order`, `shortcut`, `devOnly`, `requiresProfile`, `keywords`). Without a title the label comes from the file name. Pages sort by `order`, then by label.

```ts
interface BucketDef { id; title; icon: IconName; menu: 'entry' | 'submenu' | 'hidden'; groups?: { id; label }[]; shortcut? }
interface ScreensConfig { buckets: BucketDef[]; home: string; settings?: { bucket: string } }
interface CardProps { params; profile; open(target, params?); close() }
interface PageProps extends CardProps { bucket: BucketDef; page: string; tab: string | null }
interface HeroProps extends PageProps { slots: { Title; Eyebrow; Backdrop; Art; Actions; Tools; Facts; Aside; Panel } }
```

- `brock sync` scans `src/screens` and writes `.brock/screens.ts` and `.brock/search.ts`. The first imports each file's default export and its `meta`, and calls `buildScreenTree(config, entries, searchIndex)`. The renderer Vite plugin writes both again when the build starts and whenever a file under `src/screens` is added, renamed, changed or deleted, so `brock dev` reloads with the new registry. `brock check` fails when either file drifts.
- `buildScreenTree` makes one hub per bucket, in config order. The hero is the hub home; a bucket without one opens on its first page. Pages in the bucket folder form the bucket's own group, named after the bucket; group folders follow in the order of `groups`, then any other group by name. Custom pages sit in the nav like any page. Card and layer files become screens; settings files become settings tabs. A generated hub has its search on.
- The bucket switch lists the buckets in config order and shows once there are two. The menu comes from the config: `entry` adds the bucket, `submenu` adds the bucket with one child per page, `hidden` adds nothing. The home bucket is the Home entry, and card screens get an entry of their own, except the ones Brock already lists (credits, about, profiles, settings). The derived entries go first among the app entries.
- Escape and Home open `config.home`. When the app has no base screen, the home bucket opens once at startup when a profile is already active.
- Settings live in a bucket: `settings.bucket`, or the home bucket. The app's `.settings.ts` pages stay where their files are, and the built-in tabs (`settings.tabs` and module tabs) join that bucket as one group per tab group. There is no separate Settings screen then: the Settings menu entry, the palette and Mod+Comma open the first settings page of that bucket, or the page a tab names.
- `open('<bucket>/<page>/<tab>')` opens a hub page directly, and a menu item can name `{ bucket, page, tab }` instead of `screen`.
- The hero frame has one wiring point, `packages/react/src/screens/kinds/hero-frame.constants.ts`: `HERO_FRAME` names the Tessera `Hero` composite and builds one slot component per Hero slot. A hero page renders the slot components it needs (`<Title>`, `<Eyebrow>`, `<Backdrop>`, `<Art src alt pixelated />`, `<Actions>`, `<Tools>`, `<Facts rows />`, `<Aside>`, `<Panel>`); each hands its value to the frame, which draws one `Hero` with them.
- `brock structure` rejects a file with an unknown suffix, a bucket folder the config does not declare, a declared bucket with no folder, two heroes in a bucket, two pages with the same id in a bucket, a tab outside a page folder, a card or layer inside a bucket, a custom page at the root, a custom page without a `searchEntries` export or with one the build cannot read, and folders deeper than `<bucket>/<group>/<page>`. It also prints the number of custom pages per bucket, so the exceptions stay visible. `screens.config.ts` may import only `defineScreens` and types, since the check loads it under Node.

### Custom pages and layers

A custom page is `<page>.custom.tsx` inside a bucket. It keeps everything standard around it: the hub frame, the nav entry, the header with title and tabs, Escape and search. Only the content is free. It must export `searchEntries: SearchEntrySeed[]`, a literal list of `{ label, keywords?, anchor?, description? }`, so it never hides from search; an empty list is allowed. An element on the page carries `data-search-anchor="<anchor>"` for the jump.

A full-bleed layer at the root (a game view, a debug canvas) is `<id>.layer.tsx`. It used to be `<id>.custom.tsx`: the `custom-layer-rename` migration renames it, and `custom` now always means a page with the standard frame.

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
- A hub search shows its matches in NavLayout's results slot through Tessera's SearchResults, grouped by page; a hit jumps to its page and row, a page heading opens the page. A hub given `search.index` keeps its own index.

## Build

```ts
defineBrockViteConfig(rootDir, overrides?)   // electron-vite: main electron/main.ts, preload electron/preload.ts, renderer src/ with index.html, the splash preload entry, the splash plugin (splash.html from the product config and the look), React plugin, dedupe react, externalizeDeps excluding @drizztdourden08/*
createBuilderConfig(product, { rootDir })    // electron-builder: appId, productName, icons, artifact names, file associations, asarUnpack for Velopack, the afterPack hook
```

`brock sync` and `brock check` run from an app root, or from a repo root with `brock.workspace.mjs`: there they find the app folders from the workspace's electron targets (then from the `pnpm-workspace.yaml` globs) and run once per app.

`brock` CLI: `sync [--check]`, `add <id | spec>`, `dev` (electron-vite dev), `build` (electron-vite build), `icons [--force]` (copies the Tessera brand set into `build/` and `public/logos/` and draws the bot variant; `dev` and `build` run it first), `start [-- args]` (runs `dist/electron/main.js` with Electron; automation args pass through, so `brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test), `package [--full] [--channel <name>]`.

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
- The mark, without its tile: Tessera's `brand/<brand>/mark/mark-256.png` when the app keeps the default `product.logos.mark`, else `public/logos/mark.svg` (or the mark the app names) or the Tessera brand SVG, rasterised to 256 px with resvg. It is embedded as a resource. The exe and the shortcuts keep the tiled icon.
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

Once the app window is revealed the renderer drives the real UI with DOM clicks and key presses and asks main for a PNG after each step. The tour covers the title bar (title, logo, search and bug report buttons, module slots), the first-run profile form, the menu (Home, Profiles, Settings unless it is home, About, Quit, icons, the Advanced section, Escape), every registered screen in its FullScreenLayer frame, each generated bucket and card (reached from the menu or the bucket switch, the hub listing every page, each page opening from its nav entry), Escape opening the home screen, the Ctrl+K palette, search (a sample from each source typed into the palette must be in the top five results and open its target, a settings row must flash, and the same inside a hub, where Ctrl+K must focus the hub search), the bug report dialog, the About logo and version, the logs widget docking in a pane, a pop-out capable widget opening in its own window headless (the window exists, has not taken the focus and closes with nothing left behind), and each hero home rendering the Hero composite with its title and slots. The boot step checks that the app window holds no loading overlay. Main adds the global checks: the tour finished, the splash window closed before the first capture, the app window stayed hidden until the last boot task, the app version is not the Electron version, no renderer console errors, no failed loads, no main log errors, and a resolved window icon.

Main writes `Data/review/<name>/report.json` and `report.md` with the steps and their screenshots (`NN-<step>.png`), every check with pass or fail and a reason, and the console errors, failed loads and main log warnings seen during the run. It prints the `report.json` path and exits 0 when every check passes, 1 otherwise. When the tour makes no progress for 30 s (no capture and no check), a partial report is written and the process exits 1. The tour code is its own chunk, loaded only on a review launch.

App-specific end-to-end tests use `launchAppForTest` from `@drizztdourden08/brock-build/testing`. The review covers the shell; this helper is for what only the app knows. It checks `dist/electron/main.js` first and refuses, with the list, when the built main imports a package or a file Node cannot find. It then starts the built app with Playwright's `_electron`, `--no-focus --muted` and a fresh temporary `--user-data`, waits for the first window, and returns `{ app, page, userData, close }`; `close()` quits the app and removes the folder. Playwright is an optional peer: the app adds `playwright-core` as a dev dependency when it writes such tests.

## What Brock gives an app

- The shell: title bar, menu, profiles, settings hub, About, search palette, bug report, toasts, the widget dock with its pop-out windows, and the logs widget.
- The updater module, with the title bar badge and the update dialog.
- The automated review, `--review`, with a report and screenshots.
- A port block per app and per thread worktree, with `strictPort` (see Ports).
- `brock check` and `brock sync` at an app root or a workspace root.
- `brock adopt` for a repo: lint configs, knip entries (`brock.workspace.mjs`, `.worktrees/**` ignored, `brock-thread` ignored when linked), `.gitignore` lines for every generated output (`build/icons`, `build/splash`, `build/installer-splash.png`, the generated `public/logos` files, `.brock/profile-config.json`, `.brock-port-slot`), and the repo command. It writes no splash or logo markup and names any app page that carries a hand-written one.
- `launchAppForTest` for app-specific e2e tests.
- `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard` in brock-react, `redactSecrets` in brock-core, and `lanAddresses()` with the `network:lanAddresses` channel in brock-electron.

A zip export and import of data domains stays in each app: what goes in the archive, the manifest and the checks on import depend on the app's own records.

## Acceptance for a blank app

1. `pnpm create @drizztdourden08/brock my-app --local X:\brock --yes` writes the skeleton with `link:` dependency specs into the checkout, a `pnpm-workspace.yaml` holding the catalog of the versions the template uses, and `.npmrc`.
2. `pnpm install`, `pnpm lint` (tsc + eslint + stylelint) green.
3. `pnpm build` produces `dist/`.
4. `pnpm brock start -- --no-focus --muted --user-data=<tmp>` boots, writes `<tmp>/Data/app.json` and `profiles/`, and exits on `--screenshot=boot` or a timeout.
5. The owner launches it visibly from a handed-over command and sees the profiles screen, creates a profile, opens settings and about.

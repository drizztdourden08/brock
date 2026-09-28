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
| `@drizztdourden08/brock-build` | tooling | Vite and electron-builder config factories, ensure-electron, the `brock` CLI (sync, check, add, dev, build, start) |
| `@drizztdourden08/create-brock` | tooling | the scaffolder: `pnpm create @drizztdourden08/brock` |
| `@drizztdourden08/brock-updater` | module | Velopack updater, UpdateDialog |
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
- `renderer`: a `RendererModule` (brock-react): `{ id, screens?, settingsTabs?, menu?, Provider?, ports? }`.

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
  electron/main.ts                 OWNED ONCE bootstrapApp(product, { modules: mainModules, handlers, ... })
  electron/preload.ts              OWNED ONCE createPreloadBridge({ maps, namespaces: preloadNamespaces })
  src/product.ts                   OWNED ONCE defineProduct(config.product)
  src/index.html, splash.html      OWNED ONCE
  src/main.tsx                     OWNED ONCE <BrockApp product screens modules settings />
  src/theme.css                    OWNED      Tessera palette seeds
  src/settings.type.ts             OWNED      AppSettings
  src/settings.constants.ts        OWNED      defaults, sections, tabs
  src/menu.constants.ts            OWNED      the app menu
  src/ipc/contract.type.ts         OWNED      the augmentation
  src/ipc/contract.constants.ts    OWNED      the channel maps
  src/screens/<Name>.tsx           OWNED      one component per file
  public/logos/icon.svg, icon-256.png  GENERATED by brock icons from the Tessera brand (icons.brand); OWNED when the app ships its own art
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

Boot order: Velopack hooks (updater module) -> portable mode -> `--user-data` -> `app.setName(product.id)` -> crash forensics -> instance identity (`product.appId`) -> privileged schemes (`product.schemes` + modules) -> whenReady: paths, data dirs (`product.dataDirs` + modules), session log rotation, base handlers, module `register`, app handlers, createWindow (title, icon, size from `product.window`), module `onWindow`, app `onWindow` -> quit hooks.

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
  settings={{ defaults: DEFAULT_SETTINGS, tabs: SETTINGS_TABS }}
  screens={[homeScreen, ...]}
  modules={rendererModules}
  home="home"                     // the base layer once a profile is active
  menu={MENU}                     // TitleBar menu entries; module menus are appended
/>
```

- `defineScreen({ id, title, icon?, render(ctx), layer?: 'fullscreen' | 'own', keepMounted?, devOnly?, group?, shortcut?, requiresProfile? })`. Built-in screens: `profiles` (list, create, delete; the setup screen when no profile exists), `settings` (the hub over `settings.tabs`), `about`.
- `useNavigation()`: `{ active, params, open(id, params?), close() }`, backed by a zustand store so non-React code can call `nav.open`. Escape order: dialog, close screen.
- `useProfiles()`: `{ profiles, active, select, create, remove, refresh, lastProfileId }` over the platform `FileStore` and `createProfileStore`. `setLast` is skipped on an automation launch.
- `useSettings<S>()`: `{ settings, patch, hydrated }` from `createSettingsStore<S>({ defaults, load, save })`, one per profile, debounced save to `config.json`.
- Startup: pinned instance profile (fail loudly if missing) -> single profile -> last profile -> the `profiles` screen. `useShellReady` signals main once startup settled and two frames painted.
- Shell views (each with a Storylite story): `TitleBar` (product name, menu slot, instance badge, window controls), `BootProgressBar`, `About`, `SettingsHub<S>` + `SettingsLayout<S>` + `SettingsPage`, `ConfirmDialog`, `ScreenLayer`.
- `RendererModule { id; screens?; settingsTabs?; menu?; Provider?; ports?: Partial<Record<HostShell, Partial<PortCreators>>> }`. Ports are merged into the host factory with `withPorts`.

Tessera is imported as `@drizztdourden08/tessera/*`; `tokens.css` first, then the app's `theme.css`.

## Build

```ts
defineBrockViteConfig(rootDir, overrides?)   // electron-vite: main electron/main.ts, preload electron/preload.ts, renderer src/ with index.html + splash.html, React plugin, dedupe react, externalizeDeps excluding @drizztdourden08/*
createBuilderConfig(product, { rootDir })    // electron-builder: appId, productName, icons, artifact names, file associations
```

`brock` CLI: `sync [--check]`, `add <id | spec>`, `dev` (electron-vite dev), `build` (electron-vite build), `icons [--force]` (copies the Tessera brand set into `build/` and `public/logos/`; `dev` and `build` run it first), `start [-- args]` (runs `dist/electron/main.js` with Electron; automation args pass through, so `brock start -- --no-focus --muted --user-data=<dir>` is the headless smoke test).

## Acceptance for a blank app

1. `pnpm create @drizztdourden08/brock my-app --local X:\brock --yes` writes the skeleton with `link:` dependency specs into the checkout, a `pnpm-workspace.yaml` holding the catalog of the versions the template uses, and `.npmrc`.
2. `pnpm install`, `pnpm lint` (tsc + eslint + stylelint) green.
3. `pnpm build` produces `dist/`.
4. `pnpm brock start -- --no-focus --muted --user-data=<tmp>` boots, writes `<tmp>/Data/app.json` and `profiles/`, and exits on `--screenshot=boot` or a timeout.
5. The owner launches it visibly from a handed-over command and sees the profiles screen, creates a profile, opens settings and about.

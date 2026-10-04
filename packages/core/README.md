<!-- @layer docs @kind doc -->
# brock-core

Isomorphic foundation: no Electron, no React. Everything here runs in main, preload, the renderer and a mobile host.

| Entry | Holds |
|---|---|
| `/augment` | The open interfaces every module and app extends: `InvokeContract`, `SendContract`, `EventContract`, `IpcNamespaces`, `Capabilities`, `PlatformPorts`, `ProfileExtension` and the profile option and patch extensions. Declared here and nowhere else, because an augmentation merges only with the module it names. |
| `/product` | `defineProduct()` and `ProductConfig`: the one place an app's identity lives. |
| `/ipc` | Base channel maps and the `IpcApi` type derived from them. |
| `/platform` | Ports (files, window, storage, file picker, device), `PlatformFactory`, `resolvePlatform`, host detection. |
| `/storage` | JSON over a `FileStore`, ids, hashing, path guards, `createProfileStore`, app state. |
| `/settings` | `BaseSettings`, `mergeSettings`, `createFeatureResolver`, `createSettingLock`. |
| `/log` | `createLogBus` with app-defined channels. |
| `/module` | The `package.json#brock` manifest type. |
| `/automation` | `createAutomationFlags`: the launch guard main and preload share. |
| `/registry` | `createRegistry`, the keyed registry behind screens, tabs and handlers. |
| `/boot` | `defineBootTask`, `runBootTasks` and the boot task types shared by main and the renderer. |
| `/look` | `resolveLook(product, sources)`: the splash and installer gradient from `product.look`, the Tessera brand gradient or the palette seeds. |

## Adding a channel

```ts
declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract { 'notes:list': () => Promise<Note[]> }
}
const NOTES_INVOKE_MAP = { listNotes: 'notes:list' } as const satisfies Record<string, keyof InvokeContract>;
```

The app composes `{ ...BASE_INVOKE_MAP, ...NOTES_INVOKE_MAP }` and hands the result to the preload builder in brock-electron.

## Contracts

- `InvokeContract` is renderer to main with a response (`ipcRenderer.invoke` / `ipcMain.handle`). `SendContract` is renderer to main, fire and forget. `EventContract` is main to renderer; each value is the listener signature.
- The open interfaces live in `/augment` and nowhere else because TypeScript merges an augmentation only with declarations in the module it names, never through a re-export.
- `composeMaps` merges left to right; a later method name wins, so an app can rename a base method. The preload builds the flat `window.api` methods from these maps, so no channel literal is written per method.
- Base channels: `test:screenshot` writes a PNG of the window to `Data/screenshots` and returns its path; `boot:progress`, `boot:failed` and `boot:ready` carry the renderer boot to main; `debug:appendSessionLog` carries batched renderer log lines for `Data/debug/session.log`.
- Widget window channels live in their own contract, `ipc/widget-contract.type.ts`, which `InvokeContract`, `SendContract` and `EventContract` extend, with their maps in `ipc/widget-maps.constants.ts` spread into the base maps: `widget:popOut`, `widget:listPopped`, `widget:setPin` and `widget:getWindowState` to invoke; `widget:dockBack`, `widget:setSnap`, `widget:setFrame`, `widget:setPrefs`, `widget:publish` and `widget:subscribe` to send; `widget:closed`, `widget:bounds`, `widget:dragOver`, `widget:dropIn`, `widget:popped`, `widget:frame`, `widget:prefs`, `widget:windowState`, `widget:relay` and `widget:snapshotRequest` as events. On a `--review` launch `review:setWidgetPref` sets a pref inside a widget window through `review:widgetPref`, so the tour can prove the pref relay. The wire types (`PoppedWidgetWire`, `WidgetPinMode`, `WidgetWindowBounds`, `WidgetSlice` and the rest) are exported for main and renderer alike.
- `StartupInfo` is read by the preload from the forwarded `--startup-*` flags: `fresh` means ignore the saved layout and persist nothing, `automation` means read-only for the shared configuration, `flags` holds every forwarded flag for app-defined ones.

## Automation flags

- An automated launch is read-only for the configuration every launch shares (window state, default profile). Main and preload read the same flag list so both processes agree.
- `IDENTITY_FLAGS` (`--instance`, `--profile`) tag a window a person can still use. `isHeadlessLaunch` is true for any other automation flag unless `--visible` is given.
- A flag matches bare or as `--flag=value`; `flagValue` returns the value part or null.

## Platform

- Host detection order: Capacitor (its global is probed without importing `@capacitor/core`), then Electron (a preload `window.api` exists), then web. Host shell and OS are two axes; app code branches on a capability, never on a host or OS name.
- `PlatformFactory` is an abstract factory: each host builds one consistent family of ports. `resolvePlatform` is the single selection point and falls back to the web factory. `withPorts` adds module ports to a host factory without the host knowing the module.
- `FileStore` paths are POSIX and relative to the Data root. `list` returns immediate child names or `[]` when missing, `remove` is recursive and a no-op when missing, `mkdir` is recursive.
- `FilePickerPort`: a cancelled save is `saved: false` with no error; `error` is set only for a real failure. Extensions carry no leading dot.
- `DevicePort` covers what has no desktop equivalent (keep awake, haptics, app pause, Android back); Electron is a no-op. `BackEdge` is the side a back swipe came from, `right` for a button press.
- `DataLocation.canReveal` mirrors the `revealDataFolder` capability; `DomainUsage.count` is immediate entries and `bytes` is recursive disk usage; `FileStat.mtimeMs` is 0 when unavailable.

## Product

- `id` is the slug for the userData folder, `app.setName` and the Velopack pack id. `appId` is reverse-DNS and becomes the Windows AppUserModelId and the electron-builder appId. `artifactPrefix` defaults to `<id>-`. `envPrefix` gives variables like `MYAPP_UPDATE_API_ORIGIN`. `repo` is the GitHub repository the updater reads. `dataDirs` are created under `Data/` at boot. Nothing outside `ProductConfig` carries an identity string.
- `look` is `{ gradient: [from, to, via?], angle? }` with hex stops; `logos.mark` (default `./logos/mark.svg`) is the mark without its tile that the splash shows. `defineProduct` rejects a stop that is not a hex colour.
- `ports` is `{ base, strict? }`, the app's block of local ports (see brock-thread `/ports`). `defineProduct` throws when `base` is not a whole number from 1024 to 65335.
- `window.backgroundColor` is a raw hex value on purpose: the window paints it before any stylesheet loads. `defineProduct` throws on a malformed id, appId or empty name.
- `FileAssociation.ext` has no dot, `progId` is the registry ProgId (for example `MyApp.Document`); `PrivilegedScheme.stream` serves media with byte ranges; `ProductIcons.ico` is the Windows window and installer icon, `png256`/`png512` serve Linux, macOS and the splash. `ProductIcons.brand` names a Tessera brand (`archipelia`, `rotp`, `brock`, `tessera`) instead: `brock icons` copies its files under `build/icons/` and `defineProduct` fills the three path fields with those copies (`build/icons/icon.ico`, `build/icons/png/icon-256.png`, `build/icons/png/icon-512.png`); a path field given alongside `brand` still wins. `ProductIcons.rim` (`'light'` or `'dark'`) picks Tessera's rimmed set of that brand, `brand/<rim>-rim/<brand>/`, for a mark that must read on a dark or a light surface; `defineProduct` sets `'light'` for `brock` and no rim for other brands. With a brand, `logos.app` defaults to `./logos/icon-32.png`, the 32 px icon the title bar draws at 20 px.

## Settings and features

- `masterVolume` is 0..1. `mergeSettings` fills missing keys from the defaults and passes unknown keys through untouched.
- `requires` are hard dependencies (disabled unless all are on); `suggests` are soft companions, never forced; `live: false` means a restart is needed. `resolve` prunes to a fixpoint and leaves unknown ids untouched; `resolveGates` strips every locked id first, so dependents of a locked id are disabled too. `autoDisabled` lists what was pruned so the UI can explain.
- A setting lock matches exact keys plus prefixes for nested groups that arrive as dotted keys (`haptics.intensity`); an app builds one lock per lock cause.

## Storage

- On disk: `app.json` (`lastProfileId`, the profile that opens by default), `profiles/<id>/profile.json` (the flat `Profile` record, so app fields sit beside the base ones) and `profiles/<id>/config.json` (the profile's settings, an untyped JSON object).
- Profile hooks: `build` adds fields at creation, `patchable` lists the extension keys a patch may set or clear (everything else is frozen), `onCreate` runs after the record and its config are written. In a patch an absent key leaves a field alone, `null` clears it and a value sets it; `undefined` cannot be used because it is indistinguishable from absent once the patch has crossed IPC. `BaseProfile.automation` marks a profile created by an automated launch, so it is safe to prune.
- `readJson` strips a UTF-8 byte-order mark (editors and PowerShell add one and `JSON.parse` rejects it) and returns the fallback on any failure; `writeJson` ends the file with a newline for files people edit by hand.
- A safe name matches `^[A-Za-z0-9][A-Za-z0-9 _.-]{0,127}$` and never contains `..`; `sanitizeId` replaces anything outside `[A-Za-z0-9_-]` with `_`. `newId` is 8 hex chars (randomUUID, then getRandomValues, then a Date.now fallback). SHA-256 goes through Web Crypto so it runs in the renderer, a Worker and Node.

## Log bus, registry, module manifest, diagnostics

- Channels are the app's own vocabulary; `app` and `error` always exist. Every entry is mirrored to the console by default so a main-process file logger captures the channels. The ring holds 1000 entries by default; `reset` drops entries but keeps listeners; a throwing listener never breaks the bus.
- `redactSecrets(line)` masks bearer and basic credentials, `key=value` and JSON pairs whose key names a token, secret, password, key, cookie or authorization, `user:pass@` in a URL, and known token shapes. It replaces with `REDACTED` (`***`) and leaves other text as it was.
- `LanAddress` is `{ interfaceName, address, family, cidr }`, the answer of `network:lanAddresses`.
- `createRegistry` preserves registration order, throws on a duplicate id and notifies subscribers after every `register`.
- Manifest: `id` is the short id used in `brock.config.ts`; `automationFlags` are counted by the launch guard; `dataDirs` are folders under `Data/` needed at boot; `peers` are packages a consuming app must also install; `ModuleCiStep.os` limits a step to one runner OS; `ModuleMigration.version` is the module version that introduced the change and `entry` the subpath exporting the codemod.
- `ProcessDiagnostics` is the answer of `diagnostics:getProcesses`: `processes` (`ProcessMetric`: `pid`, `type`, `name`, `cpuPercent`, `workingSetBytes`, `privateBytes`), `main` (`MainProcessMemory`), `uptimeSeconds`, `windowCount`, `widgetWindows` (`WidgetWindowSummary`: `id`, `visible`, `sync`, `cluster`, the number of windows in its snap cluster), `ipcCalls` (a running total), `versions` and `gpuFeatures`.
- `SystemDiagnostics` is free of anything identifying (host name, user name, file path) because it is meant for a public bug report. Display bounds are logical (DIP); `nativeSize` is the logical size times the scale factor; `gpu.features` maps each feature to a status such as `enabled` or `disabled_software`.
- `formatBytes`: `nullText` is returned for null or undefined; `kbDecimals` applies to the KB tier only (MB and GB use 1).

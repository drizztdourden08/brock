<!-- @layer docs @kind doc -->
# brock-electron

The Electron layer of a Brock app: `/main` boots the main process and registers the base IPC handlers, `/preload` builds `window.api`. Both are typed against the augmented contracts in `@drizztdourden08/brock-core/augment`, so a channel a module or an app adds is typed with no extra wiring.

## Use

```ts
// electron/main.ts
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { product } from '../src/product';
import { mainModules } from '../.brock/modules.main';
import { mainBootTasks } from '../.brock/boot.main';
import { handlers } from './handlers';

bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers });
```

```ts
// electron/preload.ts
import { createPreloadBridge } from '@drizztdourden08/brock-electron/preload';
import { INVOKE_MAP, SEND_MAP, EVENT_MAP } from '../src/ipc/contract';
import { preloadNamespaces } from '../.brock/modules.preload';

createPreloadBridge({ maps: { invoke: INVOKE_MAP, send: SEND_MAP, events: EVENT_MAP }, namespaces: preloadNamespaces });
```

## Boot order

`bootstrapApp` runs, in this order:

0. Module `onBoot(product)`, before anything else. The updater module runs the Velopack hooks here, and they may exit or restart the process.
1. Portable mode (a `data` folder beside `Update.exe`), then `--user-data=<dir>`, which outranks it.
2. `app.setName(product.id)`, so dev and production share one userData folder.
3. Crash forensics: local crash reporter, process and quit hooks, memory heartbeat, all into `Data/debug/main-console.log`.
4. App identity: the AppUserModelId (`product.appId`, or `<appId>.instance.<slug>` for `--instance=<slug>`) on Windows, the instance dock icon on macOS.
5. Privileged schemes: `product.schemes` plus every module's `schemes`.
6. On ready: `initPaths`, data folders (`product.dataDirs` plus module `dataDirs`), session-log rotation, the splash window, then the main boot tasks: `modules` (base handlers, module `register`, app `handlers`, `onReady`), `window-state` (the hidden app window, module `onWindow`, app `onWindow`), then module and app main tasks.
7. Quit hooks: module `onWillQuit`, app `onWillQuit`, quit on last window closed except on macOS.

Base handlers: boot, window, aspectRatio, app, dialog, file, storage, profiles (with `config:*`), sessions, uiViews, diagnostics (`diagnostics:getSystem` for the bug report, `diagnostics:getProcesses` for the performance widget: `app.getAppMetrics()` with the window each renderer process draws, the main process memory, uptime, the windows and widget windows, the IPC call count, the GPU feature status and the system memory), network, sessionLog, screenshot. The typed `handle` and `on` count every call they serve; `diagnostics:getProcesses` reports the total. A `HandlerGroup` with `devOnly: true` is never registered when `app.isPackaged`.

## Window rules

The app window is created with `show: false` at its saved geometry and is shown only at the reveal. An automation launch (`flags.isHeadlessLaunch()`) places the splash and the app window off every monitor, `focusable: false`, shown inactive and kept in the background. `--muted` and `--sound` reach the renderer as `--startup-muted` and `--startup-sound`; nothing touches the webContents audio.

`--screenshot=<name>` captures the window to `Data/screenshots/<name>.png` once it is revealed (or after 20 s) and quits. `--screenshot-splash=<name>` captures the splash at the first renderer progress, holds the reveal until the file is written, writes `<name>-failed.png` if the boot stops, and quits unless `--review` or `--screenshot` also runs. `--review` captures the splash the same way by itself, as `00-splash.png` in the report folder (`00-splash-failed.png` when the boot stops first).

## Automated review

`--review[=<name>]` runs the renderer's review tour once the renderer boot finished; `review:capture` waits for the reveal: `brock start -- --review --no-focus --muted --user-data=<dir>` after a build, or `<app> launch main none --review`. Main registers `review:capture` (a PNG per step), `review:check` and `review:finish`, records renderer console errors, failed loads (`did-fail-load`, `webRequest` status 400 and up, request errors) and main log warnings and errors, and adds the global checks, among them `splash-closed` and `hidden-until-boot` from the boot timeline. A boot failure ends the review at once. The report lands in `Data/review/<name>/report.json` and `report.md` beside the screenshots; the process prints the JSON path and exits 0 when every check passes, 1 otherwise. The watchdog starts at launch: when no capture or check arrives within 60 s, or the tour later makes no progress for 30 s, a partial report is written and the process exits 1, forced 5 s after the report if the quit stalls.

## Options

| Option | Purpose |
|---|---|
| `modules` | `MainModule[]`: `{ id, onBoot?, register(ctx), onWindow?, onWillQuit?, automationFlags?, dataDirs?, schemes?, bootTasks? }` |
| `handlers` | `HandlerGroup[]` appended to the base set: `{ id, register(ctx), devOnly? }` |
| `bootTasks` | `MainBootTask[]` from `.brock/boot.main.ts`; each runs after `modules` |
| `automationFlags` | App flags the launch guard counts, added to the base and module flags |
| `dataDomains` | Rows of `storage:getSummary` |
| `profileHooks` | Passed to the core `createProfileStore` |
| `rendererFlags` | `(argv) => string[]`: extra `--startup-*` arguments; any `--startup-*` already in argv is forwarded as is |
| `onReady`, `onWindow`, `onWillQuit` | App hooks around the window |
| `paths` | `{ preload, renderer, splash, splashPreload }`; relative entries resolve against `<appPath>/dist/electron`, defaults `../preload/preload.mjs`, `../renderer/index.html`, `../renderer/splash.html`, `../preload/splash-preload.mjs` |
| `security` | `externalProtocols` (default `http:`, `https:`, `mailto:`) and `permissions` (see `DEFAULT_PERMISSIONS`) |

## MainContext

Every handler and module receives `{ product, isDev, flags, instance, paths: { userData, data }, files, profiles, window(), handle, on, emit, log }`. `files` is a Node FileStore rooted at `Data/`; `profiles` is the core profile store over it; `emit` sends to the main window and is a no-op while there is none.

## Boot details

- Portable mode: a `data` folder at the install root holds every app file and is found relative to the executable, so a copy can move to another drive or USB key. The install root is the folder holding `Update.exe`, not the folder holding the executable: `app.getPath('exe')` resolves inside `current/`, which is replaced wholesale on every update. A `.portable` marker makes the data folder appear on first launch; an installed copy switches to portable data only when someone creates the `data` folder on purpose. `applyPortableMode` must run before anything reads a path, and `--user-data` runs after it because an explicit flag outranks the install-folder convention.
- In dev the default session cache is cleared on ready so static asset changes show on the next load. `disable-features=CalculateNativeWinOcclusion` keeps requestAnimationFrame alive while the window is occluded, which a headless launch always is.
- Relative `paths` entries resolve against the folder holding the built main script; `app.getAppPath()` is the script folder when Electron was started on the script and the app root when started on a folder or a packaged archive, and both shapes are handled. The preload is `preload.mjs` for an ES module package and `preload.js` otherwise; the first one present wins.
- A `devOnly` handler group is never registered in a packaged build; a repeated group id is skipped with a warning because `ipcMain.handle` throws on a channel registered twice. `--boot-timing` prints one line per boot milestone.
- The app window is created with `show: false` and `paintWhenInitiallyHidden`, so the renderer runs and paints its first frame while nothing is on screen. A saved maximized or fullscreen state is applied as a plain size while hidden and as `maximize()` or `setFullScreen` at the reveal, so the page never lays out again after it appears. Window state is tracked and saved from the reveal on.
- The splash is a top-level window: `frame: false`, `roundedCorners: false`, `hasShadow: false`, `thickFrame: false`, not resizable or movable, centred on the display the app will open on. Its preload (`/splash-preload`) exposes `window.brockSplash` with `onProgress`, `onFailure`, `retry`, `quit` and `openLogs`; main sends `splash:progress` and `splash:failure` and replays the last state when the page finishes loading. Closing the splash before the reveal quits the app.
- The reveal waits for the main tasks, the renderer's `boot:ready` (sent after its `first-frame` task) and any hold such as the splash capture. It sets the app window to opacity 0, shows it, fades it to 1 while the splash fades to 0 over 220 ms, then destroys the splash. `setOpacity` is a no-op without a compositing window manager, so nothing depends on the fade running.
- Main joins the two progress streams: its own weighted tasks plus the renderer's, with a reserve of 4 weight units for the renderer until its first report. The bar never moves back. A failure (`boot:failed`, a main task, `render-process-gone`, a failed main frame load, or 8 s without a renderer message) shows the error screen. Retry reloads the app window after a renderer failure and relaunches the app after a main one.
- `--screenshot=<name>` captures at the reveal, then quits; a 20 s watchdog fires the same capture when the reveal never comes so an automated boot always ends. A boot failure exits 1.

## Window details

- The window and taskbar icon come from the shipped renderer `logos/` folder, the one the brand pipeline fills: `icon.ico` then `icon-256.png` on Windows, `icon-256.png` elsewhere. A named instance looks for `icon-bot.ico` and `icon-bot-256.png` first. In dev the source `public/logos/` wins over a stale build. A missing icon is a warning in the main log, never a failed launch.
- Every Windows launch sets the AppUserModelId to `product.appId` before the first window, so the taskbar groups the app under its own id and icon. A named instance uses `<appId>.instance.<name>`, a taskbar group of its own.
- The automation off-screen origin is 400 px right of the rightmost display, derived from the real display layout so the OS cannot clamp it back. `focusable: false` sets `WS_EX_NOACTIVATE` on Windows (and implies `skipTaskbar`), so `SetForegroundWindow` cannot succeed; CDP input needs no OS focus. `paintWhenInitiallyHidden` keeps an off-screen run rendering for screenshots and `backgroundThrottling: false` keeps frames at full speed. A headless launch applies the saved size only, since the saved position would drag the window back onto a display.
- A normal launch shows the app window with `show()` and focuses it after the fade. `center: false` because the automation window is placed off every monitor and a normal window is positioned by the saved state while invisible. A named instance holds its own title by cancelling `page-title-updated`.
- Keep in background: many things raise a window later (a CDP click calls `Page.bringToFront()` first, DevTools activates its owner, the OS raises windows for its own reasons), so gaining focus at all is treated as the fault and undone, for the whole life of the window, debounced 50 ms so one helper process is spawned, not five. `blur()` runs only while the window holds focus, because an unconditional blur drops the foreground to the desktop. The first painted frame can bounce the window back up the z-order on Windows. On Windows `showInactive()` still lands on top, so `SetWindowPos(HWND_BOTTOM)` is called on the native handle through a hidden PowerShell child (`-EncodedCommand`, UTF-16LE base64, sidesteps quote escaping; `SWP_FLAGS` 0x13 is `SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE`).
- Saved geometry lives in `Data/config/window-state.json` as content bounds: with `titleBarStyle: 'hidden'` the constructor's window bounds and the content bounds disagree on Windows, so state is applied after construction while the window is invisible. Normal bounds are tracked through move and resize because `getNormalBounds()` includes the invisible frame on Windows. A saved position is used only while it still lands on a visible display (50 px tolerance). Geometry is persisted on close except on an automation launch.
- Aspect lock: the renderer asks for a ratio plus the height of its own chrome above the locked area; the window snaps to fit (shrinking, never growing) and the ratio is enforced on every resize of the main window through `will-resize`, because Electron's `setAspectRatio` does not honour the title-bar offset. The lock belongs to the main window alone: widget windows and every other window resize freely, and the widget resize pipeline (`planResize`) applies it to the main window only. A corner drag fits within the proposed bounds; an edge drag keeps the dragged dimension.
- Startup flags: `--window-size[=WxH]` opens at a fixed size and skips saved geometry; `--fresh` ignores saved layout and persists nothing; `--muted` / `--sound` set the starting audio state, which the renderer's own control then owns. The window size is consumed in main; everything else reaches the renderer as `--startup-*` flags, and any `--startup-*` argument already on the command line is forwarded as is. The instance name, profile, dev verdict and automation flag are forwarded because the renderer does not inherit main's argv.
- `window.open` never creates a second window: an allowed protocol goes to the OS browser, anything else is dropped. Default permissions are device access (WebHID, WebUSB, serial, gamepad), fullscreen, pointer lock, keyboard lock, clipboard read and sanitized write, media capture, notifications and window management; geolocation, MIDI and screen capture need an explicit entry. The application menu holds only the clipboard roles; F1 to F12 and Tab bypass menu accelerators and reach the renderer. The right-click menu shows Copy, Cut, Paste and Select All only where they apply.
- Icons: Windows renders a multi-resolution `.ico` better than a downscaled PNG, so `.ico` is tried first there; a missing file falls through to the next candidate and no icon at all leaves Electron's default. In development the renderer loads from the dev server when `ELECTRON_RENDERER_URL` is set; a built page's file name is also its route there.

## Widget windows

- `src/main/widgets` holds the windows a widget opens when it leaves the app. The renderer asks through the `widget:*` channels of brock-core (`ipc/widget-contract.type.ts`); which widgets may leave is the widget definition's `popOut`, so main knows nothing about any particular widget. A widget window is frameless, loads the app renderer with `?widget=<id>` and the same preload and `--startup-*` flags, and is shown without taking the focus.
- Pin: `off` or `top` (always on top). Following the app is the `sync` option: a synced window mirrors the app's own always-on-top, comes forward when the app does, and minimizes and restores with it, and the main window's `window:setAlwaysOnTop` re-applies it to every synced window. A saved `with-app` pin, from before the two were merged, opens as `off` with `sync` on and is reported back to the layout.
- Pin level: every always-on-top call goes through `setPinned`, which asks for `pop-up-menu` on Windows and `floating` elsewhere. On Windows Electron puts the levels from `floating` to `status` behind the taskbar, and that placement can drop the window out of the topmost band, so a pinned widget or the pinned app could lose its pin at once or on a later focus.
- Snap: `will-move` is taken over. The wanted bounds come from the cursor minus the offset it grabbed the window at, at the window's own size, never from the event bounds, whose units differ per display scaling; `snapTo` then lands the window flush on the nearest edge of the app or another widget window within 14 DIP that shares some span with it. The edge it lands on is its link, and moving the app or a linked window tows every window linked to it by the same delta.
- Drag back in: while the cursor is on the dragged window and inside the app's content bounds, the OS keeps the move and the app hears `widget:dragOver` with the point in content coordinates, so the dock draws its drop hints; a release there sends `widget:dropIn`. `pointInApp` is the pure check.
- A remembered position is clamped into the work area of the display it lands on, and a window without one opens beside the app. Bounds, pin, snap and link changes go back to the app (`widget:bounds`, `widget:popped`), which keeps them in the profile's layout; a closed window reports where it asked to go (`widget:closed`). A pref changed in a widget window reaches the main window as `widget:prefs` and is saved with the profile there. Every widget window closes with the main window.
- On a headless launch (`--no-focus`) a widget window opens at the off-screen origin with `focusable: false` and is kept in the background like the app window; `--muted` mutes its audio.

## Crash forensics and diagnostics

- Forensics turns a silent death into a trace in `Data/debug/main-console.log`. It is observation only: nothing changes app behaviour and nothing leaves the machine (the crash reporter runs local with upload off; minidumps land under `app.getPath('crashDumps')`). It arms before ready because the crash reporter must run before any child process exists; lines written before `initPaths` are held and flushed with the first line that reaches disk.
- Forensics lines write to the terminal stream directly, not through `console`, because the dev file logger wraps `console` and the line would land in the log twice. A GUI launch may have no terminal, so a failed terminal write is swallowed. `sync: true` is for handlers that may be the last thing to run before the process dies.
- `uncaughtExceptionMonitor` observes without counting as a handler, so Electron's own error dialog stays; it also sees unhandled rejections because Node escalates one into an uncaught exception and the monitor's `origin` says which it was. `render-process-gone`, `child-process-gone`, `unresponsive` and `responsive` are hooked at the app level and written synchronously because a dying GPU process can take the browser process with it. `app.quit` and `app.exit` are wrapped, never replaced; a quit with no origin recorded came from outside the app.
- Every 30 s a heartbeat line records the memory of the main process and every process Electron knows about, file only, timer unref'd. `ProcessMetric` sizes are already kilobytes; `process.memoryUsage` values are bytes.
- Diagnostics: only main can see the whole desktop (the renderer's `window.screen` describes one display); a `displayFrequency` of 0 is reported as null; with no display server `getPrimaryDisplay` throws and every display reports `primary: false`. `app.getGPUInfo('complete')` is an untyped bag that rejects under `--disable-gpu`, and then an empty object is used. `process.getSystemMemoryInfo` reports kilobytes and is unavailable on some sandboxes, so swap degrades to null.

## Files, logs and paths

- Every location derives from the userData root Electron settled on (portable mode and `--user-data` may have moved it); app files sit one level down in `Data/`. `initPaths` runs once the root is final; until then the paths are relative and nothing may write through them. `getLegacyPath` addresses files directly under userData beside `Data/`.
- The Node `FileStore` takes POSIX paths relative to `Data/`; `resolveDataPath` throws on any path that escapes the root. The IPC file handlers expose this same store to the renderer, so a domain module written over the `FileStore` port runs in-process in main with no round trip. Bytes cross IPC as ArrayBuffers.
- `readJsonFile` strips a UTF-8 byte-order mark and returns the fallback for a missing or unreadable file; `writeJsonFile` creates the parent folder first.
- `Data/debug/main-console.log` is scoped to one launch: the first write of the process truncates it. One module owns the path and line format, so the dev console mirror and crash forensics land in the same file in the same shape. A line produced before `initPaths` is held back (up to 200 lines) and flushed ahead of the first line that can reach the disk. `appendMainLogSync` exists for handlers that run as the last thing before the process dies; every write is best effort.
- The dev file logger is never installed in a packaged build; it mirrors main and renderer console output (through the `console-message` event, no renderer changes) so a hard crash leaves the last thing that happened on disk. It must run after `initPaths`, and a logging failure never breaks the app.
- The renderer log-bus batches reach main on the fire-and-forget `debug:appendSessionLog` channel and are appended to `Data/debug/session.log`; appends are chained on one promise so batches land in arrival order, and a failed write drops that batch. At startup the previous `session.log` rotates to `session-1.log` so the last two sessions stay readable.
- `createRendererLogger` sends lines to the in-app console on `log:entry`; a line sent while there is no window is dropped.

## Handlers

- A cancelled dialog is an ordinary outcome: `pickFile` and `pickPath` return null and `saveFile` reports `saved: false` with no error. `dialog:pickPath(folder, extensions)` returns the picked path, not the bytes: a folder dialog when `folder` is true, else a file dialog filtered by `extensions`.
- `debug:revealLogs` opens `Data/debug` in the file manager, as Open logs on the boot splash does.
- `profiles:create` writes the record only; which profile opens next time is a separate `profiles:setLast` call, so a renderer can skip it on an automation launch.
- `network:lanAddresses` returns `lanAddresses()`: every non-internal network interface address, IPv4 before IPv6. Main code imports `lanAddresses` directly.
- Screenshots go to `Data/screenshots/<name>.png`; the name must pass `assertSafeName`. `captureWindow` serves both the `test:screenshot` channel and the `--screenshot` launch flag.
- Play sessions live at `Data/profiles/<id>/sessions.json`, newest first, capped at 100 entries.
- The storage summary is the immediate entry count plus the recursive byte size per domain; unreadable entries are skipped; the rows come from `BootstrapOptions.dataDomains`.
- `Data/ui-views.json` is one JSON map shared by every profile; the renderer debounces before calling, so the handlers are a plain read and write.

## Named instances

- `--instance=NAME` identifies the window (title, icon, title-bar badge) and selects the profile of the same name so parallel launches never share profile data; `--profile=NAME` selects a profile by id or display name and defaults to the instance name. The name becomes a profile folder, so it is lowercased and must match `^[a-z0-9][a-z0-9-]{0,38}$`; an invalid name is logged and ignored.
- A named instance never writes the files every launch shares: `window-state.json` (guarded in the window layer) and `app.json`'s `lastProfileId` (guarded in the renderer). Only the profile is sandboxed; userData is the same folder for every instance.
- `BrowserWindow.icon` alone does not make an instance show as its own app. On Windows taskbar grouping keys off the AppUserModelID, so each instance gets `<appId>.instance.<name>`, set before the first window is created. On macOS the dock icon is set through `app.dock.setIcon`; on Linux the window icon is enough.

## IPC typing and protocols

- `handle`, `on` and `emit` constrain the channel to a key of the augmented contract and infer the arguments and return type, so a misspelled channel or a wrong handler signature is a compile error. `emit` is fire and forget: the render frame can be mid-disposal during a reload, which makes `webContents.send` throw, and the renderer re-subscribes on load, so a send dropped in that gap is safe to ignore.
- Custom schemes must be declared privileged before the app is ready, once, in one call; the product's schemes and every module's are merged and a scheme listed twice keeps the first entry.
- `serveDirectoryScheme` maps `<scheme>://<host>/<path>` to `<rootDir>/<path>`. The scheme is registered as standard, so Chromium hands the path over percent-encoded with dot segments collapsed; it is decoded and re-encoded as a file URL so a name holding `#` or `%` still resolves. A path that would leave the root answers 403. Call it after the app is ready.
- `MainPaths.userData` is Electron's userData root and `MainPaths.data` is the `Data/` folder under it. `BootstrapPaths` relative entries resolve against `<appPath>/dist/electron`. `SecurityOptions.externalProtocols` are written with the trailing colon; `permissions` are Chromium permission names the renderer is granted. `InstanceInfo` has both fields null on a normal launch.

## Preload

The flat `window.api` methods are generated from a method-to-channel map so no channel literal is written per method; one cast per factory bridges the untyped `ipcRenderer` surface. Main forwards launch facts through `additionalArguments` as `--startup-<name>` or `--startup-<name>=<value>`; the renderer never sees main's argv, so this is all it knows about how it was started. A namespace whose id collides with an existing api member replaces it and logs a warning. `exposeAs` defaults to `api`; `helpers` are non-IPC values placed beside the flat methods; `debugGlobal` is a second plain global (a name like `__myAppDebug`) for dev and test aids outside the contract.

`createPreloadBridge` exposes `isDev`, `os`, `getFilePath`, `startup` (`fresh`, `automation`, `muted`, `sound`, `flags`), `instance` (`name`, `profile`), the flat methods generated from the maps, and each namespace's object under its id. `isDev` is main's verdict, forwarded as `--startup-dev`. A `PreloadNamespace` is `{ id, build(tools) }` where `tools` carries `invoke`, `send`, `subscribe`, `startup`, `instance`, `isDev` and `os`.

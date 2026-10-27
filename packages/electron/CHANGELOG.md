# @drizztdourden08/brock-electron

## 0.107.0

### Minor Changes

- 77e2dfe: A process job now keeps its full output in a log file. The outcome of `ctx.processes.run` (and `jobs.runProcess`) gains `logFile`, the path of a file under the debug folder (`process-logs`) with every cleaned, redacted line of stdout and stderr, next to the 20-line `tail`, which stays as it is. The file is bounded at 5 MiB: it keeps the start and the end and marks the gap. The new `logFile` run option sets another cap (`logFile: { maxBytes }`) or turns the file off (`logFile: false`). `log: false` also writes no file. Brock keeps the newest 20 log files and removes older ones.

### Patch Changes

- Updated dependencies [77e2dfe]
  - @drizztdourden08/brock-core@0.107.0

## 0.106.2

### Patch Changes

- @drizztdourden08/brock-core@0.106.2

## 0.106.1

### Patch Changes

- @drizztdourden08/brock-core@0.106.1

## 0.106.0

### Patch Changes

- @drizztdourden08/brock-core@0.106.0

## 0.105.0

### Minor Changes

- e345020: Run a process as a job. `ctx.processes.define(id, { label, parse, resolve, progress?, successCodes?, elevate?, cancel? })` registers a program the renderer may start by id with `jobs.runProcess(id, args)`, and `ctx.processes.run(id, spec, options)` runs one from main. The renderer sends only the id and one value; the app's `parse` checks it and `resolve` builds the argument array, so the renderer never names a program, an argument list, a directory or an environment. The program is spawned with `shell: false`, `windowsHide: true`, an absolute command, a plain argument array and an environment that starts from a short allowlist plus what the app adds. Its stdout and stderr lines go to the job log (cleaned, with each line cut at 4096 characters), an optional `progress` parser turns a line into a fraction or a label, and the job is done on exit code 0 or a listed code and failed otherwise, with the code and the last 20 lines in the outcome. The renderer call is accepted only from the top frame of the main window at the app origin (`fromAppFrame`, also exported for other handlers). Commands are checked hard: on Windows a normalised drive letter `.exe` or `.com`, with scripts, data streams, network and device paths and command interpreters such as `cmd`, `powershell` and `msiexec` refused unless the definition allows them, and `spec.env` may not set `NODE_OPTIONS`, `ELECTRON_*`, `LD_PRELOAD`, `DYLD_*` or `PATH` unless allowed. Log lines lose OSC and C1 sequences and bidi overrides, `redact` and `log: false` keep secrets out of the log, and each job update carries at most 64 KiB of the log. `timeoutMs` force-kills a long run. Cancel stops the whole process tree (`taskkill /T`, then `/F`, on Windows; SIGTERM then SIGKILL to the process group elsewhere), one process runs per job id, and a quit kills every running process. An outcome is `cancelled` only when the kill ended the process. If the kill is refused or the process outlives it (an installer that raised its own rights), the outcome is `detached` and the id stays busy until the process exits; an `elevate: 'installer'` job is not cancellable unless the definition says so. `elevate: 'installer'` only notes that the program may show its own system prompt; Brock never raises rights. Core caps the log in each job update and gains the `ProcessJobOutcome` type and the `job:runProcess` channel (`runProcessJob` on the host API); react gains `jobs.runProcess`.

### Patch Changes

- Updated dependencies [e345020]
  - @drizztdourden08/brock-core@0.105.0

## 0.104.0

### Minor Changes

- 632c810: A handler registered through `ctx.handle` can throw an `AppError` (`new AppError(message, { code, data? })`) and the renderer reads the code and data back with `isAppError(error, 'code')`, where before only the message crossed. The error rejects as usual with the human message plus an encoded tail that the preload keeps and `isAppError` decodes. `data` must be JSON-safe (checked when the error is made) and is dropped with `dataDropped: true` past 8192 characters of JSON. A plain error behaves as before, and no stack crosses. `AppError`, `isAppError`, `toAppError`, `encodeAppError` and `decodeAppError` come from `@drizztdourden08/brock-core/ipc`.

### Patch Changes

- Updated dependencies [632c810]
- Updated dependencies [6e3ed14]
  - @drizztdourden08/brock-core@0.104.0

## 0.103.0

### Patch Changes

- @drizztdourden08/brock-core@0.103.0

## 0.102.0

### Patch Changes

- @drizztdourden08/brock-core@0.102.0

## 0.101.0

### Patch Changes

- Updated dependencies [b0d5e5e]
  - @drizztdourden08/brock-core@0.101.0

## 0.100.0

### Patch Changes

- @drizztdourden08/brock-core@0.100.0

## 0.99.0

### Patch Changes

- @drizztdourden08/brock-core@0.99.0

## 0.98.0

### Patch Changes

- @drizztdourden08/brock-core@0.98.0

## 0.97.2

### Patch Changes

- @drizztdourden08/brock-core@0.97.2

## 0.97.1

### Patch Changes

- 5d73454: A visible instance launch now acts like a user launch. `--instance` and `--profile` only pick an identity, so a launch with just those no longer counts as an automation launch: `worktree launch <name> none --visible` shows the start-up prompts, the first-run tour, the dialogs and the folder questions, and the window is held on close like any app window. A hidden launch still passes `--no-focus` and stays automated. A named instance still takes no single-instance lock, writes no window state, no last profile and no Linux desktop entry. Upgrading: an app that relied on `--instance` alone to silence prompts must pass `--no-focus` or another automation flag too.
- Updated dependencies [5d73454]
  - @drizztdourden08/brock-core@0.97.1

## 0.97.0

### Patch Changes

- @drizztdourden08/brock-core@0.97.0

## 0.96.1

### Patch Changes

- @drizztdourden08/brock-core@0.96.1

## 0.96.0

### Patch Changes

- @drizztdourden08/brock-core@0.96.0

## 0.95.0

### Minor Changes

- 19d15bf: `ctx.dialogs.confirm` takes `defaultButton: 'confirm' | 'cancel'`, the button Enter lands on (`'confirm'` by default, as before). Escape and closing the box still answer `false`. A new `ctx.dialogs.choose({ title, message, detail?, choices, defaultId, cancelId, showOnAutomation? })` shows two to four named answers and resolves the id picked. Enter picks `defaultId`. Escape, closing the box and an automation launch resolve `cancelId`. Bad ids or a wrong number of choices throw. No change is needed in an existing app.

### Patch Changes

- @drizztdourden08/brock-core@0.95.0

## 0.94.0

### Minor Changes

- aeee8c7: Tests can now exercise the folder grant of `documents.open` and `documents.saveAs`. `grantFolder: { ask: true, showOnAutomation: true }` shows the native folder question on a plain `--no-focus` launch, like `ctx.dialogs.confirm({ showOnAutomation })`, and it stays refused on `--review` and `--screenshot` launches. For hidden tests that cannot click a dialog, the launch flag `--answer-folder-grants=grant|decline` answers the question without showing it. It is honoured only on a headless automation launch of an unpackaged app, and ignored anywhere else, with one log line when the app first asks for a folder. It grants the same folder a human yes would, without remembering it, and only when the app asked with a valid `grantFolder` option. No change is needed in an existing app.

### Patch Changes

- Updated dependencies [aeee8c7]
  - @drizztdourden08/brock-core@0.94.0

## 0.93.1

### Patch Changes

- @drizztdourden08/brock-core@0.93.1

## 0.93.0

### Minor Changes

- ee7a2a8: `documents.reveal(path)` in the renderer and `ctx.documents.reveal(path)` in main show a file or folder in the system file manager with `shell.showItemInFolder`, only for a path the documents port can already read, and answer `{ revealed, reason? }` over the new `document:reveal` channel. Built-in chords now yield to app commands: when an app, module or runtime command has the same default chord, the Brock command drops it and no conflict is reported. `brock.fullscreen` is now bound to F11 and Alt+Enter, so an app can take Alt+Enter for Properties with no override.

### Patch Changes

- Updated dependencies [ee7a2a8]
  - @drizztdourden08/brock-core@0.93.0

## 0.92.0

### Patch Changes

- @drizztdourden08/brock-core@0.92.0

## 0.91.0

### Minor Changes

- c364271: `documents.open` and `documents.saveAs` take `grantFolder: 'ask'` or `{ ask: true, levels }` to grant the folder of the picked file, after a native confirm that names the exact folder, with the refused-root checks and the remembered folders of `openFolder`; the answer then carries `folderGranted` and a reason.

### Patch Changes

- Updated dependencies [c364271]
  - @drizztdourden08/brock-core@0.91.0

## 0.90.0

### Patch Changes

- @drizztdourden08/brock-core@0.90.0

## 0.89.1

### Patch Changes

- @drizztdourden08/brock-core@0.89.1

## 0.89.0

### Patch Changes

- 8b785cc: `appLaunch()` finds the entry file as the first argument that is not a flag, so an app started by Playwright or launchAppForTest with `--inspect=0` in front still records its app folder and can be started again from a helper.
  - @drizztdourden08/brock-core@0.89.0

## 0.88.1

### Patch Changes

- a44158f: Two fixes for a headless helper app. `ctx.dialogs.confirm` takes `showOnAutomation: true` to show the native dialog on a plain `--no-focus` launch, where it used to answer no without showing anything. The default stays false, and the option is ignored on `--review`, `--screenshot` and `--screenshot-splash` launches, which must never block. `appLaunch()` now starts the app folder that holds the `package.json` whose `main` is the running entry, so an app started as `electron dist/electron/main.js` (as `launchAppForTest` does) writes a launch file that can restart it. It falls back to the app path when no such folder is found, and a packaged build still starts with no app argument.
  - @drizztdourden08/brock-core@0.88.1

## 0.88.0

### Minor Changes

- 8422f5e: File operations and watching for folder grants. `ctx.documents` and the renderer's `documents` gain `trash(path)` (the system trash through `shell.trashItem`, no permanent delete, never the grant root), `rename(from, to, { overwrite? })`, `mkdir(path, { recursive? })`, `revokeFolder(path)` and `watch(folder, { recursive? }, listener)`, which emits `{ kind: 'add' | 'change' | 'remove', path }` over `fs.watch` with a 100 ms debounce and the 5000 entry cap of a listing, and stops on unsubscribe, revoke and window close. Every operation runs the write checks on the real path on every call: the class refusals, links that lead outside, the app's own folders, device names and the Mark of the Web on a risky new extension. Folders the user picks in the dialog are remembered per profile in the signed store of the recent list (per-install key), and `documents.rememberedFolders()`, `regrant(path)` and `forgetFolder(path)` list, restore without the dialog (only a signed entry that still passes the grant root checks) and remove them. Main grants are never remembered unless main calls `rememberFolder`. New channels `document:revokeFolder`, `document:trash`, `document:rename`, `document:mkdir`, `document:watch`, `document:unwatch`, `document:rememberedFolders`, `document:regrant`, `document:forgetFolder` and the event `document:watchEvent`; `document:openFolder` takes the profile id. Revoking never touches the disk and matches by name only, a rename checks the new name of a folder or link and what a folder's content would newly become, trash and rename act on a link itself, watches belong to the page that asked and stop on reload, and remembered folders that are missing stay listed as unavailable.

### Patch Changes

- ea6faa6: Keep a server process alive until it is stopped. `runServer` kept its heartbeat on an unref'd timer, so a server whose start function opens nothing that holds the event loop (the create-brock server starter, or a worker that only polls) logged `started` and then exited at once. The heartbeat timer now holds the process, and `stop()` (SIGTERM, SIGINT or an explicit call) clears it, so a stopped server exits with code 0. The new `holdProcess` option of `runServer` turns the hold off for tests that start a server and never stop it.
- Updated dependencies [8422f5e]
  - @drizztdourden08/brock-core@0.88.0

## 0.87.2

### Patch Changes

- @drizztdourden08/brock-core@0.87.2

## 0.87.1

### Patch Changes

- @drizztdourden08/brock-core@0.87.1

## 0.87.0

### Minor Changes

- f32d5d9: A helper can now start the app and call ask channels. `appLaunch({ background? })` from `brock-electron/main` returns `{ command, args, env }` for the current app, packaged or in development, with the identity flags of the launch. The bridge writes it to `launch-<discovery file name>` beside the discovery file each time it opens, and `readAppLaunch` and `startApp` from `brock-electron/bridge` read it under the same private-file checks and start the app, with `--background` on request. `relayAsk(bridge, CHANNEL, { window, timeoutMs?, validate? })` exposes an ask channel as a bridge route, so `bridge.request` accepts ask channels and returns the renderer's answer; `validate` is required, at most 8 requests wait per route (code `busy`), and failures reach the helper as fixed `no-window`, `timeout` and `closed` errors or as `the request failed`. `readAppLaunch` refuses a launch file with a non-empty `env` or unknown arguments, and `startApp` checks the executable exists and drops `ELECTRON_RUN_AS_NODE` and `NODE_OPTIONS` in any case. `--instance` and `--profile` no longer stop `--background` from counting, so a background launch works for a named instance. `channelApi` no longer throws on a channel set that holds ask channels, which the preload never maps. `brock-core` exports `BACKGROUND_FLAG`, and `IDENTITY_FLAGS` from `/automation`.
- 5c45abf: Add `server.optionalAddons: string[]` to `brock.config.ts`, a list of package names. For a `.node` require, or a `bindings`, `node-gyp-build` or `prebuild-install` load, inside a listed package, `brock server build` replaces the addon with a module that throws when it loads, so the package's own try/catch runs and the bundle carries no binary (ssh2 and cpu-features work this way). An addon in the app's own code or in an unlisted package is still refused, and the error now names the package and points to `server.optionalAddons`. `@drizztdourden08/brock-electron/server` also exports `resolveDataDir(argv, env, cwd)`, the rule `runServer` uses for the data folder (`--user-data=`, `BROCK_DATA_DIR`, `STATE_DIRECTORY`, then `./.user-data`); `runServer` calls the same function.
- ec02417: `ctx.window.show()` now brings the window of a hidden automation launch on screen, at its saved bounds or centred on the primary work area, and `ctx.dialogs.confirm({ title, message, detail?, confirmLabel?, cancelLabel? })` asks a native yes or no question from main code while the app window is hidden. On an automation launch confirm shows nothing and resolves false.

### Patch Changes

- Updated dependencies [f32d5d9]
  - @drizztdourden08/brock-core@0.87.0

## 0.86.0

### Patch Changes

- @drizztdourden08/brock-core@0.86.0

## 0.85.0

### Patch Changes

- @drizztdourden08/brock-core@0.85.0

## 0.84.0

### Patch Changes

- @drizztdourden08/brock-core@0.84.0

## 0.83.0

### Patch Changes

- 10222eb: The review no longer fails `console-errors` on the browser notice `ResizeObserver loop completed with undelivered notifications.`. A window resize can defer observer callbacks to the next frame, and nothing is lost when it does. The renderer's global error handler now logs exactly that message as a warning and keeps it off the console, and the review's console feed skips it. Core exports `isBenignBrowserError` for that test. Every other console error still fails the check. `gate-context-only-reopens` now says whether the window came back in the wrong place, with both bounds, or was not shown again in time.
- Updated dependencies [203ad09]
- Updated dependencies [10222eb]
- Updated dependencies [203ad09]
  - @drizztdourden08/brock-core@0.83.0

## 0.82.0

### Minor Changes

- a44cf5d: Data domains under plain Node. `createDataDomains(dataDir, defs)` from `@drizztdourden08/brock-electron/node` returns the same `DataDomains` as `ctx.storage` (with a `DomainFiles` per domain): the same atomic writes, path guards and `usage()` size, for a process with no Electron, such as a headless server. `dataDir` is the folder the domains sit in (the `Data/` folder of an Electron app). The entry still reaches no module of Electron, and a keep test checks the new import graph.
- c0b1c3d: New `@drizztdourden08/brock-electron/server` entry for apps that run without a window. It never loads Electron. `runServer(start, options?)` resolves the data folder (the `--user-data=` flag, then `BROCK_DATA_DIR`, then systemd `STATE_DIRECTORY`, then `./.user-data`), logs one line per event to stdout (errors to stderr) in the main log format, calls the `stop` that `start` returned on SIGTERM and SIGINT, and writes a heartbeat to `<data>/.brock/server-health.json` every 10 seconds. `start(host)` gets `{ dataDir, args, log, domains }` and returns `{ stop, health? }`; an optional `domains` factory in the options builds the `domains` value from the data folder. The `health` command (`main.mjs health`) reads that file and exits 0 when it is under 30 seconds old and ok, and 1 otherwise, so a container health check or a CI smoke test needs no port. `embedServer(start, ctx, options?)` in `/main` runs the same start function inside the desktop app's main process, with the data folder from `ctx.paths`, the log written through `appendMainLog`, and `stop` called when the app quits.

### Patch Changes

- Updated dependencies [b5c6c13]
  - @drizztdourden08/brock-core@0.82.0

## 0.81.0

### Minor Changes

- 1f6543a: Breaking: `ctx.documents.resolve` and `ctx.documents.isAllowed` now return a promise, so main code must await them; migration documents-access-async leaves a to-do at each call that is not awaited. Folder grants in the documents allowlist. The user picks a folder with the new `documents.openFolder(options?)` dialog, or main code calls `ctx.documents.allowFolder(path)` (and `revokeFolder(path)`). Every file inside a granted folder, at any depth and whether it exists or not, then passes for `read`, `readText`, `write` and `writeText`. The check runs on the real path on every call: a `..` segment, a link or junction that leads outside, a sibling folder with the same name prefix, a dangling link and, on Windows, a raw prefix, an alternate data stream or a device name are all refused, and 8.3 short names and case are resolved. The exact-file rule still holds for everything else. `ctx.documents.list(folder, { extensions?, recursive? })` in main, and `documents.list(folder, options?)` in the renderer over `document:list`, list a granted folder only and answer `{ entries, truncated }`, entries being `{ path, name, kind, size, modified, link }`, bounded to 5000 entries, 8 levels and 5 seconds. A grant that is, or sits inside, one of the app's own folders (userData, `Data`, the executable's folder, resources) is refused, a broader grant never reaches them (reads, writes and listings leave them out), a grant that is the home folder, holds it, or is, holds or sits inside AppData, Library, .config, .local, .cache, Program Files, Windows or ProgramData is refused, writes under any grant are refused in autostart paths (Startup folders, shell and PowerShell profiles, LaunchAgents), in repository and editor configuration (any .git segment, .husky, .vscode, .idea, .devcontainer, .github/workflows, files named HEAD, commondir or gitdir) and for credential-leaking files (.lnk, .url, .scf, .library-ms, .searchConnector-ms, desktop.ini, autorun.inf), and on Windows an executable or macro-capable file written under a grant gets a Mark of the Web stream, only one listing runs at a time, a data domain `dir` that resolves to `Data/` itself is refused, the recent signing key lives in the user data `keys` folder, network paths are refused before any file system call, Windows names that end in a dot or a space and all device names are refused, and a file reached only through a grant is never added to the recent list. Recent entries are now signed with a per-install key and checked when read, so the entries an earlier version wrote are dropped once; document calls that name a profile need an existing profile. `ctx.documents.recent(profileId?)` gives main code the same recent list the renderer sees. The new `DocumentEntry`, `DocumentListOptions` and `DocumentFolderOptions` types are in core.

### Patch Changes

- Updated dependencies [1f6543a]
  - @drizztdourden08/brock-core@0.81.0

## 0.80.0

### Minor Changes

- b6459f5: Breaking: `ctx.window` is now a function with a `show()` method and `AutomationFlags` gains `isBackgroundLaunch()`, so a hand-built `MainContext` or flags object in a test needs the new members; migration main-context-window-show leaves a to-do at each one.

  feat: background launch and an opt-in tray icon

  An app can start with no window. A `--background` launch, or a `beforeWindow(ctx)` hook that returns `'skip'`, skips the splash and the app window while the whole boot and the bridge still run. `ctx.window.show()` creates the window on demand, or restores and focuses it. In background mode the app keeps running when the last window closes. A normal second launch shows the window, a second launch with `--background` shows nothing, and automation launches behave as before.

  `product.tray` or `ctx.tray.set({ tooltip, icon?, menu? })` adds a tray icon. It uses the app icon by default, a left click shows the window, the menu takes show and quit actions, id items for `ctx.tray.onItem` and separators, and the tray is removed on quit. It is off unless the app asks.

- 9398c37: Breaking: the helper bridge moves to protocol 2, so a helper built against 0.78 or 0.79 cannot talk to an app on this version and must be rebuilt (`brock build` bundles it again) and shipped with the app; `bridge.emitTo` now returns a count. Migration `bridge-protocol-2` turns each `connectBridge` use and each `.emitTo(` into a to-do, since the fix is a rebuild and a release, not a code edit.

  Bridge v2. `ctx.bridge.open()` and `ctx.bridge.close()` open and close the bridge at run time, each open with a new secret and endpoint, and serialized so a close and a reopen never remove the live discovery file; `bridge.openOnBoot: false` keeps it closed until the app opens it. `bridge.handleWith(route, (call, ...args) => ...)` gives handlers `call.connectionId` (16 random bytes, not a capability), and `bridge.onOpen`, `bridge.onClose` and `bridge.connections()` follow clients; a throwing listener is logged. `bridge.emit(event, ...args)` and `bridge.emitTo(connectionId, event, ...args)` push events, which the helper hears with `client.on(event, listener)` after `client.connect()`. The client authenticates with the session key before any request, and every server message is signed with it, pushes with their own counter. Each connection holds at most `maxBufferedBytes` (4 MiB) of unread output: pushes past it are dropped and a reply that does not fit closes the connection. `BridgeError` takes `{ code, data }`, which reach the client as fields; other errors stay masked, and Brock's codes are in `BRIDGE_CODES`. The client reads the discovery file through one handle with no link followed, checks that handle and, on macOS and Linux, the folder. `helperLaunch(name)` sets `BROCK_BRIDGE_FILE` to this app's discovery file.

### Patch Changes

- Updated dependencies [b6459f5]
  - @drizztdourden08/brock-core@0.80.0

## 0.79.0

### Minor Changes

- 6b26c03: An async quit guard and a write option for exports. `onBeforeQuit` on `BrockApp` and on a module is `() => 'quit' | 'stay'`, sync or async; the first `'stay'` keeps the app open, and a guard that throws counts as `'stay'`, so a failed save never closes the app. `quitGuards.addAsync` and `quitGuards.decide` register and run them, and `saveBeforeQuit({ dirty, save })` builds the usual guard with a Save, Discard and Cancel dialog (`confirmSave` is the dialog). Concurrent requests share one run, so a second close never stacks a second dialog. An app that registered a guard, sync or async, now also has native closes held (Alt+F4, the taskbar, the OS, `app.quit()`): main pings the renderer for 5 s, then waits on the user, and the renderer runs the same decision as Quit (sync messages, then async guards). An app with no guard closes at once as before, and a renderer that does not answer the ping closes. `window.close()` from app code goes through the hold too; `window.close({ force: true })` closes at once. An automation launch installs no hold. `documents.write` and `documents.writeText` take `{ recent: false }` for an export such as a PNG: the file is not added to the recent list or the OS recent menu, and no recovery snapshot is cleared. The default still records. The new `QuitDecision`, `DocumentWriteOptions` and `WindowCloseOptions` types are in core.

### Patch Changes

- Updated dependencies [6b26c03]
  - @drizztdourden08/brock-core@0.79.0

## 0.78.0

### Minor Changes

- 0a78a00: Outside helpers and the bridge. `helpers` in `brock.config.ts` names standalone Node entries, such as a stdio MCP helper: `brock build` and `brock dev` bundle each into `dist/helpers/<name>.mjs` with only Node built-ins left as imports, refuse an Electron import, and the managed electron-builder config ships them in `resources/helpers` outside the asar. `bootstrapApp({ bridge: { register } })` opens an opt-in local bridge in main: a per-session named pipe on Windows or a 0600 Unix socket in a private temp folder, never TCP, guarded by a random per-session secret that never crosses the wire: an HMAC handshake proves both ends hold it, and each request carries an HMAC under a session key, with ids that must grow. The discovery file always lives in the per-user app data folder, keyed by instance or data folder, private to the user (0600, or on Windows an owner and a single access entry for the user, set and checked with System32's icacls), cleared when stale and removed on quit. The client refuses a stale or open file, a dead pid, a non-local endpoint and, on POSIX, a socket folder that is not the user's own. Unauthenticated connections have their own cap and a 2 s deadline, and the client gives up on a handshake after 2 s. Routes take a `validate` check, and handler errors are masked unless they are a `BridgeError`. Routes are `invoke` entries, as in the IPC contract. Messages are JSON lines with ids, bounded by `maxMessageBytes`. The helper's client is `connectBridge` from the new `@drizztdourden08/brock-electron/bridge` entry, which imports nothing from Electron. `helperLaunch(name)` gives the command, arguments and environment for an MCP client config.

### Patch Changes

- dd4f22c: The bridge's Windows check on the discovery file now reads the owner and each access entry as full SIDs through `Get-Acl` (never the SDDL text, whose `LA` alias hid the built-in Administrator account), and trusts the user, SYSTEM and Administrators as owner and as allow entries. An administrator account, whose new files are owned by Administrators, was refused before, and the owner name match was fragile.
  - @drizztdourden08/brock-core@0.78.0

## 0.77.0

### Minor Changes

- af040f2: Recent documents and recovery snapshots for document apps. The documents port gains `recent()`, `clearRecent()` and `openRecent(path)`, a capped per-profile list that main fills on Open and on save, drops missing files from, feeds to the OS jump list and Dock menu, and reopens only through the document allowlist. It also gains opt-in `snapshot(key, data)`, `recoverable()`, `restoreSnapshot(key)` and `discardSnapshot(key)`, stored atomically in the profile folder and cleared on a clean save. brock-react adds `useRecentDocuments`, `useRecentMenu`, `useRecoverable` and an optional `RecoveryPrompt`.

### Patch Changes

- Updated dependencies [af040f2]
  - @drizztdourden08/brock-core@0.77.0

## 0.76.0

### Minor Changes

- 05f559e: Two options for document apps. `useDocumentTitle({ name, dirty })` shows the open document in the title bar and the OS window title, as `name * - App` while it has unsaved changes. `product.singleProfile: true` runs with one implicit `Default` profile, made silently on the first launch, with no profiles screen and no Profiles menu entry. Both are off until an app uses them.
- 5830a25: Document files at user paths. The renderer gets `usePlatform().documents` on Electron: `open`, `saveAs`, `read`, `readText`, `write` and `writeText`, over the new `document:*` channels (`documentOpen`, `documentSaveAs`, `documentRead`, `documentReadText`, `documentWrite`, `documentWriteText`). Open and Save As return the absolute path or null on cancel. A write is atomic: temp file beside the target, flush, rename over it, retried while Windows holds the target. The renderer may touch only a path the user picked in a dialog this session or one main code allows with the new `ctx.documents.allow(path)`. Data domain writes now flush before the rename too.
- 3a1ebfb: Main can now ask a renderer window a question and await a typed reply. Declare the channel with `ask<(id: string) => Promise<Snapshot>>()('doc:snapshot')` in `defineChannels`, add `AskContractOf<typeof APP_CHANNELS>` to the new `AskContract` interface, register the handler in the renderer with `answer(channel, handler)` from brock-react, and call `await ctx.ask(win, channel, ...args)` in main. Each ask has a correlation id and a 10 second timeout (`ctx.askWithin` sets another). It rejects with a clear message on a timeout, when the window has no handler, when the window closes, and with the handler's own message when it throws. No polling. See the Main asks a renderer section of `docs/architecture.md`.

### Patch Changes

- Updated dependencies [1e8234c]
- Updated dependencies [05f559e]
- Updated dependencies [5830a25]
- Updated dependencies [3a1ebfb]
  - @drizztdourden08/brock-core@0.76.0

## 0.75.0

### Patch Changes

- Updated dependencies [f7c46f5]
  - @drizztdourden08/brock-core@0.75.0

## 0.74.1

### Patch Changes

- @drizztdourden08/brock-core@0.74.1

## 0.74.0

### Patch Changes

- @drizztdourden08/brock-core@0.74.0

## 0.73.0

### Patch Changes

- @drizztdourden08/brock-core@0.73.0

## 0.72.0

### Patch Changes

- @drizztdourden08/brock-core@0.72.0

## 0.71.1

### Patch Changes

- @drizztdourden08/brock-core@0.71.1

## 0.71.0

### Patch Changes

- @drizztdourden08/brock-core@0.71.0

## 0.70.0

### Minor Changes

- a7bdec6: A headless launch (any automation flag without `--visible`) is now hidden: its windows are never shown, so no window, taskbar flash or focus steal reaches the desktop; `--visible` is the only way to show one.

  A hidden launch also turns hardware acceleration off, so its offscreen windows draw on the CPU and a machine without a GPU no longer crashes the GPU process.

- 34221ba: A hidden launch now draws WebGL. Hardware acceleration stays off, and the launch adds `enable-unsafe-swiftshader`, so a WebGL canvas renders on SwiftShader, the CPU renderer Chromium ships. It draws the same pixels on every host, with or without a GPU. A screenshot baseline run uses the same path.

  `--gpu` keeps hardware acceleration in a hidden launch, for a heavy WebGL check on a machine that has a GPU. A GPU-less host must not pass it.

### Patch Changes

- @drizztdourden08/brock-core@0.70.0

## 0.69.0

### Patch Changes

- f5cb604: Fix the Controllers window showing no controllers: the input, catalog, display and secrets modules now keep one instance per app, so register and onWindow no longer build two.
  - @drizztdourden08/brock-core@0.69.0

## 0.68.6

### Patch Changes

- @drizztdourden08/brock-core@0.68.6

## 0.68.5

### Patch Changes

- @drizztdourden08/brock-core@0.68.5

## 0.68.4

### Patch Changes

- 19a9788: Clear stale widget drag-over dimming when a window starts resizing.
  - @drizztdourden08/brock-core@0.68.4

## 0.68.3

### Patch Changes

- @drizztdourden08/brock-core@0.68.3

## 0.68.2

### Patch Changes

- @drizztdourden08/brock-core@0.68.2

## 0.68.1

### Patch Changes

- @drizztdourden08/brock-core@0.68.1

## 0.68.0

### Patch Changes

- Updated dependencies [1f7604e]
  - @drizztdourden08/brock-core@0.68.0

## 0.67.0

### Patch Changes

- @drizztdourden08/brock-core@0.67.0

## 0.66.0

### Patch Changes

- @drizztdourden08/brock-core@0.66.0

## 0.65.0

### Patch Changes

- @drizztdourden08/brock-core@0.65.0

## 0.64.0

### Patch Changes

- @drizztdourden08/brock-core@0.64.0

## 0.63.0

### Patch Changes

- @drizztdourden08/brock-core@0.63.0

## 0.62.0

### Minor Changes

- 16321f1: The title bar in full screen hides fully and slides in whole when the pointer reaches the top edge, above the widgets. Before, the revealed bar was drawn under the docked and floating widgets and under anything in the app content with a z-index, so only part of it showed: the window buttons sat behind a docked widget on the right, and an app whose main view stacks above the content saw a thin strip. The app content (`brock-app__content`) is now its own stacking context, so nothing in it can cover the title bar.

  - The behaviour is Tessera's `WindowTitleBar` one: hidden in full screen (and in a borderless or full screen window mode), shown while the pointer is within the top 40 px, and Alt moves focus into it for the keyboard. Escape inside that revealed bar is left to it.
  - A headless run (the review, `--screenshot`) now lays full screen out off screen at the display size, as cluster full screen already did, instead of taking over the real screen.
  - New review step `fullscreen`: in full screen the bar is fully hidden (`fullscreen-bar-hidden`, captured as `fullscreen`), pointing at the top edge draws all of it with nothing covering it, a docked widget open (`fullscreen-bar-reveal`, `fullscreen-revealed`), moving away hides it (`fullscreen-bar-leaves`), Alt reveals it with focus inside (`fullscreen-bar-keyboard`, `fullscreen-keyboard`), and leaving full screen puts it back above the content (`fullscreen-bar-restored`).

### Patch Changes

- @drizztdourden08/brock-core@0.62.0

## 0.61.0

### Patch Changes

- @drizztdourden08/brock-core@0.61.0

## 0.60.1

### Patch Changes

- c8bfd82: A screenshot no longer catches a widget that was just opened as a spinner or an empty body. A widget asked to open through `widgets.open`, `widgets.toggle`, `widgets.force` or `widgetKits.open`, `toggle` and `openWidget` now holds the capture from that call until its body mounts, and a kit's overlays hold until they mount, so the hold no longer starts only once the widget's lazy import does. A `LazyHost` fallback holds while it is drawn. The hold lets go by itself when the widget did not open, after 60 frames when its body never mounts (a tab behind another), and after 5 s at most. The renderer now reports 0 holds only after two frames with no new hold and once the page's images have loaded and faded in, and main captures only once the count has stayed at 0 for 50 ms, waiting again if a hold comes back. This applies to `--screenshot` and to the review's `review:capture`, `review:captureWidget` and `review:captureGroup`, whose `settle` also waits for images. Main now adds up the holds of every window instead of keeping the last window's count. An app that waited on `lazyLoads.idle` plus a fixed delay before its capture can drop that wait.
  - @drizztdourden08/brock-core@0.60.1

## 0.60.0

### Patch Changes

- @drizztdourden08/brock-core@0.60.0

## 0.59.0

### Patch Changes

- 4cdb713: Screenshots no longer catch a loading spinner. Each lazy load (a lazy screen, widget, title bar item or tour) now holds the screenshot from its start until it settles and a frame has painted, so `--screenshot` waits for it like any other hold. The review's own captures (`review:capture`, `review:captureWidget`, `review:captureGroup`) now wait for the same holds too, up to 10 s; a hold still open then fails a `capture-holds` check for that step and the capture goes ahead.
- Updated dependencies [ea30589]
  - @drizztdourden08/brock-core@0.59.0

## 0.58.0

### Patch Changes

- @drizztdourden08/brock-core@0.58.0

## 0.57.0

### Patch Changes

- Updated dependencies [2bf0884]
  - @drizztdourden08/brock-core@0.57.0

## 0.56.0

### Patch Changes

- @drizztdourden08/brock-core@0.56.0

## 0.55.0

### Patch Changes

- @drizztdourden08/brock-core@0.55.0

## 0.54.0

### Patch Changes

- @drizztdourden08/brock-core@0.54.0

## 0.53.0

### Minor Changes

- 60cb320: Five additions to the bug report. `bugReport.open({ title })` and `bugReport.setDefaultTitle(title)` prefill the title, cleared when the dialog closes. `section` in `BrockApp`'s `bugReport` is a component the dialog renders below the attachments; it gets `setExtras` and `disabled`, and what it sets joins the payload's `extras`. `transport` is now optional there, so an app with a main transport can still add a section. `identity` beside a transport (a string in `BrockApp`, `identity(ctx)` in `bootstrapApp`, reported as `BugReportTransportInfo.identity`) shows "Reporting as <identity>" in place of the contact field. A receipt's `links`, `{ label, url }[]`, each get a button in the receipt view, with the single `url` still shown as Open. A receipt's `retry` shows Retry upload in the receipt view, even for a toast transport; a main transport's `retry` stays in main and runs over the new `bugReport:retry` channel, the renderer getting a `retryId` in `BugReportReceiptWire`. The review checks the prefilled title.

### Patch Changes

- Updated dependencies [60cb320]
  - @drizztdourden08/brock-core@0.53.0

## 0.52.1

### Patch Changes

- @drizztdourden08/brock-core@0.52.1

## 0.52.0

### Patch Changes

- Updated dependencies [1477d7f]
  - @drizztdourden08/brock-core@0.52.0

## 0.51.1

### Patch Changes

- @drizztdourden08/brock-core@0.51.1

## 0.51.0

### Patch Changes

- @drizztdourden08/brock-core@0.51.0

## 0.50.0

### Patch Changes

- @drizztdourden08/brock-core@0.50.0

## 0.49.0

### Minor Changes

- 7f76f4f: New job options for `ctx.job` and `jobs.start`:

  - `visible: false` runs a quiet job. It reports progress like any other job and its snapshot carries `visible: false`, but it stays out of the title bar item and the job dialog. It clears itself 30 s after it ends, whether it succeeded, failed or was cancelled. Every `JobSnapshot` now has `visible`.
  - `forwardLog: true` also writes the job's log lines to the app log as `[job <id>] <message>`. A main job writes through `ctx.log`, a renderer job to the `app` channel. The app log keeps the lines after the job is gone.
  - `onDuplicate` sets what starting an id that is still running does. `'throw'` is the default and keeps today's "already running" error. `'queue'` starts the new job under the same id once the running one ends. `'parallel'` starts it under the first free `<id>-2`, `<id>-3` and so on. `'join'` returns a handle on the running job, whose `run` resolves with that job's result instead of running the work again.

  `JobHandle` gains `started` (resolves once the job runs) and `ended` (resolves with `done`, `failed` or `cancelled`), so a hand-written `JobHandle` fake needs both. `createJobRegistry(emit, now?, sink?)` takes a sink for the forwarded log lines. `useJob(id)` also returns `step`, the current step with its label, beside `job`, which is `null` when no such job is known. It follows main and renderer jobs alike, so a page can show a job's progress inline.

### Patch Changes

- Updated dependencies [7f76f4f]
- Updated dependencies [9ff1b40]
  - @drizztdourden08/brock-core@0.49.0

## 0.48.0

### Patch Changes

- @drizztdourden08/brock-core@0.48.0

## 0.47.0

### Patch Changes

- Updated dependencies [6ead199]
  - @drizztdourden08/brock-core@0.47.0

## 0.46.0

### Patch Changes

- 3df3667: A dev boot no longer clears Chromium's HTTP cache every time, which threw away the pre-bundled dependency chunks. Main keeps the cache while the renderer's dep optimizer hash (in the `_metadata.json` the dev server names in `BROCK_DEV_DEPS_METADATA`) is the one of the last dev boot, and clears it once when the hash changes. `BROCK_DEV_CLEAR_CACHE=1` clears it on every dev boot, as before. Edits still show at once: Vite serves source modules and `public/` files with `no-cache`.
- b1026b9: Asset jobs run in a renderer Web Worker too, with no main process. `runAssetWebWorkerJob(options)` from `@drizztdourden08/brock-port-kit/renderer` takes the options of `runAssetWorkerJob` with the worker constructor of a `?worker` import, and the Web Worker serves the steps with `serveAssetSteps` from the new `@drizztdourden08/brock-port-kit/web-worker` entry. One `AssetWorkerSteps` object serves both sides: each step now gets the job's `workerData` as a third argument (the thread's `workerData` in Node, posted once to a Web Worker). The job is a renderer job: `jobs.start(id, steps, options?)` from brock-react returns the same `JobHandle` as `ctx.job`, its snapshots go into the job store, so the job dialog and the title bar show it on every host, and `jobs.cancel` and `jobs.dismiss` reach it. The job registry moved to brock-core (`createJobRegistry` and the `JobHandle`, `StartJob`, `JobRegistry` types from `@drizztdourden08/brock-core/jobs`); brock-electron re-exports the types as before.
- 3df3667: A file dropped outside a drop target no longer replaces the app with that file. The app window and every widget window cancel a navigation that leaves the page: a reload, the same origin (the dev server) and a hash or query change of the same page stay, a link with a protocol of `security.externalProtocols` opens in the system browser through `openExternal`, and anything else is dropped. `setWindowOpenHandler` still denies every new window and hands its link to `openExternal`.
- Updated dependencies [b1026b9]
- Updated dependencies [025bcf7]
- Updated dependencies [b1026b9]
- Updated dependencies [c68c54a]
  - @drizztdourden08/brock-core@0.46.0

## 0.45.1

### Patch Changes

- 4ec937c: The `--screenshot` watchdog now waits at least as long as the boot watchdog: 120 s on a dev launch (or `product.boot.devWatchdogMs`), where a cold start took longer than 20 s and left a black picture, and still 20 s in production unless the production boot watchdog is longer. `screenshotTimeoutMs` of `bootstrapApp` and `--screenshot-timeout` still override it.
  - @drizztdourden08/brock-core@0.45.1

## 0.45.0

### Minor Changes

- aba2001: Packaging takes more from the product. The Windows exe gets its version info stamped beside the icon: company from `product.author`, product name and file description from `product.name`, `LegalCopyright` from the new `product.copyright` (else the year and the author), comments from `product.description`, and the app version. `product.linuxCategory` (a main freedesktop category such as `Game`) sets the deb's and the AppImage desktop entry's category, and the AppImage entry gets the description as its comment. A file association takes a `description`: the Linux mime comment, the Windows ProgId tooltip and electron-builder's association description.
- 4caea84: The `--screenshot` watchdog is configurable and fails loudly: `--screenshot-timeout=<seconds>` or `bootstrapApp({ screenshotTimeoutMs })` sets how long it waits (20 s by default), and when it fires it still captures, logs whether the window never revealed or how many screenshot holds were open, and exits 2 instead of 0.

### Patch Changes

- Updated dependencies [ef96908]
- Updated dependencies [a85efb2]
- Updated dependencies [aba2001]
- Updated dependencies [fb41dd1]
  - @drizztdourden08/brock-core@0.45.0

## 0.44.0

### Minor Changes

- 716553d: The boot watchdog is configurable: `product.boot.devWatchdogMs` (default 120000) and `product.boot.watchdogMs` (default 8000) in `brock.config.ts`, and the `BROCK_BOOT_WATCHDOG_MS` environment variable, which overrides whichever applies.

### Patch Changes

- 716553d: A dev launch no longer gets stuck on the splash. The splash plugin loaded brock-core through `vite.runnerImport` on every `index.html` and `splash.html` request, which took over 20 s inside a busy dev server; it now works the look out once per dev server, starting when the server starts, and again only when `brock.config.ts` or a file it reads changes. When the renderer answers after the boot watchdog fired (a heartbeat, progress, or a late `boot:ready`), main clears the watchdog's failure, the splash goes back to the progress and the app is revealed as usual; the app window's `did-finish-load` now counts as a sign of life too. The development watchdog waits 120 s instead of 30 s.
- Updated dependencies [716553d]
  - @drizztdourden08/brock-core@0.44.0

## 0.43.0

### Patch Changes

- @drizztdourden08/brock-core@0.43.0

## 0.42.0

### Patch Changes

- @drizztdourden08/brock-core@0.42.0

## 0.41.0

### Minor Changes

- 8300ee8: Brock moves to Tessera ^0.33.0 (the catalog and the `brock-react` peer range, MIGRATION 224; RENAMES.json has no entry for 0.33.0, so an app changes nothing) and uses what it added for Brock. A settings choice's `disabled` (`true`, or a string that says why) now goes to Tessera's own `disabled` on the option, so a choice, select, radio or multi-choice with an option off draws its usual control with that option greyed, not pickable and skipped by the keys, and the reason as a pointer tooltip and an `aria-description`. Brock's `SettingChoiceField` stand-in is gone, and a radio with an option off stays a radio instead of turning into a select. On a host with the title bar and no window chrome, such as the Capacitor host, the title bar gets `controls={false}` and draws no window control at all, close included. A widget popped into its own window now shows the disabled state a docked one shows: the `widgetDisabled` hook's answer, through the dock's resolver, goes to Tessera's `Widget` as `disabled` (the message as the reason) with `onOpenSettings`, which asks main to bring the app window forward and open the setting there (`widget:openSetting`, `openWidgetSetting`; `widget:settingTarget`, `onWidgetSettingTarget`).

### Patch Changes

- Updated dependencies [8300ee8]
  - @drizztdourden08/brock-core@0.41.0

## 0.40.0

### Minor Changes

- A bug report transport can keep the dialog open after a report went out. `afterSend: 'view'` beside `contact` and `attachments` (in `BrockApp`'s `bugReport` or in `bootstrapApp`'s) shows the receipt in the dialog in place of the form: the message, the report id, Open when the receipt has a `url`, and Close. The default, `'toast'`, closes the dialog and raises the toast as before; the GitHub issue and the clipboard always toast.
- ae74556: `@drizztdourden08/brock-electron/node` exports the data paths (`initPaths`, `getUserDataPath`, `getLegacyPath`, `ensureDataDirectories`, `resolveDataPath`), the JSON helpers (`readJsonFile`, `writeJsonFile`) and `createNodeFileStore` with no Electron import, so a test of main-side code runs under plain Node without mocking Electron.
- ae74556: Three main-side hooks for app data and sound. `bootstrapApp({ fileGuard })` is asked before each write of the base `file:*` handlers (`writeBytes`, `writeText`, `remove`, `mkdir`, `trash`) with `{ kind, path }`, and refuses the write when it answers `false` or a reason. `FileStore.trash(path)` now reaches the renderer too (`file:trash`, the Electron `files` port). `createNodeFileStore({ trashItem })` takes the function that moves a full path to the trash, so the store imports no Electron; `ctx.files` passes Electron's `shell.trashItem`, and a store made without `trashItem` has no `trash`. `window:setAudioMuted` and `window:isAudioMuted` mute the app window and read it back, also as the window port's optional `setAudioMuted` and `isAudioMuted`.
- fb285af: `--screenshot` waits until the app is ready to be pictured, and pictures the current frame. The renderer takes a hold with `holdScreenshot()` (or `useScreenshotHold(holding)`) while something it draws is not ready, such as a game view before its first frame; main waits for the reveal and then for every hold to be released, within the same 20 s watchdog. The capture now comes from the window's surface through the debugger (`Page.captureScreenshot`), since `capturePage` returned a stale frame for the headless window placed off every monitor; it falls back to `capturePage` when the debugger is taken.
- ae74556: `ui-views.json` is written by key. Brock read the file once and wrote its whole copy back on every change, so a key the app wrote to the same file in the meantime was lost. The renderer now sends only the keys it changed over the new `uiViews:patch` channel (`patchUiViews`), and main merges them into the file on disk, one write after another. An app keeps view state of its own there with `uiViews.read(key, fallback)`, `uiViews.write(key, value)` and `uiViews.remove(key)` from brock-react; the `profile:` keys stay Brock's.

### Patch Changes

- Updated dependencies
- Updated dependencies [9b081a6]
- Updated dependencies [ae74556]
- Updated dependencies [fb285af]
- Updated dependencies [ae74556]
  - @drizztdourden08/brock-core@0.40.0

## 0.39.0

### Minor Changes

- 6d7da6d: The bug report takes a contact email and attachments. A renderer or main transport opts in with `contact: true` and `attachments: true | { maxFiles?, maxBytes? }`; the dialog then shows a Contact email field and a drop zone for files, capped at 5 files and 10 MB in all by default. The payload carries `contact` and `attachments` (`{ name, type, size, data }`), never into a public GitHub issue, and `writeDebugZip` stores each attachment under `attachments/` with only its name, type and size in `report.json`.
- 6d7da6d: The bug report falls back to a GitHub issue when the main transport cannot send. A main transport can declare `available(ctx)`; while it answers false, the dialog targets the prefilled issue on `product.repo` (else the clipboard) from the start. When a transport fails on send and the product has a `repo`, the error offers Open a GitHub issue instead, which opens the issue with the same title, text and diagnostics.
- bdfc457: `FileStore` has an optional `trash(path)`. The Node store behind `ctx.files` moves the path to the system trash (`shell.trashItem`) and skips one that is not there. A catalog uninstall or update hands its installer a store whose `remove` goes to the trash when the store has one, falling back to deleting when the trash refuses; `removeTo: 'delete'` in the catalog config deletes as before.
- bdfc457: `JobHandle.setCancellable(on)` turns cancel off (or back on) while a job runs; the snapshot's `cancellable` follows, so the job dialog hides Cancel and `jobs.cancel` is ignored. A catalog install and a tool install turn it off once the download is in, before the checks and the unpack, and `installBarProps` leaves out `onCancel` then, so `CatalogInstallBar` shows no Cancel past the download.

### Patch Changes

- Updated dependencies [472754d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [bdfc457]
  - @drizztdourden08/brock-core@0.39.0

## 0.38.0

### Patch Changes

- @drizztdourden08/brock-core@0.38.0

## 0.37.0

### Patch Changes

- @drizztdourden08/brock-core@0.37.0

## 0.36.0

### Minor Changes

- aa74a6d: The bug report hands its payload to an app transport. Brock keeps the dialog and builds `BugReportPayload` (title, description, app id, name and version, and when attached the debug text, the host facts and the last 200 redacted log lines). An app passes `transport(payload) => Promise<Result<BugReportReceipt>>` as `<BrockApp bugReport={{ transport, label? }} />`, or in main as `bootstrapApp(product, { bugReport: { transport(payload, ctx), label? } })` over the new `bugReport:transport` and `bugReport:send` channels; with neither, the GitHub issue on `product.repo` stays the default and the clipboard the last resort. The send button carries the transport's label and spins while it runs; a receipt's message and link show in the toast, and a failure keeps the dialog open with the error so the user can try again. `writeDebugZip` and `collectDebugFiles` in brock-electron give a main transport the debug zip: the payload, the logs of `Data/debug` and the app's own entries. `useDebugText` also returns `system`.
- 6f6977d: OS integration in the product config. `product.protocols` declares deep link schemes (`my-app://install/abc`), `product.fileAssociations` gains a default mime type and a shipped Windows icon, and a `product.schemes` entry with `dir` is served from `Data/<dir>` through `protocol.handle` (`app-media://` over `Data/media`). `defineProduct` checks all three lists.

  The installer registers them: on Windows the updater's Velopack hooks write and remove the `HKCU\Software\Classes` keys, and the installer stub runs `--os-integration=register` after a portable install; on macOS electron-builder writes Info.plist; on Linux the deb's `.desktop` file and mime XML come from electron-builder, the managed post-install refreshes both databases, and an AppImage writes its own entry under `~/.local/share`.

  The running app receives each link or file from argv at launch, from a second launch through the single-instance lock (taken when the product declares a protocol or a file type, never for a named instance or an automation launch; `bootstrapApp({ singleInstance })` overrides it) and from macOS `open-url` and `open-file`. After the reveal, main hands each `OpenRequest` to `ctx.onOpen` and `bootstrapApp({ onOpen })`, and the renderer gets it through `useAppOpen` or `appOpen.on` (`app:takeOpens`, then `app:open`).

- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

- 524dcf3: New module `@drizztdourden08/brock-tools` (`brock add tools`): external binaries an app declares, such as ffmpeg and ffprobe. `getTools(ctx).register({ id, label, binaries, version?, downloads?, resolveDownload?, usePath?, installHint? })` adds a tool; `state` finds it in `Data/tools/<id>/<version>` or on `PATH`, `install` runs the `tool:<id>` job (download through `net.fetch`, size and SHA-256 check, unpack from zip, tar or a bare file, one rename into the cache), and `run` spawns a binary with an argument array, a timeout and a line callback. The renderer gets `window.api.tools` and `useTool(id)`. brock-electron exposes its zip reader and writer as `@drizztdourden08/brock-electron/zip`, and `brock add` knows the `tools` id.

### Patch Changes

- Updated dependencies [273846f]
- Updated dependencies [aa74a6d]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
  - @drizztdourden08/brock-core@0.36.0

## 0.35.0

### Patch Changes

- @drizztdourden08/brock-core@0.35.0

## 0.34.0

### Minor Changes

- 08e0cd1: Show any folder or file of the machine, not only a data domain. `openFolder(path)` opens a folder in the file manager (a file is refused, since opening one would run it), and `revealPath(path)` shows a file or folder selected in its parent folder. Both resolve a `Result` and refuse a relative or missing path. Main code imports them from `@drizztdourden08/brock-electron/main`; the renderer calls `usePlatform().filePicker.openFolder` and `revealPath` (Electron only), over the new `shell:openFolder` and `shell:revealPath` channels. A settings `path` control now gives Tessera's `PathInput` a Reveal action on Electron.

### Patch Changes

- 08e0cd1: Two writes of the same data domain file at once no longer fail with ENOENT on the rename. Each write goes through a temp file of its own (`<file>.<uuid>.tmp`, removed when the write fails), and writes to one file run one at a time in call order, so the last call wins.
- Updated dependencies [08e0cd1]
  - @drizztdourden08/brock-core@0.34.0

## 0.33.0

### Patch Changes

- @drizztdourden08/brock-core@0.33.0

## 0.32.1

### Patch Changes

- @drizztdourden08/brock-core@0.32.1

## 0.32.0

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0

## 0.31.0

### Patch Changes

- @drizztdourden08/brock-core@0.31.0

## 0.30.0

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0

## 0.29.1

### Patch Changes

- @drizztdourden08/brock-core@0.29.1

## 0.29.0

### Patch Changes

- @drizztdourden08/brock-core@0.29.0

## 0.28.1

### Patch Changes

- 8c8d415: A tour click step whose click target is in a widget popped into its own window goes on when the user clicks it there. Before, the click never reached the main window's tour and the step fell back to Next. The step keeps Next hidden and its hint line; the main window relays the click target to the widget window (the `tour-click` slice), which sends the click back over IPC (`advanceWidgetTour`, `onWidgetTourAdvance`), and the tour moves on only if that step is still shown. The listener goes when the step changes, the tour closes or the widget docks back. The review clicks the popped widget in its own window (`reviewWidgetProbe({ kind: 'click', id, selector })`, a real mouse click) and checks the tour moves on.
- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-core@0.28.1

## 0.28.0

### Patch Changes

- c426f9a: A tour step whose lit part is a widget popped into its own window lights it there: the main window relays the step's spot to the widget window, which draws Tessera's `TourSpot` over the widget, while the bubble stays in the main window. Before, the bubble sat in the middle and nothing was lit. The review lights a popped widget from a tour step and checks the widget window draws the spot and drops it when the tour closes (`reviewWidgetProbe({ kind: 'tourSpot', id })`).
- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-core@0.28.0

## 0.27.0

### Patch Changes

- @drizztdourden08/brock-core@0.27.0

## 0.26.0

### Patch Changes

- @drizztdourden08/brock-core@0.26.0

## 0.25.0

### Patch Changes

- @drizztdourden08/brock-core@0.25.0

## 0.24.1

### Patch Changes

- 0dd8c3c: Two tests no longer depend on how busy the machine is:

  - The data export zip64 test no longer writes a real zip of 65,540 files. The zip writer and its end record take the zip64 limits (`{ count, bytes }`, 65535 entries and 4 GB by default), so the test sets a limit of 4 entries, writes 3 and then 5 small files, and checks that only the second zip carries the zip64 end record and its locator, that the classic end record holds the 0xFFFF marker, and that the reader follows the locator back to all 5 entries. A separate check covers the default switch at 65535 entries on the end record alone. The written zips are unchanged.
  - The screen state restart test imports the persistence modules once at the top of the file. Its first restart used to load and transform Tessera's whole composites entry (through the widget layout store) inside the timed test, which took 20 to 30 s on a quiet machine and could pass the 60 s limit on a busy one. The first import is now part of collecting the file, which has no time limit, and each restart only runs the modules again, in under a second.
  - @drizztdourden08/brock-core@0.24.1

## 0.24.0

### Patch Changes

- @drizztdourden08/brock-core@0.24.0

## 0.23.0

### Patch Changes

- Updated dependencies [e769096]
  - @drizztdourden08/brock-core@0.23.0

## 0.22.0

### Patch Changes

- 73a287e: Importing a data area asks Merge (the default) or Replace in its confirm dialog (`confirmChoice`, a confirm dialog with a radio group). Merge keeps what is there and keeps the newer file when both have the same path; `storage:applyImport` takes the mode, the result counts the kept files (`kept`), and imported files keep the modified time they were exported with.
- 73a287e: Zip exports write zip64 records past 65535 files or 4 GB, and the reader follows them, so a zip export has no practical limit.
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-core@0.22.0

## 0.21.1

### Patch Changes

- 0e425f6: Snapping no longer stays off after a Ctrl move or resize. Main only knew Ctrl from the key and mouse events of Brock windows, so a Ctrl release it never received kept it believing Ctrl was held: on Windows the move and resize loop takes the keyboard, so letting go of Ctrl during a drag never reached the window, and a release while another app had the focus, or with the cursor only over title strips and borders, was lost too. Every later drag then moved one window alone and every resize ran without snapping or shared edges, for every window, until some unrelated event said otherwise. Main now forgets Ctrl when a move or a resize ends (on macOS, where `moved` comes on every step, only when a resize ends) and when no Brock window has the focus any more, so the next plain drag moves the cluster and snaps again, and a window moved alone with Ctrl rejoins on its next plain drag. Ctrl held through the next drag is read again from that window's key repeat or mouse events.
- 0e425f6: Widget windows restored at launch no longer appear before the app window. They are created hidden and held until the app window is revealed after boot; the reveal waits for them to be ready to show (at most 1.5 s each), then shows the app window and every held widget window in the same tick, each at opacity 0, and fades them in together with the same 220 ms ramp. Widget windows still show without taking the focus, synced ones stay owned by the app window, and on an automation launch (`--no-focus`) they stay off screen. A widget window that becomes ready during the fade fades in too; one opened after the launch shows at once, as before. Boot holds added while the reveal waits for others are now waited for as well.
  - @drizztdourden08/brock-core@0.21.1

## 0.21.0

### Patch Changes

- @drizztdourden08/brock-core@0.21.0

## 0.20.0

### Patch Changes

- @drizztdourden08/brock-core@0.20.0

## 0.19.0

### Minor Changes

- df9c1df: Brock moves to Tessera 0.17.0: the workspace catalog and brock-react's peer range are `^0.17.0`. Small text is 12 px, and Field labels and DataTable headers are no longer forced to capitals (Archipelia review T-03). Two new settings control kinds: `path` (`pick`, `accept`, `placeholder`) draws Tessera's `PathField` on a string setting, with typing, a drop from the desktop and Browse, and `json` (`shape`) draws `JsonInput`, which saves the value only while the text parses. They come with new optional platform ports, `filePicker.pickPath`, `filePicker.pathOf` and `storage.revealLogs`, which the Electron host fills through the new `dialog:pickPath` and `debug:revealLogs` channels and the preload's `getFilePath`. `brock upgrade` writes `StatusOf` as `Status` from Tessera's `RENAMES.json`, and the `tessera-part-moves` migration moves `CopyButton`, `CopyValue` and their types from `/primitives` to `/composites`, and `ErrorBoundary` from `/composites` to `/primitives`.

### Patch Changes

- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-core@0.19.0

## 0.18.0

### Patch Changes

- @drizztdourden08/brock-core@0.18.0

## 0.17.1

### Patch Changes

- @drizztdourden08/brock-core@0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: Main has a place for app services: `bootstrapApp(product, { services: (ctx) => createAppServices(ctx) })` builds them once, at the start of the modules boot task (after the paths, before the handlers), exposes them as `ctx.services`, typed through the new `AppServices` augmentation, and calls their `dispose()` on will-quit. Reading `ctx.services` before the build, or without the option, throws and says which. The `app-services` migration turns a WeakMap memo keyed by `MainContext` into a to-do.
- 3a35c8e: An IPC channel is declared once: `defineChannels({ engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'), onProgress: event<(p: number) => void>()('ap:engine:progress') })` from brock-core gives the preload maps (`maps.invoke`, `maps.send`, `maps.events`), the augmentation types (`InvokeContractOf`, `SendContractOf`, `EventContractOf`) and typed entries: main's `handle`, `on` and `emit` take an entry in place of the channel name, and brock-react's `channelApi(APP_CHANNELS)` types the renderer calls by method name. Channels written in the augmentation, a map and a handler keep working. The new app declares its channels this way, knip treats `src/ipc/contract.type.ts` as an entry, and the `channel-declarations` migration lists, as one to-do, every channel an app could move. docs/ipc.md shows both styles.
- e70afc3: Long jobs: `ctx.job(id, steps)` in main reports steps, weighted progress, the current line and log lines to the renderer and stops on cancel through its `signal`. `JobDialog` draws a job with Tessera's Stepper, ProgressBar and LogPanel, `useJob(id)` and `jobs.open(id)` drive it, and Hide moves a running job to a status tag in the title bar that reopens it.
- e70afc3: `openExternal(url)` from `@drizztdourden08/brock-electron/main` opens a link through the same protocol allow list as the renderer (`security.externalProtocols`), so app main code no longer calls Electron's `shell.openExternal` directly. A refused link is logged and resolves false.
- e70afc3: File storage per data domain: `ctx.storage.domain(id)` in main and `dataDomain(id)` in the renderer read and write JSON, text and bytes, list, remove and size files, with every path kept inside the domain folder. A built-in `StoragePage`, added to a bucket as a page file, shows each domain's size with Open folder, Clear and "older than N days" clean rules (both confirmed), and exports chosen domains to a zip or a folder and imports them back. New template apps declare two domains and carry the page.

### Patch Changes

- e70afc3: `storage:getSummary` no longer stats every file one after another: it lists each domain folder in one pass and stats 32 files at a time, the domains side by side. `storage:getDomainUsage` measures one domain, so a page can show each as it arrives.
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
  - @drizztdourden08/brock-core@0.17.0

## 0.16.0

### Patch Changes

- 55befe4: The review watchdog starts in main at launch. When no tour progress (a capture or a check) arrives within 60 s, for example because the renderer failed to load, main writes a partial report with a failed `tour-started` check and exits 1, instead of waiting for minutes. Main also exits 5 s after the report when something holds the quit. brock-core exports `GLOBAL_STEP` from its review entry.
- 55befe4: Every `--review` run captures the splash mid-boot as step 00 (`00-splash.png`, or `00-splash-failed.png` when the boot stops first) and adds a `splash-captured` check, without `--screenshot-splash`. The reveal waits for the capture, at most 5 s. `--screenshot-splash` works as before.
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
  - @drizztdourden08/brock-core@0.16.0

## 0.15.0

### Minor Changes

- 96f7759: The Performance widget is drawn with Tessera's chart parts.

  - A row of `StatTile`s for frame rate, CPU, memory and event loop lag, each with its change since the last sample and a `Sparkline` of the last 60 samples; `Gauge`s for the app's CPU, its share of system memory and the JS heap, sized to fit; a `StackedBar` of memory by process (main, renderer, GPU, utility, widget windows); an Activity list of long tasks, errors and warnings; and every reading in a collapsed Details section.
  - A container query puts two tiles a row when docked and four a row, with the gauges beside memory and activity, from 560 px. The widget no longer wraps itself in a `ScrollArea`; the widget body scrolls.
  - The refresh and sections options, Copy snapshot and sampling only while shown stay as they were.
  - `ProcessDiagnostics` adds `memoryTotalBytes`, and each `ProcessMetric` adds `window`, the Brock window a renderer process draws (`main` or a widget id).
  - The review checks that the tiles, sparklines, gauges and memory bar render and move, that the panel adds no scroll box of its own, and captures the widget docked and popped out narrow and wide.

- 96f7759: Brock takes Tessera 0.15.0 (peer range `^0.15.0`).

  - Floating widgets resize from every edge and corner; `WidgetHost` passes `floatingMin` of 240 by 160, the least size of a widget window, so a floating widget and a popped one stop at the same size.
  - The window guide sits beside the cursor in the window being moved or resized: main reads `screen.getCursorScreenPoint()` on every `will-move` and `will-resize`, turns it into that window's client pixels and sends it as `pointer` with the `widget:guide` state (`WindowGuideState.pointer`), and `WindowGuide` passes it to `WindowGuideOverlay`.
  - `BrockApp.css` imports the brand palettes without `layer(ds.palette)`, since Tessera now puts them in that layer itself; an app's unlayered `theme.css` still wins.
  - The search mascot clips are typed `MascotClip`. The widget options panel closes on its own and the widget body scrolls with a gutter, with no Brock code; Brock passes no window group prop.
  - The review drags a floating widget's corner with real mouse events (`review:widgetProbe` takes `mouse`), checks the new size and the 240 by 160 floor, and checks the guide card beside the pointer the probe passes (`guide` takes `pointer`; the facts add `guideBeside`).

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0

## 0.14.0

### Minor Changes

- add0686: Snapped edges are locked together, and clusters come from geometry.

  - A snap cluster is every window that touches the dragged one, directly or through others, main included: flush edges within 1 DIP that overlap, or a shared corner. It is taken from the window bounds when a move or resize starts, joined with the saved links, so a window touching two others, or snapped corner to corner, moves with the cluster. Dragging main or any widget moves the whole cluster; Ctrl, held at the start or pressed during the drag, moves the dragged window alone and takes it out.
  - Resizing moves every edge on the dragged line: the facing edges across the seam as before, and now the edges on the same side that line up within 1 DIP and meet a window already on the line, such as the left edges of two stacked widgets or a widget's bottom lined up with main's bottom. One window at its minimum size stops the whole line. Ctrl resizes the dragged window alone without snapping, which takes its edge off the line. Main with an aspect lock never follows a widget.
  - Snapping during a resize still ignores lines that move with the drag, but keeps the other edge of a window that follows on one side.
  - The window guide hints say touching windows move together, lined-up or touching edges move with the dragged edge, and an aspect-locked app keeps its shape.
  - The review's outer-edge, shared-edge, Ctrl and flush-bottom checks expect the locked edges.

### Patch Changes

- @drizztdourden08/brock-core@0.14.0

## 0.13.0

### Minor Changes

- 33dc33c: Snap clusters replace manual window groups.

  - Every window joined by snap links, directly or through other windows, the main window included, is one cluster, computed from the live links. Dragging any window of a cluster moves the whole cluster rigidly; only the dragged window snaps, to windows outside the cluster, and what it is dropped against joins the cluster. Holding Ctrl while moving drags one window alone: it leaves the cluster, its links break (a window linked to it relinks to another window it is still flush with) and it can snap elsewhere. A window with no link moves alone as before.
  - Maximize, full screen with the black backdrop, minimize and restore act on the cluster, with the same fit and pack maths and the same restore. Closing a widget closes that widget alone. Resizing keeps the session rules and never moves a cluster.
  - Manual groups are gone: the `group` field of the popped layout, `WidgetWindowState` and the probe facts, `WidgetWindowGroup`, `widget:setGroup`, `widget:setMainGroup`, `widget:getMainGroup` and `widget:mainGroup`, the "Window group" wiring of `WidgetOptions` and `WindowTitleBar` (Brock no longer passes those props), and `config/window-group.json`, which main deletes at start. A `group` left in a saved popped entry is dropped when the layout loads, and the `drop-window-groups` upgrade step cleans the dev data under `.user-data`. `WidgetWindowSummary.group` becomes `cluster`, the number of windows in the cluster, and the probe's `group` request becomes `cluster`.
  - The window guide shows in the window being moved or resized, a widget window or the main window, instead of always in main: `widget:guide` goes to that window only. Its hints follow the new rules: snapped windows move together, Ctrl moves one window alone, flush windows resize together, Ctrl resizes one window alone without snapping.
  - A resize now moves every window on the dragged line: two widgets stacked against main's left edge both follow main's edge, and either widget's right edge moves main's edge and the other widget's; a window stacked end to end on the far side of the line follows too.
  - The review checks a cluster moving together and with main, a Ctrl move detaching, cluster maximize, restore and full screen, the guide drawn in the moved window and in main, and the stacked seam.

### Patch Changes

- Updated dependencies [33dc33c]
  - @drizztdourden08/brock-core@0.13.0

## 0.12.0

### Minor Changes

- f751683: Brock moves to Tessera 0.12.0 (brock-react's peer is `^0.12.0`). A widget window now draws Tessera's own pin menu in its title bar and Tessera's Pin row in its options panel, in place of Brock's `WidgetPinMenu` and the Stacking row; the pin stays off or on top, sync stays a separate option, and a saved `with-app` pin still opens as off with sync on. The `widget:popped` event carries the new `PoppedWidgetPatch`, whose pin is never `with-app`. The review reads the page header through the `content-header` classes.

### Patch Changes

- f2b86ff: Always on top holds on Windows: a pinned widget window, synced or not, and the pinned app window now ask for the `pop-up-menu` level there. Electron put the default `floating` level behind the taskbar, which could drop the window out of the topmost band at once or on a later focus.
- Updated dependencies [f751683]
  - @drizztdourden08/brock-core@0.12.0

## 0.11.0

### Minor Changes

- 48ca303: A built-in Performance widget every app gets, closed by default and listed in the Widgets menu: the renderer (frame rate and frame time, long tasks, event loop lag, JS heap, DOM nodes), every process from main (CPU and memory per process, main process memory, uptime, windows and widget windows with their sync and group, IPC calls per second, runtime versions, GPU compositing) and the app state (version, screen and route, profile, open widgets, modules, errors and warnings since start). Its options set the refresh and the sections shown, sampling stops while it is off screen, and Copy snapshot puts the numbers on the clipboard for a bug report. The new `diagnostics:getProcesses` channel (`getProcessDiagnostics`) feeds it, and the review opens it and checks the numbers move.

### Patch Changes

- Updated dependencies [48ca303]
  - @drizztdourden08/brock-core@0.11.0

## 0.10.0

### Patch Changes

- @drizztdourden08/brock-core@0.10.0

## 0.9.0

### Minor Changes

- 28540bb: Widget windows: a direct pin choice, and resizing snapped windows moves only the dragged edge.

  - The pin is now `off` or `top`. The old `with-app` pin did what "Sync with main window" does, so the two are merged: a synced window also mirrors the app's always-on-top. `WidgetPinMode` drops `with-app`; the new `StoredPinMode` keeps it for saved popped entries, and a saved `with-app` pin opens as `off` with `sync` on and is written back to the layout.
  - The widget window bar shows Brock's `WidgetPinMenu` in place of Tessera's cycling pin button: a pin-off icon for a normal window, a highlighted pin and an "On top" label while pinned, and a menu listing both states with a hint and a check on the current one. The options panel has a "Stacking" row with the same two choices.
  - Resizing a widget window moves only the dragged edge, with edge snapping. The windows exactly flush against that edge have their facing edge moved with it, and nothing else changes size. Before, a neighbour whose own edge only lined up with the dragged one (the tops of two windows side by side) was stretched with it. Ctrl still resizes the window alone.
  - The main window's aspect lock applies to the main window alone. It used to be hooked onto every window created, widget windows included. The widget resize pipeline (`planResize`) now keeps the main window in proportion and never lets a widget's shared edge bend it.
  - The review's widget-windows step checks both pin states and captures the bar while pinned. It also resizes a snapped window from its outer edge and from the shared edge, and asserts the neighbour keeps its size apart from that edge.

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0

## 0.8.1

### Patch Changes

- @drizztdourden08/brock-core@0.8.1

## 0.8.0

### Minor Changes

- dcdde4a: Widget windows sync with the main window, snap into a grid and act in groups. A popped window is now synced by default: on Windows the app window owns it, so it no longer falls behind other apps when the focus goes elsewhere, and it shows, hides, minimizes, restores and raises with the app. A per-widget "Sync with main window" switch makes it independent with its own taskbar entry. Moving snaps corners and edges, resizing snaps the moving edge to the neighbours' edges, and an edge shared by snapped windows resizes them all together; Ctrl skips snapping and resizes one window. The app and each widget can join a window group (1 to 4) whose members maximize, go full screen over a black backdrop with square corners, minimize, restore and close together. The app window shows a guide with the shortcuts while a widget window moves or resizes. Brock draws interim controls (`WindowGroupControls`, a "Window group" title bar action, `WindowGuideOverlay`) until Tessera ships its own. The `widget:*` contract gains `setSync`, `setGroup`, `setMainGroup`, `getMainGroup`, `mainGroup`, `guide` and `square`, and the window state carries `sync`, `group` and `square`.

### Patch Changes

- b7c919a: A window group maximized or put in full screen on a small display now stays inside the work area. When a window's minimum size stops the proportional scale, the group's shared edges are repacked so every member fits, keeps its order and stays flush with its neighbours. Restore still returns each window's exact bounds.
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-core@0.8.0

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-core@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-core@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-core@0.6.0

## 0.5.0

### Minor Changes

- 241d164: Widget windows work end to end. A linked window is towed by the edge it sits on, so resizing the app from any side keeps it flush, and maximize or fullscreen hides the windows linked to the app until it is back to normal. Towed moves report their bounds, pending reports are flushed when the app closes or quits, and links survive a restart. The app snaps to widget windows with the same 14 px rule and links the one it lands against. A window lost after a display change comes back into a work area; a plain drag is left to the OS and no snap fights a move across displays of another scale. The `devOnly`, context-only and `show` gates close and reopen popped widgets, which keep their place. A drag-out opens the window at the release point: `onPopOut(id, point?: ScreenPoint)` is accepted ahead of Tessera 0.7.0, with the cursor as the fallback. Drop-in turns the window translucent over the app, ignores a drop where another widget window covers the app, and no longer loses a release between two renders; dock-backs carry a sequence number, Alt+F4 closes the widget, widget windows stay off the taskbar unless a definition sets `taskbar: true`, and followers come back without taking the focus. Widget windows get the active profile and the settings, with changes sent back to the app, and the log arrives as increments. The review drives all of it in a new `widget-windows` step.

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0

## 0.4.0

### Patch Changes

- @drizztdourden08/brock-core@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-core@0.3.0

## 0.2.0

### Patch Changes

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies [f818087]
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 38edbcc: The review's watchdog now fires after 30 s with no progress instead of 60 s in total, so a longer tour in a bigger app still finishes.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 23907ce: The updater module checks the product's GitHub releases, installs a picked version through Velopack and shows the UpdateDialog, and a main module can run code first in the boot with `onBoot`.
- Updated dependencies [0a52cd7]
- Updated dependencies [ade72f8]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
  - @drizztdourden08/brock-core@0.1.1

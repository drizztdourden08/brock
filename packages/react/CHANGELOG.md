# @drizztdourden08/brock-react

## 0.107.1

### Patch Changes

- 2607f3d: Brock builds on Tessera 0.78. Its own page, info card, hub and release notes scrollers ask Tessera's ScrollArea for a stable scrollbar gutter instead of a CSS rule, so a page that reflows with width no longer flips as the scrollbar comes and goes. Apps must update Tessera to 0.78 or later; nothing else changes.
  - @drizztdourden08/brock-core@0.107.1

## 0.107.0

### Minor Changes

- a3772b0: Take the tour now sits at the top level of the app menu, just above Credits and About, in every app that has tours. It no longer hides under Advanced, or under Help when the app has a Help group, so new users and a first-run tour can find it at once. An app with several tours still lists them in a submenu of that entry.

  To upgrade, check your tour steps. A step that uses `menuEntry: ['Advanced', 'Take the tour']` no longer finds the entry. Use the plain `menuEntry: 'Take the tour'` instead.

### Patch Changes

- Updated dependencies [77e2dfe]
  - @drizztdourden08/brock-core@0.107.0

## 0.106.2

### Patch Changes

- e4effa7: Brock's own screen scrollers keep a stable scrollbar gutter. The page body, the info card, a hub with no nav, a plain hub page and the release notes panel now reserve the scrollbar width all the time, so content no longer reflows (and a lobby no longer flips between one and two columns) when the scrollbar comes and goes.
  - @drizztdourden08/brock-core@0.106.2

## 0.106.1

### Patch Changes

- @drizztdourden08/brock-core@0.106.1

## 0.106.0

### Minor Changes

- 5ea3165: Four small additions for Bxel. A context menu entry takes `tone: 'danger'` and passes it to the drawn item. `SettingsPreviewLayout` and its props type are exported from the barrel, so a page outside settings can use the two column preview layout. The preview column is now a `complementary` landmark named by a `label` prop (default "Preview", `previewLabel` on `SettingsLayout`, `TabDef` and `meta`), and the rows column a `region` named "Settings"; both are F6 stops. `listContextMenus()` now lists every registered menu, mounted or not, with a `mounted` flag on each, and the new `defineContextMenu(id, source)` registers a menu at module scope so a test can inspect its entries before any zone mounts.
- eea3aca: Pass the tour intro panel through to Tessera. A tour step gains `intro`, `art` and `reveal`, with the meaning they have on a Tessera guided step: `intro: true` draws the wide welcome panel, `art` is its picture and `reveal` runs before Tessera looks for a target that is not drawn yet. A `.tour.ts` file has no JSX, so `art` also accepts the token `'product-mark'`, which Brock turns into the product mark (the brand mark, else the product logo), and `{ icon: '<name>' }`, which becomes a Tessera icon. A `ReactNode` still works in a `.tour.tsx` file. A step without these fields is unchanged.
- eea3aca: A tour step can light an entry in a submenu. `target: { menuEntry }` takes a path, `{ menuEntry: ['Advanced', 'Take the tour'] }`, and a plain label is now searched for in the submenus too. Brock opens each parent submenu in order with a click, as a pointer would, before the step lights the entry, and the submenus close with the menu when the step ends. An entry that is not there leaves the step centred.

### Patch Changes

- eea3aca: The review tours wait for the walking mascot to stop before they check that it keeps off the lit part. The wait reads the mascot's position until it holds still for a few polls, up to 3 seconds, and the step fails with the reason when it never stops. It replaces the single fixed 700 ms pause, which a long walk to a page-sized hole outlasted.
  - @drizztdourden08/brock-core@0.106.0

## 0.105.0

### Minor Changes

- e345020: Run a process as a job. `ctx.processes.define(id, { label, parse, resolve, progress?, successCodes?, elevate?, cancel? })` registers a program the renderer may start by id with `jobs.runProcess(id, args)`, and `ctx.processes.run(id, spec, options)` runs one from main. The renderer sends only the id and one value; the app's `parse` checks it and `resolve` builds the argument array, so the renderer never names a program, an argument list, a directory or an environment. The program is spawned with `shell: false`, `windowsHide: true`, an absolute command, a plain argument array and an environment that starts from a short allowlist plus what the app adds. Its stdout and stderr lines go to the job log (cleaned, with each line cut at 4096 characters), an optional `progress` parser turns a line into a fraction or a label, and the job is done on exit code 0 or a listed code and failed otherwise, with the code and the last 20 lines in the outcome. The renderer call is accepted only from the top frame of the main window at the app origin (`fromAppFrame`, also exported for other handlers). Commands are checked hard: on Windows a normalised drive letter `.exe` or `.com`, with scripts, data streams, network and device paths and command interpreters such as `cmd`, `powershell` and `msiexec` refused unless the definition allows them, and `spec.env` may not set `NODE_OPTIONS`, `ELECTRON_*`, `LD_PRELOAD`, `DYLD_*` or `PATH` unless allowed. Log lines lose OSC and C1 sequences and bidi overrides, `redact` and `log: false` keep secrets out of the log, and each job update carries at most 64 KiB of the log. `timeoutMs` force-kills a long run. Cancel stops the whole process tree (`taskkill /T`, then `/F`, on Windows; SIGTERM then SIGKILL to the process group elsewhere), one process runs per job id, and a quit kills every running process. An outcome is `cancelled` only when the kill ended the process. If the kill is refused or the process outlives it (an installer that raised its own rights), the outcome is `detached` and the id stays busy until the process exits; an `elevate: 'installer'` job is not cancellable unless the definition says so. `elevate: 'installer'` only notes that the program may show its own system prompt; Brock never raises rights. Core caps the log in each job update and gains the `ProcessJobOutcome` type and the `job:runProcess` channel (`runProcessJob` on the host API); react gains `jobs.runProcess`.
- 0806572: Brock moves to Tessera 0.68. A docked toolbar has a context menu: a right click, Shift+F10 or the Menu key opens Show labels, Move to (Top, Bottom, Left, Right) and Hide toolbar. They are three new commands, `toolbar.labels`, `toolbar.moveTo` and `toolbar.hide`, that take the toolbar id (and the side) as `args`, and the Toolbars menu now holds the same entries in a sub-menu for each shown toolbar. The labels flag and the side are saved in the toolbar layout, and `useToolbarLayoutStore` gains `hide`, `setLabels` and `moveToSide`. Pass `slot.labels` to Tessera's `Toolbar` as `labels`. `ToolbarHost` draws each toolbar inside a `display: contents` element that carries the zone `brock.toolbar` (`TOOLBAR_ZONE`); the command ids are `TOOLBAR_COMMANDS`.

  Context menu items carry `data-menu-entry` (the command id, else the label), and an entry `reason` is now also the item's `aria-description`. Focus returns to the opener through Tessera's `ContextMenu`, so Brock's own focus code is gone. `contextMenuHandler(zone, data?)` returns an `onContextMenu` handler for the Tessera parts that report a right click with an id, such as `DocumentTabs` `onTabContextMenu` and `StatusBar` `onItemContextMenu`.

### Patch Changes

- Updated dependencies [e345020]
  - @drizztdourden08/brock-core@0.105.0

## 0.104.0

### Minor Changes

- 6e3ed14: Add `product.menu.profiles`, true by default. With `false` the Profiles entry leaves the main menu, as `product.menu.home: false` does for Home. Profiles themselves keep working: the profile switcher, the command palette and the shortcuts are unchanged. The review does not expect the Profiles entry then.

  Add `product.initialProfile`, a profile name such as `Default`. On the first start, when no profile exists, the `profiles` boot task creates a profile with that name and activates it without opening the profile picker. The Profiles screen and switching stay available, unlike `singleProfile`. With a profile already on disk nothing changes.

- 8387f89: A first-run tour step can light three more shell parts with `target: { shell }`. `'page'` is the screen host alone, without the rail, the title bar or the docked widgets. `'rail'` is the screens rail. `'hero'` is the Home hero, or the hero of the open hub when Home has none. `'screen'` is unchanged. A part that is not on screen leaves the step centred, like any other missing part.
- 8387f89: A first-run tour step can light the page tab strip with `target: { shell: 'tabs' }`. A step also takes `openMenu`, which opens a title bar menu before the step lights its target and closes it when the step ends: `'menu'` is the app menu, and any other id is the title bar action menu with that id. A new target, `{ menuEntry: 'Take the tour' }`, lights the entry of an open menu by its label.

### Patch Changes

- Updated dependencies [632c810]
- Updated dependencies [6e3ed14]
  - @drizztdourden08/brock-core@0.104.0

## 0.103.0

### Minor Changes

- 6481c2d: A hub can fill the top group of its side nav. `top` on a bucket in `screens.config.ts`, or on a `defineHub` def, is a list of page ids that Brock passes to Tessera's SideNav as `config.top`: they sit under Home in that order with one divider after the block. A page in `top` leaves its regular group, and a group left with no page is not drawn. A hidden or unknown id is skipped. `buildHubNav` takes the list as a fourth argument.

### Patch Changes

- 6481c2d: Brock builds on Tessera 0.67. A widget's `dockWeight` now reaches Tessera, so docked widgets that share an edge are sized by weight, every widget keeps its weight when another one joins, and `defaultDockedSize` resizes the column a widget joins. This covers a widget opened from the Widgets menu, a widget kit member, a layout preset and a widget docked back from its own window. A widget's `icon` is now an icon name, and Tessera draws it before the label in the widget title bar and the tab chip, also in a popped widget window. A docked toolbar's `slot` carries `menuSide`, which an app can pass to Tessera's `Toolbar` so a left bar opens its menus to the right. The corner handles between stacked widgets no longer cover the title bar buttons of the widget below.

  The app review expects the widget title bar buttons at the larger of the xs height and Tessera's minimum hit area, which is 24 px since Tessera 0.67.

  - @drizztdourden08/brock-core@0.103.0

## 0.102.0

### Minor Changes

- ca5ed20: Add an app context menu built from commands, drawn with Tessera's `ContextMenu` and with no wrapper element. `useContextMenu(id, source)` declares a menu for an element or a command zone, and `contextMenuZone(id, { data?, typing?, focusable? })` marks an element the app already renders. An entry is a command id, `'separator'`, `{ command, label?, args? }`, a plain `{ label, run }` or a sub-menu (two levels); the label, icon, shortcut, enabled state and action come from the command registry, so a rebound command shows its new chord. Entries can also set `checked`, `hidden`, `disabled`, `reason`, `kind` and `confirm`. The builder runs once per open and gets `{ point, target, trigger, data }`, and `CommandDef.run` now takes that context as an optional argument (`commands.run(id, context?)`); `CommandDef` gains an optional `checked`. A config adds `anchor`, `shouldOpen` (decided on pointerdown), `openOn: 'release-without-drag'`, `beforeOpen`, `label` and `inherit: 'parent'`. The menu opens on right click, on a long press, and on Shift+F10 and the Menu key through the new rebindable command `brock.context-menu`, which fires only while the focus sits in a declared menu. The browser menu stays where no menu is declared, in a `data-native-menu` element and in a text field unless it opts in. The menu closes on scroll, wheel, resize, blur, a route change and focus leaving, and `blockContextMenus(true)` holds it back during a drag. `openContextMenu` and `listContextMenus` serve tests. The `ContextMenu` chord token (the Menu key) is known to the chord parser and shows as a Menu keycap.
- 03fae52: A settings page can show a preview beside its rows. A `TabDef` (or the `meta` of a `.settings.ts` page) takes `preview: (settings) => ReactNode` and `previewPlacement: 'start' | 'end'` (default `'end'`). In a wide page the preview takes a second column; in a narrow one it stacks above the rows. `<BrockApp background={node}>` draws one node behind the widget host and the docked panels, above the window background, and lets pointer events through.

### Patch Changes

- @drizztdourden08/brock-core@0.102.0

## 0.101.0

### Minor Changes

- b0d5e5e: Toolbars is now a level 1 menu next to Widgets, with the same key and contents. `product.menu.home: false` leaves the Home entry out of the menu. `<BrockApp titleBarMenu={{ label, icon }}>` puts the app's title bar items into one dropdown button, keeping chords, disabled state and the disabled reason inside it.

  The built-in Logs and Performance widgets now sit in the Developer group of the Widgets menu while developer tools are on, and stay in the plain list while they are off. A widget meta takes `menu: { developer: true }` for the same behaviour.

### Patch Changes

- Updated dependencies [b0d5e5e]
  - @drizztdourden08/brock-core@0.101.0

## 0.100.0

### Minor Changes

- 148e7f2: An app review step can now set the window size. `defineReviewStep` takes `sizes`, a list of `'narrow'` (the 600 by 720 window the shell uses for its own narrow captures) or `{ name, width, height }`. The step runs once per size: the main window is resized through the review probe, which works in a hidden launch, the step runs, and the window goes back to its old size even when the step throws. The size name is added to the end of every capture and check id, so one step can capture a layout narrow and wide.
- e24df4e: Search now finds a page by the keywords of its meta for every kind of page, and a page can declare rows of its own. A module settings page was left out of the index, and the hub page list dropped the keywords of a built-in page. Both are fixed. A new `searchRows` field in the page meta, a list of `{ label, keywords?, anchor? }`, adds one result per row: it opens the page and, with an anchor, scrolls to that element. `brock structure --check` now reports a `keywords` or `searchRows` value in a page meta that the build cannot read as a literal.

### Patch Changes

- @drizztdourden08/brock-core@0.100.0

## 0.99.0

### Minor Changes

- ce95881: A widget can carry a `dockWeight`, its relative height in a stack (1 when unset). A layout preset row with no entry in `sizes` takes the largest `dockWeight` among its widgets, so a definition can ask for a taller row. The `sizes` of a preset still win, and a saved layout still wins over the default. A widget opened later with `defaultSide` joins its edge stack through Tessera, which evens the stack out, so `dockWeight` does not reach it yet.

### Patch Changes

- 9c53bf7: Brock builds on Tessera 0.65. A toolbar end handle dragged past its lane end takes the corner from the lanes it crosses, and one more arrow press at the lane end does the same from the keyboard. A dropped toolbar lands at the pointer, snaps to its neighbours and pushes them along. In keyboard pick mode, PageUp and PageDown step through the slots of a lane. The saved layout keeps its v2 shape, so no script is needed.
  - @drizztdourden08/brock-core@0.99.0

## 0.98.0

### Minor Changes

- 106472e: A settings row drawn by `renderControl` keeps the standard row chrome: the title, the description, the hint, the row actions and the lock, with the custom control in the control slot like a built-in control. A setting item takes `layout: 'wide'` to draw a wide editor at the full width of the row, below the title and description, and `chrome: false` to keep the old behaviour where `renderControl` owns the whole row. A hidden hub home page stays out of the side nav like any other hidden page and the hub still opens on it by route. When the home is the only page shown, it stays in the nav as before. The side nav is drawn once two pages are listed, not counting a hidden home.
- 40c83ac: Brock builds on Tessera 0.64 and its new toolbar dock. Docked toolbars sit in a visible bar, can share a lane and have resize handles that push their neighbours. The saved toolbar layout is now Tessera's v2 format. A layout saved by an older build is upgraded in memory when it loads and saved as v2 on the next change, so no script is needed. An older build that reads a v2 layout resets the toolbars to their defaults and leaves the widgets alone. Each docked toolbar bar is one F6 stop. Widget panels can take a corner and dividers push their neighbours, with no change to the saved widget layout.
- 40c83ac: An app can place the toolbar host itself. `BrockApp` takes `toolbarPlacement`, `'widgets'` (the default, the dock wraps the widget host as before) or `'app'`, and with `'app'` the app mounts the exported `ToolbarHost` around its own work area, such as a canvas page. Only one host draws the toolbars; a second logs a warning once and renders only its children. A host that mounts late now keeps the layout saved for the profile: the store holds the stored layout until the toolbars are registered and reads it once, so the defaults are never saved over it. A docked toolbar is now a stop of its own for F6 and Shift+F6 even inside the main area, and the main area stays in the cycle.

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

- 1f3d40b: Brock is built and tested on Tessera ^0.63.0. The peer ranges are unchanged. Tessera 0.62 exports the useInView hook. Tessera 0.63 adds VirtualGrid getRects, section header actions, ActionItem loading, a compact ItemCard tag line, and fixes for the DocumentTabs tablist and the Stepper step names. It removes nothing Brock uses, and the controller silhouette is untouched.
  - @drizztdourden08/brock-core@0.97.0

## 0.96.1

### Patch Changes

- @drizztdourden08/brock-core@0.96.1

## 0.96.0

### Minor Changes

- df9190a: A module can now contribute a whole bucket. `RendererModule.buckets` takes `{ bucket, entries }` with the same `BucketDef` and `BucketEntry` shapes the generated screen tree uses. `BrockApp` adds the bucket, its hub and its search entries to the app's screen tree, throws if the app already declares that bucket id, and gives an app with no screen tree the hubs as module screens. A module menu entry whose `screen` is the bucket id opens it, so it can sit under Advanced with `menu: 'hidden'` and `switcher: false`.

### Patch Changes

- 03e9f16: `focusRegion(id, label, { role })` keeps the role an app asks for, such as `application` for a canvas. The role is still `region` by default, and the mark alone makes the element a region stop.
  - @drizztdourden08/brock-core@0.96.0

## 0.95.0

### Minor Changes

- 8a93950: The shell gets landmarks, region cycling and an announcer. The title bar is a `banner` and the screen host is the one `main` (named by `product.widgets.mainLabel`). F6 and Shift+F6 move focus to the next and previous region and wrap; they are the commands `brock.region.next` and `brock.region.previous`, so they show in the shortcut list and can be rebound. A region is a landmark, a toolbar or any element marked with the new `focusRegion(id, label)`, and focus lands on the control that had it last. `announce(message, { politeness? })` writes to a polite or an assertive visually hidden live region mounted by `BrockApp`, and says the same message again when repeated.

### Patch Changes

- 7e3cae1: Brock is now built and tested on Tessera `^0.61.0` (the workspace catalog). The `brock-react` peer range is unchanged at `>=0.58.0 <1`. The release lifts the brock grey so faint and muted text reads at 4.5:1 or more on every surface. It has no MIGRATION entry, and Brock needed no code change for it.
  - @drizztdourden08/brock-core@0.95.0

## 0.94.0

### Minor Changes

- 675874a: `BucketDef` takes `switcher: false` (default true) to keep a bucket out of the top hub switcher. `menu: 'hidden'` only drops the app menu entry, so such a bucket still showed as a tab. A switcher-hidden bucket still opens through its menu entry, its shortcut, a search result and `open('bucket/page')`, and the switcher shows no tab as selected while it is open. `defineHub` takes the same `switcher` field.
- ce4e429: Brock is now built and tested on Tessera `^0.59.0` (the workspace catalog). `brock-react` now takes any Tessera from `>=0.58.0 <1` as its peer, so a consumer can move to a newer Tessera minor without waiting for a Brock release. Brock is tested on the catalog version only. The release adds VirtualGrid sections, a scroll ref and marquee select, and a `.bxel` file icon. It has no MIGRATION entry, and Brock needed no code change for it.

### Patch Changes

- 6e8de00: Brock is now built and tested on Tessera `^0.60.0` (the workspace catalog). The `brock-react` peer range is unchanged at `>=0.58.0 <1`. The release adds a `fit` prop to Grid and moves the ControllerSilhouette anchors to match real pads. It has no MIGRATION entry, and Brock needed no code change for it.
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

### Minor Changes

- ca050ce: `brock-react` now requires Tessera `^0.58.0`. The release adds Bxel file type icons, a windowed VirtualGrid, DynamicInput character sets and validation, and Toolbar click menus. It has no MIGRATION entry, and Brock needed no code change for it. `brock icons` now reads the file type icons from the plain brand folder when the brand has a rim, because Tessera ships `filetypes/` only there. Before, a light rim brand such as Bxel with `rim: 'light'` got no file type icons.

### Patch Changes

- @drizztdourden08/brock-core@0.92.0

## 0.91.0

### Minor Changes

- c364271: `documents.open` and `documents.saveAs` take `grantFolder: 'ask'` or `{ ask: true, levels }` to grant the folder of the picked file, after a native confirm that names the exact folder, with the refused-root checks and the remembered folders of `openFolder`; the answer then carries `folderGranted` and a reason.

### Patch Changes

- Updated dependencies [c364271]
  - @drizztdourden08/brock-core@0.91.0

## 0.90.0

### Minor Changes

- a45f9fd: File type icons come from the brand, and a settings page can read app values. `brock icons` copies `brand/<brand>/filetypes/<type>/` for each file association into `build/filetypes` (an `.ico`, an `.icns` and the Linux sizes), the builder config points each association that sets no `icon` at it, and `brock sync` ignores the folder. A settings page (`meta.source` of a `.settings.ts` file, or `source` on a tab) or a section can name a `source` of `{ get(key), set(key, value), subscribe?(listener) }`; its rows read and write through it, and the hub search and the palette still find them. Profile settings stay the default.

### Patch Changes

- @drizztdourden08/brock-core@0.90.0

## 0.89.1

### Patch Changes

- @drizztdourden08/brock-core@0.89.1

## 0.89.0

### Minor Changes

- af60e66: `brock-react` now requires Tessera `^0.57.0`. The release adds 48 pixel icons, Toolbar items that take any node as `icon`, and a public `useHoverOpen`. It has no MIGRATION entry, and Brock needed no code change for it.

### Patch Changes

- @drizztdourden08/brock-core@0.89.0

## 0.88.1

### Patch Changes

- @drizztdourden08/brock-core@0.88.1

## 0.88.0

### Minor Changes

- 8422f5e: File operations and watching for folder grants. `ctx.documents` and the renderer's `documents` gain `trash(path)` (the system trash through `shell.trashItem`, no permanent delete, never the grant root), `rename(from, to, { overwrite? })`, `mkdir(path, { recursive? })`, `revokeFolder(path)` and `watch(folder, { recursive? }, listener)`, which emits `{ kind: 'add' | 'change' | 'remove', path }` over `fs.watch` with a 100 ms debounce and the 5000 entry cap of a listing, and stops on unsubscribe, revoke and window close. Every operation runs the write checks on the real path on every call: the class refusals, links that lead outside, the app's own folders, device names and the Mark of the Web on a risky new extension. Folders the user picks in the dialog are remembered per profile in the signed store of the recent list (per-install key), and `documents.rememberedFolders()`, `regrant(path)` and `forgetFolder(path)` list, restore without the dialog (only a signed entry that still passes the grant root checks) and remove them. Main grants are never remembered unless main calls `rememberFolder`. New channels `document:revokeFolder`, `document:trash`, `document:rename`, `document:mkdir`, `document:watch`, `document:unwatch`, `document:rememberedFolders`, `document:regrant`, `document:forgetFolder` and the event `document:watchEvent`; `document:openFolder` takes the profile id. Revoking never touches the disk and matches by name only, a rename checks the new name of a folder or link and what a folder's content would newly become, trash and rename act on a link itself, watches belong to the page that asked and stop on reload, and remembered folders that are missing stay listed as unavailable.

### Patch Changes

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
- 20ce5ee: Docked toolbars by convention, on Tessera `^0.56.0`. An app puts a toolbar in `src/toolbars/<id>.toolbar.tsx`, default-exporting `defineToolbar({ id, label, defaultSide, hiddenByDefault?, render(slot) })`; `slot` carries the orientation, the grip `handle` and the `side`. `brock sync` lists the files in `.brock/toolbars.ts` as `appToolbars`, `brock structure` accepts and checks the folder, and `RendererModule.toolbars` adds a module's toolbars.

  `BrockApp` takes `toolbars` and, when at least one is registered, wraps the widget host in Tessera's `ToolbarDock` inside `brock-app__stage`. An app with no toolbars is unchanged. The layout is saved per profile as its own `toolbarLayout` key in `ui-views.json` beside `widgetLayout`, loaded with `migrateToolbarLayout`, and defaults to `createToolbarLayout`. `useToolbarMenuEntries()` adds a Toolbars sub-menu to Widgets, with its own Reset toolbars entry; Reset layout still resets widgets only.

  The `toolbar-files` migration (0.87.0) adds `toolbars={appToolbars}` and its import to `src/main.tsx`. The lint stack allows the default export in `src/toolbars/*.toolbar.tsx`.

- 20ce5ee: `brock-react` now requires Tessera `^0.56.0`, and the lockfile resolves 0.56.1, which fixes the double fold handle of ListDetailLayout. The release adds ToolbarDock, `useToolbarLayout` and `toolbarMenuGroups`, tooltips on segmented controls and toggle groups, and crisp pixel icons. Its MIGRATION notes have no entry that concerns Brock, and the bump itself needed no code change.

### Patch Changes

- Updated dependencies [f32d5d9]
  - @drizztdourden08/brock-core@0.87.0

## 0.86.0

### Minor Changes

- 4b2f410: `brock-react` now exports `chordKeys(chord, mac?)`, which turns a chord into its keycaps in order, plus `useIsMac()` and `isMac()` to read the platform flag of the command store. `useCommandChords(id)` was already reactive and now has a keep test. Use them to show shortcut hints without parsing chords by hand.

### Patch Changes

- @drizztdourden08/brock-core@0.86.0

## 0.85.0

### Minor Changes

- 2e23c94: `brock-react` now requires Tessera `^0.55.0`. The release adds ContextMenu, AnchorPicker, VirtualList, `useMarqueeSelect` and SegmentedControl icons that take any node. It has no MIGRATION entry, and Brock needed no code change for it.

### Patch Changes

- @drizztdourden08/brock-core@0.85.0

## 0.84.0

### Minor Changes

- c813440: An app can add entries to the title bar View menu. An app menu item keyed `view` with `children` hands them to Tessera 0.54 `WindowTitleBar` as `viewItems`, drawn after Tessera's own View rows with a separator. The item still works as the placement marker for View, and the search palette lists the entries under View. `brock-react` now requires Tessera `^0.54.0`.

  Tessera 0.54 removes the controller composites and the `stickPosition` and `calibrated` strings. The input module's StickPlot owns those two labels, and the guide registers ControllerLayout, PressedGrid and StickPlot as Brock parts.

### Patch Changes

- @drizztdourden08/brock-core@0.84.0

## 0.83.0

### Minor Changes

- 3dd25e5: `confirmAction` and `confirmChoice` take `alternate: { label, onSelect, tone?, closes? }`, a third button beside confirm and cancel. `tone` is `neutral` (the default, drawn as a secondary button) or `danger`. The dialog stays open after `onSelect` unless `closes` is true, which closes it and resolves `false` for `confirmAction` and `null` for `confirmChoice`. The startup prompt `ctx.confirmAction` and `ctx.confirmChoice` pass it through. `confirmSave` and its red Discard are unchanged. The confirm dialog footer now keeps every button on one row: the alternate (Discard or a neutral alternate) in a start group on the left, Cancel and the confirm button in an end group on the right, wrapping only when the dialog is too narrow. Before, the alternate sat alone on a row above Cancel and Save.
- 7a23ca9: Title bar items take `disabledReason` beside `disabled`, and a `status` spec takes both. Brock hands them to Tessera 0.53, which makes a disabled action inert and shows the reason as its tooltip. `brock-react` now requires Tessera `^0.53.0`. `disabledReason` is a literal a lazy title bar button can keep.

  `SettingItem.hint` is optional. Tessera 0.53 draws a settings row with no hint line and no gap when the hint is missing or empty, and Brock hands the row `undefined` as it is. The settings search, the palette and the build-time seeds already treat a missing hint as no text. A linked toggle with no hint draws none.

### Patch Changes

- 10222eb: The review no longer fails `console-errors` on the browser notice `ResizeObserver loop completed with undelivered notifications.`. A window resize can defer observer callbacks to the next frame, and nothing is lost when it does. The renderer's global error handler now logs exactly that message as a warning and keeps it off the console, and the review's console feed skips it. Core exports `isBenignBrowserError` for that test. Every other console error still fails the check. `gate-context-only-reopens` now says whether the window came back in the wrong place, with both bounds, or was not shown again in time.
- Updated dependencies [203ad09]
- Updated dependencies [10222eb]
- Updated dependencies [203ad09]
  - @drizztdourden08/brock-core@0.83.0

## 0.82.0

### Minor Changes

- 44e91ce: feat: focus zones for commands

  `CommandDef` gains `zone`. A zoned command fires only while the focused element sits inside an element marked with `{...commandZone('canvas')}`, and it ranks above a scoped and an unscoped command with the same chord. The same chord in different zones is not a conflict. A command bound to Mod+C, X, V, A or Z already wins over the native Edit menu, since it runs on keydown and prevents the default.

- 9e2ade8: `showHeader` in `ScreenMeta`, `LiveMeta` and `LivePage` also takes `'compact'`, which draws the hub page header in Tessera's compact size and still holds `PageActions`; `true` and `false` work as before. `PageHeaderMode` is exported. The lint config turns off `local/hook-file-named-after-hook` for `.live.tsx` and `.live.dev.tsx` files under `src/screens`, so a live file declares its hook and default-exports it without a re-export from a view.

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

- 845f695: Breaking: hub pages draw no big page header by default, and the app can take over the content side of a hub. A page shows the header only with `showHeader: true` in its meta (a page that declares `header: { primary, search }` keeps it, a page with tabs keeps its tab bar, a sub page keeps its back button); a page that fills the header with `PageActions` needs `showHeader: true`. Migration `hub-page-header-off` (0.80.0) lists each hub page and custom page without a header setting as a to-do. New: `bare: true` in the meta of a `.page.tsx`, `.custom.tsx`, `<page>.page.ts` or `.live.tsx`, or on a `LivePage` entry, renders the page straight into the content slot with no card, padding, header or scroll area, named by the page title for assistive tech. `pages: 'bare'` on a bucket (or `HubDef`) makes every page of the hub bare, and a page opts back in with `bare: false`. `WindowItem` takes `bare: true` to drop the pane scroll area of one `defineWindow` item. `HubPagesMode` is exported.
- 7fe7469: Start-up prompts and a richer confirm dialog. A start-up prompt is `src/startup/<id>.prompt.ts`, default-exporting `defineStartupPrompt({ order?, run(ctx) })`; `RendererModule.startupPrompts` adds a module's. Brock runs them once per launch, one at a time in `order`, after the window reveal, once a profile is active with its settings loaded and after any first-run tour has ended or been skipped, and never on an automation launch. A prompt that throws is logged and the next one runs. `ctx` carries `confirmAction`, `confirmChoice`, `confirmSave`, `profile`, `settings` (`get`, `patch`, `flush`) and `nav`. `brock sync` writes `.brock/startup.ts` (a prompt with a literal `order` loads when it runs), `src/main.tsx` passes it as `startupPrompts` (the `startup-prompts` migration of 0.80.0 adds that), `brock structure` checks the folder and the lint preset lets prompt files default-export. `confirmChoice` takes `look: 'select'` (Tessera's `Select`, with `searchable`) in place of the radio group and still resolves the picked value, or `null` on cancel. Every confirm dialog takes `facts: { label, value }[]`, drawn under the message with Tessera's `FactsPanel`. Defaults are unchanged.

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

### Patch Changes

- @drizztdourden08/brock-core@0.78.0

## 0.77.0

### Minor Changes

- 44c38e9: Live hub pages. A `<id>.live.tsx` file in a bucket or group folder is a slot in the hub nav that fills at runtime. It default-exports a hook that returns `LivePage[]` (`key`, `title`, `icon`, `badge` of `'ok'` or `'warn'`, `render`) and exports `meta: LiveMeta` (`icon`, `empty`, `title`, `order`, `keywords`, `devOnly`). The slot sorts by `meta.order` among the static pages, so Directory, one entry per connected pad, then Logs and Diagnostics keep their order. The badge shows as a status dot on Tessera's `SideNavItem`, `empty` shows as a disabled nav entry while the list is empty, and `keywords` feed the hub search. An entry opens at `<bucket>/<id>/<key>` (`section` and `tab`); when it disappears, the hub shows the first static page of the group. `brock sync` reads the file as an eager kind, and `brock-lint-config` treats it as a screen file. See Live hub pages in `docs/app-structure.md`.
- 0cffb66: An opt-in menu bar row. Pass `<BrockApp menuBar>` a list of `{ id, label, entries }` menus whose entries are command ids, `'separator'` or `{ label, entries }` submenus, and the app draws a row of menu buttons under the title bar. Labels, icons and chords come from the command registry, so a remap shows at once, and an entry is greyed out while the command's `when()` is false. Alt opens the first menu, the arrow keys move between menus and items, and Escape closes. The hamburger stays.
- af040f2: Recent documents and recovery snapshots for document apps. The documents port gains `recent()`, `clearRecent()` and `openRecent(path)`, a capped per-profile list that main fills on Open and on save, drops missing files from, feeds to the OS jump list and Dock menu, and reopens only through the document allowlist. It also gains opt-in `snapshot(key, data)`, `recoverable()`, `restoreSnapshot(key)` and `discardSnapshot(key)`, stored atomically in the profile folder and cleared on a clean save. brock-react adds `useRecentDocuments`, `useRecentMenu`, `useRecoverable` and an optional `RecoveryPrompt`.
- 49214f2: A title bar button spec takes `disabled`. A button with a `command` is disabled while the `when` of that command returns false, and the bar re-reads it each time the component that registers the command renders, so Undo and Redo follow the document. A disabled button ignores clicks. Brock hands Tessera `disabled: true` on the bar action; Tessera 0.52 has no disabled look for title bar actions yet, so the button is not dimmed until it does.

### Patch Changes

- Updated dependencies [af040f2]
  - @drizztdourden08/brock-core@0.77.0

## 0.76.0

### Minor Changes

- 1e8234c: Breaking: `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed from brock-react, and `Mod` now means only the platform key. Apps move to `commands.matches`, `commands.chords` and `formatChord`; migration `shortcut-helpers-removed` turns each use into a to-do.

  A command keymap. Every shortcut is now a command in one registry: `{ id, label, icon?, group?, chord?, scope?, whileTyping?, when?, run }`. A chord is `'Mod+S'`, a list, or `{ mac, other }`, and `Mod` is Ctrl on Windows and Linux and Cmd on macOS. An app declares commands with `<BrockApp commands>`, `RendererModule.commands`, `useCommands(defs)` in a screen (with `scope` set to the screen id) or `commands.register(defs)`, and runs one with `commands.run(id)`.

  One dispatcher resolves chords. A plain key does nothing while the user types in a field, a Mod chord still fires, and `whileTyping` changes that. A scoped command wins over a global one while its screen is open.

  Users remap chords on the new `KeymapPage`, which an app adds as a settings page file. Remaps are stored per profile in the settings under `keymap` (`BaseSettings.keymap`, `KeymapOverrides` in brock-core). The page shows conflicts and resets one row, a group or all. `commands.remap`, `commands.reset` and `commands.conflicts` do the same from code.

  Menus, title bar tooltips and the Ctrl+/ dialog read the current chord from the registry, so a remap shows everywhere at once. A menu entry takes `command`, and a title bar button spec takes `command` in place of `onSelect`; `brock-build` keeps `command` in a lazy title bar button.

  Brock's own shortcuts moved onto the registry with the same defaults: Search (Mod+K), Keyboard shortcuts (Mod+/), Toggle fullscreen (Alt+Enter) and Go back (Alt+Left, now listed in the dialog). Screen and page shortcuts are `open:<route>` commands. `Mod` now means only the platform key, so Win+K no longer opens Search on Windows. `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed; use `commands.matches(id, event)` and `formatChord`.

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

### Minor Changes

- f7c46f5: Breaking: require Tessera 0.52.0, which drops light backgrounds. `product.icons.rim` takes `'light'` only, and `brock icons` no longer reads `brand/dark-rim`. The hero brand art and the About screen follow the new Tessera types. Apps remove `rim: 'dark'` and any `ground` prop on `BrandMark` or `Logo`; migration `light-ground-removed` lists each one as a to-do.

### Patch Changes

- Updated dependencies [f7c46f5]
  - @drizztdourden08/brock-core@0.75.0

## 0.74.1

### Patch Changes

- @drizztdourden08/brock-core@0.74.1

## 0.74.0

### Minor Changes

- a46d346: The input module now uses the Tessera 0.50 controller types instead of its own copy. A `PadState` is now `{ slots, extras }`. `slots` holds the 20 Tessera slot ids with `pressed`, `value`, `x` and `y`. The ten extra controls (`extra.misc2` to `extra.misc6`, the four paddles and the touchpad) are no longer slots. They come as `extras`, a list of `{ id, label, pressed }` items shaped like Tessera's `ControllerExtra`, so `pad.slots` and `pad.extras` go straight into `ControllerLayout`. `onPadState` and `usePadState` carry the new shape. Read `pad.slots['face.south']` where you read `pad['face.south']` before. `CONTROLLER_SLOT_IDS` is no longer exported by the input module, import it from Tessera. Requires Tessera 0.50.0.

### Patch Changes

- @drizztdourden08/brock-core@0.74.0

## 0.73.0

### Minor Changes

- 7cdfd3a: A bare card now shows its title and icon in the small corner chip that Tessera 0.49 draws on a window with no title row. Hubs keep the chip off, as their floating switch already names them. Requires Tessera 0.49.0.

### Patch Changes

- @drizztdourden08/brock-core@0.73.0

## 0.72.0

### Patch Changes

- @drizztdourden08/brock-core@0.72.0

## 0.71.1

### Patch Changes

- @drizztdourden08/brock-core@0.71.1

## 0.71.0

### Minor Changes

- 3a70d40: Add `bare: true` to a card's meta. A bare card looks exactly like the Home hub window: no title row, the hub padding, the corner close and lock, no screen switcher, movable, and the shared hub window storage key. `brock-react` now exports that key as `HUB_WINDOW_KEY`.

### Patch Changes

- @drizztdourden08/brock-core@0.71.0

## 0.70.0

### Minor Changes

- 0793ab8: Add `defineWindow`, a declarative window with a side nav and one pane per nav item: nav groups and items (label, icon, id, disabled, badge) with their content in a `.card.tsx` or `.layer.tsx` file, the active item from the `nav` route param, and the nav folding to a bar in a narrow window. A card with `fill: true` in its meta now draws the one window header and a body with no padding or scroll wrapper. The Tessera minimum is now 0.48.0, which draws the nav item badge.

### Patch Changes

- @drizztdourden08/brock-core@0.70.0

## 0.69.0

### Patch Changes

- 9ef1f24: Draw a card screen under one window header with its content straight in the window body, instead of a second page header and an inner card.
  - @drizztdourden08/brock-core@0.69.0

## 0.68.6

### Patch Changes

- 8b48bd8: Raise the Tessera minimum to 0.46.1 for the corrected panel behavior.
  - @drizztdourden08/brock-core@0.68.6

## 0.68.5

### Patch Changes

- 75e4730: Update Tessera to 0.46.0 and align its supported peer range.
  - @drizztdourden08/brock-core@0.68.5

## 0.68.4

### Patch Changes

- @drizztdourden08/brock-core@0.68.4

## 0.68.3

### Patch Changes

- 223a01b: Start the brand mascot walking across the app when a window opens, allow Tessera's random animations to run, and hide the mascot when the window closes.
  - @drizztdourden08/brock-core@0.68.3

## 0.68.2

### Patch Changes

- 997015d: Keep the autonomous brand mascot walking along the main app viewport across Home and other screens, instead of mounting it inside each screen window.
  - @drizztdourden08/brock-core@0.68.2

## 0.68.1

### Patch Changes

- 2d1698e: Position the walking mascot's search hint with valid CSS and give the mascot time to finish walking beside the search palette during review.
  - @drizztdourden08/brock-core@0.68.1

## 0.68.0

### Minor Changes

- 1f7604e: The app's brand mascot walks along the bottom of an open window and stands beside the search palette with a hint.

  Apps can set `restoreNavigation: false` on `BrockApp` to start without reopening the last screen. The menu review also skips screens hidden by their `show` condition.

  - While a screen window is open (a hub, a page or any `ScreenWindow`), Tessera's `MascotStage` draws the brand mascot along the bottom edge of the window, with its own autonomy: it idles, wanders and naps. It takes no pointer events or focus, follows Tessera's reduced motion, and goes away with the window. An app whose brand has no mascot draws nothing.
  - When the Ctrl+K palette opens, the mascot walks beside it with the stage's `moveTo`, plays `point` and a `Callout` shows a hint about the search. It goes back to wandering when the palette closes.
  - `product.mascot` in `brock.config.ts` is the config: `mascot: false` turns the walker off (the palette and hero mascots stay), and `mascot: { searchHint: '...' }` replaces the default hint, `Type to search pages, settings and actions.`.
  - The review has a `mascot` step: the mascot stands along the window's bottom edge, then beside the palette with the hint, and is gone with the window (`mascot-window`, `mascot-window-bottom`, `mascot-beside-palette`, `mascot-search-hint`, `mascot-gone`), with captures `mascot-window` and `mascot-palette`.

### Patch Changes

- Updated dependencies [1f7604e]
  - @drizztdourden08/brock-core@0.68.0

## 0.67.0

### Minor Changes

- 1289dac: Brock moves to Tessera 0.45.0, which brings one pane edge everywhere. SidePanel and ListDetailLayout lose `resizable`, ResizeHandle's look, `onCollapse`, children and `onClick` give way to `fold`, and SplitPane's `snapAt` becomes `collapsible`. Brock used none of them. Apps that did follow Tessera's MIGRATION 269, and upgrade with `brock migrate`.

### Patch Changes

- @drizztdourden08/brock-core@0.67.0

## 0.66.0

### Minor Changes

- 620e6d8: Hub windows drop the Back button and share one window: one position, size and lock for every hub. The Back button and its row are gone; Escape, the hub switch, Alt+Left and the mouse Back button still go back. The save status and the profile tag now sit beside the hub switch and take no row. Every hub uses the storage key `brock.hub` and keeps one `ScreenWindow` mounted when you switch hubs, so the window stays where it is, at the same size and lock, whichever hub is shown. The per-hub keys of 0.64.0 (`brock.hub.<hubId>:rect` and `:locked`) are no longer read.

### Patch Changes

- @drizztdourden08/brock-core@0.66.0

## 0.65.0

### Minor Changes

- 3a7f2b1: Brock moves to Tessera 0.44.0, which adds the `SpeechBubble` part, `useReducedMotion` and ItemList `maxRows`. Apps upgrade with `brock migrate`.

### Patch Changes

- @drizztdourden08/brock-core@0.65.0

## 0.64.0

### Minor Changes

- 961c0e4: Hub windows have no title row and can be moved and resized, positions saved per hub. A hub window uses Tessera's `titleRow={false}` and `movable`: the hub switch names the page, a round X sits on the top right corner, and a lock beside it frees the window to move and resize. Each hub keeps its own lock and position under `brock.hub.<hubId>`. Back and the profile tag now sit in the first row of the hub content. Plain screens keep their title row.
- 9150a2b: Brock moves to Tessera 0.43.0. The two workarounds from 0.62.0 are gone: the Escape guard for a revealed title bar (Tessera's peek now handles that Escape itself) and `isolation: isolate` on `.brock-app__content` (the revealed bar has its own `--z-title-bar` layer). The behaviour is the same. Tessera renamed the `dock-resize*` classes to `rect-resize*`, so an app that styled or selected `dock-resize*` must use the new names.

### Patch Changes

- @drizztdourden08/brock-core@0.64.0

## 0.63.0

### Minor Changes

- c5c4a48: A hero can turn off the brand art. `<Art kind="none" />` in a `.hero.tsx` draws no art, not even the brand mascot a branded app's hero gets when it renders no `Art`, the same way `<Backdrop kind="none" />` draws no backdrop. `HeroArtProps` takes `{ kind: 'none' }` beside Tessera's `HeroArt`. The review's `hero` step checks that a hero with art none draws no art (`<bucket>-hero-art-none`). Heroes that render `Art` or leave it out are unchanged.
- c5c4a48: A module settings tab now joins the app's settings group of the same name instead of drawing a second one. Before, an app whose settings bucket declared `{ id: 'app', label: 'App' }` showed two App groups once brock-display added its Display tab. `TabDef` takes `groupId`, a stable id for its group: a tab joins the nav group with that id, else the group whose label is its `group` (trimmed, any case). Inside the group the app's own pages come first, in their `meta.order`, then the tabs in the order the app's `settings.tabs` and the modules list them. A tab that matches no group starts one after the app's groups, and later tabs with the same id or label join it. The Display tab now has `groupId: 'app'`. The review's `buckets` step fails a hub whose nav shows two groups with the same label (`<bucket>-nav-groups`).

### Patch Changes

- @drizztdourden08/brock-core@0.63.0

## 0.62.0

### Minor Changes

- 16321f1: An app can bind Brock's developer tools to a setting of its own, and turning developer tools off now closes the dev widgets that are open.

  - `developerTools` on `BrockApp` takes a binding, `{ get(): boolean, set(on), subscribe(listener) }`, or `developerToolsFromSettings('<key>')`, which reads and patches that key of the profile's settings (a dotted key reaches into a nested object). The binding is then the one switch: it decides in every build, a development run included, where developer tools are otherwise always on. Without a binding nothing changes: development runs and the `developerToolsEnabled` setting decide. `bindDeveloperTools(binding)` binds outside React and returns the unbind, which gives back the binding it replaced; `developerTools.bound()` and `developerTools.set(on)` read and flip a bound switch.
  - Turning developer tools off, in the same profile, now closes every open `devOnly` widget (docked, floating or in its own window, whose window closes), the open `devOnly` kit with its popped windows, and the `devOnly` widgets open in a kit that is not dev-only. Widgets > Developer and every `devOnly` menu entry hide as before. Turning them back on brings the submenu back; the closed widgets stay closed. A forced widget stays open. Before, a dev widget only hid while developer tools were off and came back where it was when they came back on.
  - The review drives developer tools through a binding of its own, so its checks run in a development run too. The `kits` step opens the dev widget and the dev kit, turns developer tools off and checks both closed (`widgets-developer-closes`) and Widgets > Developer gone (`widgets-developer-hidden`), then on again (`widgets-developer-back`). The widget windows check now expects a popped `devOnly` widget to close with its window when developer tools go off (`gate-dev-only-closed`) and to stay closed when they come back (`gate-dev-only-stays-closed`); `gate-dev-only-start`, `-toggled` and `-restored` are gone.

- 16321f1: Escape on a window now closes it, and Escape with no window open reopens the last one closed. This changes what every app does on Escape.

  - With a screen window open (a hub, a page, a sub-page, any `ScreenWindow`), Escape closes it in one press. It no longer goes up to the page, then to the hub home, before closing. Back, Alt+Left and the mouse Back button still walk the page history.
  - With nothing open, Escape reopens the window closed last, on the page, tab or sub-page it was on, with its page history and the scroll offsets of its scroll areas. The last closed window is kept in the saved navigation (`closed`), so it comes back after a restart too. When no window was closed, or the last one is not allowed any more (a dev-only screen with developer tools off, a screen that needs a profile with none active), Escape opens the home screen as before, or the profiles route without a profile.
  - Inner surfaces still take Escape first: a dropdown, a menu, a popover, a dialog, the palette, a tour, a text field with text in it. A title bar the keyboard revealed in full screen keeps its own Escape too, so leaving it does not reopen a window.
  - New: `nav.reopen()` and the store's `reopen()`, `ClosedScreen`, `closed` in `SavedNavigation`, and the `'reopen'` `EscapeAction` (`reopenAvailable` in `EscapeState`). `nav.escape()` closes the open screen, or reopens the last one when none is open, and returns whether it did something.
  - Removed: the store's `escapeTo` and `setEscapeTo`, which held where Escape went up to. An app that called `setEscapeTo` can drop the call.
  - The review follows: the `buckets` step checks that Escape closes each hub from its last page in one press (`<hub>-escape`), that the next Escape reopens it on that page (`<hub>-escape-reopen`) at its scroll offset (`<hub>-reopen-scroll`, captured as `bucket-<hub>-reopened`); `<hub>-escape-up` is gone. The `escape-home` step checks that Escape reopens the last closed window (`escape-reopens-last`, captured as `escape-reopen`), then that it opens home when there is none to reopen (`escape-opens-home`).

- 9a154a7: Breaking: the navigation store no longer has `escapeTo` and `setEscapeTo`, since Escape now closes the open window and reopens the last one. The `escape-to-removed` migration (0.62.0) leaves a to-do at each use; drop the call, or use `nav.reopen()`.
- 16321f1: The title bar in full screen hides fully and slides in whole when the pointer reaches the top edge, above the widgets. Before, the revealed bar was drawn under the docked and floating widgets and under anything in the app content with a z-index, so only part of it showed: the window buttons sat behind a docked widget on the right, and an app whose main view stacks above the content saw a thin strip. The app content (`brock-app__content`) is now its own stacking context, so nothing in it can cover the title bar.

  - The behaviour is Tessera's `WindowTitleBar` one: hidden in full screen (and in a borderless or full screen window mode), shown while the pointer is within the top 40 px, and Alt moves focus into it for the keyboard. Escape inside that revealed bar is left to it.
  - A headless run (the review, `--screenshot`) now lays full screen out off screen at the display size, as cluster full screen already did, instead of taking over the real screen.
  - New review step `fullscreen`: in full screen the bar is fully hidden (`fullscreen-bar-hidden`, captured as `fullscreen`), pointing at the top edge draws all of it with nothing covering it, a docked widget open (`fullscreen-bar-reveal`, `fullscreen-revealed`), moving away hides it (`fullscreen-bar-leaves`), Alt reveals it with focus inside (`fullscreen-bar-keyboard`, `fullscreen-keyboard`), and leaving full screen puts it back above the content (`fullscreen-bar-restored`).

### Patch Changes

- @drizztdourden08/brock-core@0.62.0

## 0.61.0

### Minor Changes

- 1d810a5: Three review checks no longer fail on apps that are set up as intended. `<hub>-<page>-row-hint` now points at the first toggle row that has hints, not just the first toggle row, so a bulk row with no hints no longer fails it. For a toggle with `hints.atRest`, whose pointed hint is one of its rest lines and so stays hidden, it passes on the current rest line. A page where no row has hints is now a skipped pass. `bug-report-prefill-cleared` now checks that the next plain open no longer shows the review's title, and expects an empty title only when the app sets no default title, so an app that calls `bugReport.setDefaultTitle` each time the dialog opens passes. `bugReport.hasDefaultTitle()` (the store's new `prefillIsDefault`) says whether the title waiting for the next open came from `setDefaultTitle`. The `buckets` step now evaluates each bucket's `hosts` and `when` rule for the active profile, and reports a hidden bucket as skipped passes of `<hub>-reachable` and `<hub>-pages`, with the reason, instead of failing to open it. It also no longer goes through a hidden bucket to reach another bucket's switch pill.

### Patch Changes

- @drizztdourden08/brock-core@0.61.0

## 0.60.1

### Patch Changes

- c8bfd82: A screenshot no longer catches a widget that was just opened as a spinner or an empty body. A widget asked to open through `widgets.open`, `widgets.toggle`, `widgets.force` or `widgetKits.open`, `toggle` and `openWidget` now holds the capture from that call until its body mounts, and a kit's overlays hold until they mount, so the hold no longer starts only once the widget's lazy import does. A `LazyHost` fallback holds while it is drawn. The hold lets go by itself when the widget did not open, after 60 frames when its body never mounts (a tab behind another), and after 5 s at most. The renderer now reports 0 holds only after two frames with no new hold and once the page's images have loaded and faded in, and main captures only once the count has stayed at 0 for 50 ms, waiting again if a hold comes back. This applies to `--screenshot` and to the review's `review:capture`, `review:captureWidget` and `review:captureGroup`, whose `settle` also waits for images. Main now adds up the holds of every window instead of keeping the last window's count. An app that waited on `lazyLoads.idle` plus a fixed delay before its capture can drop that wait.
  - @drizztdourden08/brock-core@0.60.1

## 0.60.0

### Minor Changes

- ebaabc3: Brock moves to Tessera ^0.42.0. A pixel art wordmark (`product.icons.wordmark.rendering: 'pixelated'`) now goes through Tessera on both splashes: the window's failure splash passes `wordmarkPixelated` to `Splash`, and the splash page writes Tessera's `ts-wordmark--pixelated`, so the sprite scales up with hard edges to fill the 384 px row. Brock's own `BootFailureSplash.css` and `.splash__pixelated` rule are gone. A wordmark now draws only as high as its picture, up to 48 px, so a very wide one has no empty band and a smooth one under 48 px high draws at its own height; `brock check` and `brock sync` warn when `src` or `dark` is shorter than 48 px, unless it is pixelated. Docked panes saved without `makeRoom`, in a widget layout or a kit view, now make room on load, and only a pane saved with `makeRoom: false` overlays the main view. Apps upgrade with `brock migrate`.

### Patch Changes

- @drizztdourden08/brock-core@0.60.0

## 0.59.0

### Minor Changes

- 4cdb713: `widgets.force(ids)` forces widgets open, for command line baselines and end-to-end runs on a fresh profile. Each id opens (a kit widget opens its kit), at once or as soon as its definition is registered, and again after each profile loads. A forced widget skips the context gate and the developer tools gate, docked, floating and popped, and a forced kit widget lets its kit past the kit's `devOnly` and `requires` gates. The list replaces the previous one, and `widgets.force([])` ends forcing. An app reads its own flag, such as a `--widgets=` argument, and passes the ids. The review checks a forced kit widget past its gate (`kit-forced-opens`, `kit-forced-released`).
- 19b7a49: Brock moves to Tessera ^0.41.0, and a `volume` title bar item is now Tessera's volume bar item: a 28 px volume control whose slider opens on hover or focus, and a click on it mutes. Once it folds, the main menu holds a Mute or Unmute row and a slider row. The spec is unchanged (`kind: 'volume'`, `label`, `value` from 0 to 1, `muted`, `onChange`, `onMuteToggle`, `shortcut`), and Brock calls `onMuteToggle` when Tessera asks for the other muted state. The review's `volume` step now also checks that hover or focus opens the slider and that moving it changes the volume, and the narrow menu must hold both rows. Apps upgrade with `brock migrate`.
- 19b7a49: Breaking: a `volume` title bar item no longer takes `labels`, and brock-react no longer exports `TitleBarVolumeStrings`. Tessera's volume bar item draws the Mute and Unmute labels from its own strings, so an app that passed `labels` removes it. The `volume-item-labels` migration (0.59.0) leaves a to-do where `labels` sits in a file with a volume item, and on each use of `TitleBarVolumeStrings`.
- e886c2a: A Developer submenu in Widgets, and menu placement for widgets and kits. Every `devOnly` widget and every `devOnly` kit now sits in Widgets > Developer (key `widgets-developer`), so a developer kit reads Widgets > Developer > its label > Open kit, its widgets, its overlays and Reset kit layout. Developer shows only while developer tools are on, and it is left out when nothing goes in it. `WidgetMeta` and `WidgetKitMeta` take `menu: { parent, group, order }` (the `WidgetMenuPlacement` type), placed like the same fields of `product.menu.entries`. When a widget, a kit or Developer names a `parent` that no entry has, in its meta or in `product.menu.entries`, that submenu is made inside Widgets, labelled from its key (`audio-tools` reads Audio tools), and the menu config renames or moves it by that key; `parent: 'widgets-developer'` files any widget or kit under Developer, and `parent: null` in the config keeps a `devOnly` one out. `brock structure` accepts `menu` in widget and kit files and reports a placement with an unknown field or a wrong value. The review registers a `devOnly` widget and kit and checks that Developer lists them with the kit as its own submenu, and, in a packaged review, that Developer is gone while developer tools are off; each `devOnly` app kit gets an `app-kit-<id>-in-developer` check.
- ea30589: `product.icons.wordmark` takes `rendering`: `'auto'` (the default, smooth scaling) or `'pixelated'`, for pixel art that should scale with hard pixel edges. With `{ src: './logos/wordmark.png', rendering: 'pixelated' }`, About, the boot splash page, the window's failure splash and the Setup splash draw the wordmark with `image-rendering: pixelated` (nearest neighbour on the Setup splash); without it nothing changes, since most logos look wrong pixelated. `defineProduct` keeps `rendering: 'pixelated'` on the resolved wordmark and refuses any other value. `AboutPanel` takes `wordmarkRendering`.

### Patch Changes

- ea30589: A wide `product.icons.wordmark` now fits the About card. Before, the image frame had a fixed `--size-48` height, so it was as wide as the picture at that height, and the centred heading grew to that width: a wordmark wider than the card was cut on both sides, and at a narrow window the whole panel spilled out of the card. The panel now takes the width it is given, up to `--size-448`, and the image fills it with its height following its proportions up to `--size-48`, centred, so any wordmark fits however wide it is. The review checks it: `about-wordmark-fits` fails when the wordmark's left or right edge passes the card's. The splashes already fitted it and are unchanged.
- 4cdb713: Screenshots no longer catch a loading spinner. Each lazy load (a lazy screen, widget, title bar item or tour) now holds the screenshot from its start until it settles and a frame has painted, so `--screenshot` waits for it like any other hold. The review's own captures (`review:capture`, `review:captureWidget`, `review:captureGroup`) now wait for the same holds too, up to 10 s; a hold still open then fails a `capture-holds` check for that step and the capture goes ahead.
- 4cdb713: A page now hides an open widget kit. Opening Home or any screen while a kit is open used to draw the page inside the kit's main cell, with the kit's widgets, overlays and bar still around it. Now the kit steps aside like a context-only widget: its docked and floating widgets, its overlays and its bar are hidden, the kit stays open with its layout untouched, and it comes back as it was when the page closes. Its popped windows follow the normal popped rule on a page. The review checks it (`kit-page-hides`, `kit-page-returns`).
- Updated dependencies [ea30589]
  - @drizztdourden08/brock-core@0.59.0

## 0.58.0

### Minor Changes

- c4b9b7d: A volume control for the title bar, and an app volume store. A title bar item takes `kind: 'volume'` with `label`, `value` (0 to 1), `muted`, `onChange` and `onMuteToggle`: its icon gains sound waves as the level rises, in the primary tone, and turns to the red `volume-x` when muted or at 0; a click mutes and unmutes, and once it folds the main menu lists it as Mute or Unmute with the level as its subtitle. `useVolumeStore` holds `value`, `muted`, `setValue`, `setMuted` and `toggleMute`, saved per profile in `ui-views.json`, and `volumeTitleBarItem()` binds an item to it, so `src/title-bar/volume.action.ts` is `export default volumeTitleBarItem();`. An app that keeps the level in its own state passes `volume` on `BrockApp` or a module: a `{ get, set, subscribe }` binding, or `volumeFromSettings({ value: 'audio.master', muted: 'audio.muted', max: 100 })` for settings keys; the store and the item then read and write through it. The review checks each volume item: shown, muting and unmuting on click, and folded into the menu at the minimum window width. The slider on hover waits on a Tessera volume bar item. Brock moves to Tessera ^0.40.1.

### Patch Changes

- @drizztdourden08/brock-core@0.58.0

## 0.57.0

### Minor Changes

- 0b699d7: Brock moves to Tessera 0.40.0, which adds `newDisabled` on ItemList and a shared `useUndo` stack. Apps upgrade with `brock migrate`.

### Patch Changes

- Updated dependencies [2bf0884]
  - @drizztdourden08/brock-core@0.57.0

## 0.56.0

### Minor Changes

- 1c0b1b6: Brock moves to Tessera 0.39.0 and draws the dates it shows with Tessera's `DateText` and `formatDate`.

  - The Profiles screen shows when each profile was last used with `DateText` in the relative format (5 minutes ago, Yesterday, Last week), with the full date on hover, and keeps it up to date while the screen is open. Before, it read 5m ago, 3h ago and 2d ago, and did not update. A profile never used still reads Never.
  - The Logs widget and the job dialog log draw their time gutter through `formatDate`, as a 24 hour clock with seconds in the user's locale. The new `formatLogTime(timestamp)` gives the same text for an app's own log panel. The copied debug text and the bug report keep `formatClockTime`, so the text they send does not change.
  - The updater's version list reads each release date with `formatDate` in the `date` format (Oct 16, 2026 in English), in place of the browser's short numeric date.
  - The hub header search box uses Tessera's `grow={false}` in place of Brock's fixed 224 px width, so it is 256 px and narrows to 160 px beside the other header actions. The `header-actions__search` class is gone.

  No date Brock stores or sends over IPC changes. An app on Tessera 0.38 runs `brock migrate --tessera-from 0.38.0`; migrations 252 and 253 have no renames.

### Patch Changes

- @drizztdourden08/brock-core@0.56.0

## 0.55.0

### Minor Changes

- d974d98: Widget kits are exclusive, and kit widgets can pop out. Brock moves to Tessera 0.38.0.

  One kit is open at a time: opening a kit closes the open one first, with its popped windows. While a kit is open, the normal widget entries and Reset layout in the menu stay enabled. Opening a normal widget, from the menu, a shortcut, `widgets.open`, `widgets.toggle` or `widgets.popOut`, closes the kit first and brings the normal layout back with that widget open. Reset layout closes the kit too. The normal widgets still step aside while a kit is open.

  The widgets API now reaches kit widgets. `widgets.open(id)` on a kit widget, and the new `widgetKits.openWidget(id)`, open its kit, closing any other, and show the widget even if the user had closed it in the kit layout. A widget already shown stays as it is, so a list of ids opened one by one, such as an app's startup flag, opens them all. `widgets.toggle`, `widgets.close`, `widgets.popOut` and `widgets.isVisible` work on kit widgets the same way. Before, `widgets.open` on a kit widget did nothing.

  A kit widget with `popOut` pops out into its own window like a normal widget, and the window belongs to the kit layout. Closing the kit by any route closes its windows, and reopening the kit brings them back popped or docked as they were left. Saved kit layouts now keep their popped widgets, per profile. Each kit widget gets its kit id as its Tessera `group`, so it never tabs or splits with a widget of another group, and a popped kit widget dragged back over the app is offered only to its kit.

  From Tessera 0.38.0: a widget's `chrome` (`full`, `compact` or `none`) is a widget meta field (`meta.chrome`, checked by `brock structure`). It applies docked, floating and popped. Floating widgets snap to the stage edges, the main view and each other (`floatSnap`, 10 px). The template's Layout inspector widgets use `chrome: 'compact'`.

  The review's `kits` step covers one kit at a time, a normal widget closing the kit from the menu and the API, `widgets.open` opening a kit widget's kit, the compact chrome, and a kit widget popping out, closing with the kit and coming back when it reopens.

  The review's bug report step moves the pointer off the title bar button after its click: with Tessera 0.38 a press shows the button's hint, which takes the first Escape.

### Patch Changes

- @drizztdourden08/brock-core@0.55.0

## 0.54.0

### Minor Changes

- 8a06415: Widget kits: a group of widgets that opens and closes as one unit, keeps a layout of its own and never mixes with the normal widgets. `src/widgets/<id>.kit.ts` default-exports its `WidgetKitMeta` (`label`, `icon`, `order`, `devOnly`, `requires: { context, reason }`, `layout`), a widget joins it with `kit: '<id>'` in its `meta`, and `src/widgets/<id>.overlay.tsx` draws a layer over the main view while the kit is open. `brock sync` writes `.brock/widget-kits.ts` (`appWidgetKits`) for every app, and `BrockApp` takes it as `widgetKits`. `defineWidgetKit`, `registerWidgetKits`, `RendererModule.widgetKits`, the `widgetKits` calls (`open`, `close`, `toggle`, `reset`, `active`, `isOpen`) and `useWidgetKitStore` cover kits made in code.

  Each kit is a sub-menu of Widgets with Open kit or Close kit, its widgets and overlays, and Reset kit layout. While a kit is open, the dock holds only the kit's widgets around the main view, with the same docking, tabbing, floating, snapping and resizing as any widget. The normal widgets and their popped windows step aside and come back when the kit closes. One close in the menu, a bar at the top of the main view and `widgetKits.close()` each close the whole kit, and each widget's own close button still closes that widget alone. A kit whose `requires` context is inactive opens on a card with its reason in place of its widgets, and draws them as soon as the context turns active. Each kit's layout and hidden overlays are saved per profile in `ui-views.json` under `widgetKits`.

  A widget can now put its own buttons in its title strip: `tools` in `meta` (a component) or `defineWidget` (`() => ReactNode`), docked, floating or popped.

  The review has a `kits` step. It checks the gate reason, that a kit opens and closes together, that kits and normal widgets never mix, that each kit's layout is saved and restored, and that overlays live and die with their kit. It also captures every app kit as `kit-<id>`. `brock structure` checks kit and overlay files and every `meta.kit`, and lint lets them default-export. The `widget-kits-prop` migration (0.54.0) adds `widgetKits={appWidgetKits}` to `src/main.tsx`. The template ships a small `inspect` kit: a Grid widget with a reset tool in its title strip, a Pointer widget and a grid overlay.

### Patch Changes

- c34bf5c: The main menu draws a line above Quit, so Quit stands apart from Credits and About in every configuration, with View hidden or tucked included.
  - @drizztdourden08/brock-core@0.54.0

## 0.53.0

### Minor Changes

- 60cb320: Five additions to the bug report. `bugReport.open({ title })` and `bugReport.setDefaultTitle(title)` prefill the title, cleared when the dialog closes. `section` in `BrockApp`'s `bugReport` is a component the dialog renders below the attachments; it gets `setExtras` and `disabled`, and what it sets joins the payload's `extras`. `transport` is now optional there, so an app with a main transport can still add a section. `identity` beside a transport (a string in `BrockApp`, `identity(ctx)` in `bootstrapApp`, reported as `BugReportTransportInfo.identity`) shows "Reporting as <identity>" in place of the contact field. A receipt's `links`, `{ label, url }[]`, each get a button in the receipt view, with the single `url` still shown as Open. A receipt's `retry` shows Retry upload in the receipt view, even for a toast transport; a main transport's `retry` stays in main and runs over the new `bugReport:retry` channel, the renderer getting a `retryId` in `BugReportReceiptWire`. The review checks the prefilled title.

### Patch Changes

- Updated dependencies [60cb320]
  - @drizztdourden08/brock-core@0.53.0

## 0.52.1

### Patch Changes

- 0856664: The review's `floating-widget-min` check no longer fails in a small window. A floating widget can't be larger than the main view it floats in, so shrinking it stops at its 240 by 160 minimum or at the main view's size when the view is smaller, and the check now expects that smaller size. Its failure message gives the main view's size. The widget sizing itself is unchanged: it keeps its minimum whenever the main view is big enough, and a widget squeezed by a small window comes back to its saved size when the window grows.
  - @drizztdourden08/brock-core@0.52.1

## 0.52.0

### Minor Changes

- 1477d7f: Moves to Tessera ^0.37.4. With View hidden, the `window-pin` and `window-fullscreen` menu keys work again: they reach the tucked Pin on top and Full screen rows of the main menu through the title bar's `tucked` prop. `label` renames the row in both states, and the new `activeLabel` field, taken by these two keys only, is its text while the window is pinned or in full screen. `group`, `order`, `before` and `after` place the row as they place View, and `hidden: true` or `inMenu: false` leaves it out. `brock check` warns again when View, Pin on top and Full screen are all out of the menu, since a narrow window then has no way to reach them, warns when either key is set while View is shown, since it then has no effect, and reports an `activeLabel` on any other key.

### Patch Changes

- Updated dependencies [1477d7f]
  - @drizztdourden08/brock-core@0.52.0

## 0.51.1

### Patch Changes

- 024e1b8: Moves to Tessera ^0.37.3. With View hidden, the title bar now lists a tucked pin and full screen button in its own main menu, so Brock drops its own `window-pin` and `window-fullscreen` entries and stops reading the bar's markup for tucked buttons. Pin and full screen are plain actions with no check mark. The `window-pin` and `window-fullscreen` menu keys are still accepted without an unknown key warning, but Tessera takes no label or place for these rows, so the keys no longer rename, move or hide anything. `brock check` no longer warns when View, Pin on top and Full screen are all out of the menu, since the tucked buttons now always stay in the menu.
  - @drizztdourden08/brock-core@0.51.1

## 0.51.0

### Patch Changes

- @drizztdourden08/brock-core@0.51.0

## 0.50.0

### Minor Changes

- 7230540: The View sub-menu now takes the whole menu config, not just a label. In `product.menu.entries.view`, `hidden: true` or `inMenu: false` leaves View out of the menu, and `group`, `order`, `before` and `after` place it like any other entry. Other entries can also be placed before or after `view`. Brock works out View's group and index from the effective menu and passes them to Tessera 0.37.2's `WindowTitleBar` `view` option. Left untouched or only renamed, View stays where it was. View still can't take a `parent`.

  On a narrow window, the title bar tucks its pin and full screen buttons away into View. With View hidden, Brock adds Pin on top (`window-pin`) and Full screen (`window-fullscreen`) to the menu in View's place while a button is tucked away. They can be renamed, moved or hidden like any entry. The bar button and the menu entry share one pin state.

  `brock check` no longer rejects a placed or hidden View. It still reports a `parent` on `view`. It warns, without failing, when `view`, `window-pin` and `window-fullscreen` are all out of the menu. The review no longer expects a View sub-menu when the config hides it, and checks a moved View between its neighbours. brock-react's Tessera peer range is `^0.37.2`.

### Patch Changes

- @drizztdourden08/brock-core@0.50.0

## 0.49.0

### Minor Changes

- a0eedd2: A bucket's header backdrop can be a component: `src/screens/<bucket>/<bucket>.backdrop.tsx` default-exports it, and `brock sync` lists it in `.brock/screens.ts` as a `backdrop` entry loaded with `lazyComponent`. `buildScreenTree` makes it the bucket's `{ kind: 'node' }` backdrop inside a `Suspense` with no fallback, and its load joins the preload of the hub home and of every page, tab and sub-page of the bucket, so a bucket switch pill, a menu row or a hub nav entry on hover or focus and the boot preload load it before the header draws. It wins over `backdrop` in `screens.config.ts`, and a page's `meta.backdrop` still wins over both. `brock structure` reports a backdrop file not named after its bucket or outside its bucket folder, a bucket folder holding only a backdrop, and a bucket that has both the file and the config field; the file takes a `<bucket>.backdrop.constants.ts`. The lint config treats it as a screen file (a default export). brock-react exports the `BackdropEntry` type.
- 7f76f4f: New job options for `ctx.job` and `jobs.start`:

  - `visible: false` runs a quiet job. It reports progress like any other job and its snapshot carries `visible: false`, but it stays out of the title bar item and the job dialog. It clears itself 30 s after it ends, whether it succeeded, failed or was cancelled. Every `JobSnapshot` now has `visible`.
  - `forwardLog: true` also writes the job's log lines to the app log as `[job <id>] <message>`. A main job writes through `ctx.log`, a renderer job to the `app` channel. The app log keeps the lines after the job is gone.
  - `onDuplicate` sets what starting an id that is still running does. `'throw'` is the default and keeps today's "already running" error. `'queue'` starts the new job under the same id once the running one ends. `'parallel'` starts it under the first free `<id>-2`, `<id>-3` and so on. `'join'` returns a handle on the running job, whose `run` resolves with that job's result instead of running the work again.

  `JobHandle` gains `started` (resolves once the job runs) and `ended` (resolves with `done`, `failed` or `cancelled`), so a hand-written `JobHandle` fake needs both. `createJobRegistry(emit, now?, sink?)` takes a sink for the forwarded log lines. `useJob(id)` also returns `step`, the current step with its label, beside `job`, which is `null` when no such job is known. It follows main and renderer jobs alike, so a page can show a job's progress inline.

- 9ff1b40: The app can now change the title bar menu Brock builds, entry by entry, while the detected menu stays the default. `product.menu.entries` in `brock.config.ts` and the same object in a screen's `meta.menu` take, per entry key, `inMenu: false` (out of the menu only, still reached by the search palette, its route and its shortcut), `hidden: true` (out of the menu, the search palette and the keyboard shortcuts, still openable from code by its route), `label`, `group` (`'main'`, `'sections'`, `'modules'` or `'end'`), `order` (like CSS `order`, 0 by default), `before` and `after` another entry's key, and `parent` (a submenu's key, or `null` for the top level). They merge in that order, the app config last. Every built-in entry, section, bucket, page, card and module entry has a stable key; docs/app-structure.md lists them. The View sub-menu takes only a label, since the title bar draws it.

  `brock check` reports a field it does not know, a wrong value, a `bucket:` or `screen:` key no screen file gives, an entry that names itself and a `before` and `after` loop; a development launch logs the rest once each, such as a key no entry has or a parent that is not a submenu. Nothing throws: an override that cannot apply is skipped.

  With no active profile, every menu entry that opens a screen needing a profile now shows as disabled with the reason, Pick or create a profile first, as Home already did, instead of looking enabled and opening nothing.

  The review's menu checks follow the effective menu: the built-in entries and the last group are read where the overrides put them, a hidden screen is no longer expected in the menu, each overridden entry gets a `menu-entry-<key>` check that it is out of the menu, or drawn at its place between its neighbours, and each hidden entry a `search-hidden-<key>` check that the palette does not list it.

- a0eedd2: Hub page headers draw their backdrop through Tessera's `BackdropLayer` (Tessera's `backdropStyle` paints an image or a colour), and Brock's own `HubBackdrop` part, its `backdrop-style.ts` and the `.hub-backdrop` classes are gone; style `.backdrop-layer` if a hub needs more. A node backdrop now fills the layer the way it fills a Hero. A `.hero.tsx` sets `meta.hero.size` (`'compact'`, `'default'` or `'tall'`, new `HeroMeta` type) and the hero frame passes it to Tessera's `Hero` as `size`.

### Patch Changes

- 35fbe2d: Screens now preload from Tessera 0.37.1's `onHighlight` instead of matching the hovered row's label text. Every title bar menu item that opens a screen, every hub nav entry, every hub switch pill and every search palette row with a target preloads the route it opens when it is pointed at, focused, reached with the arrow keys or, in the palette, becomes the active row. Two rows with the same label, a renamed menu entry and a moved one each load their own screen. `usePreloadOnHover` and its label lookup are gone.
- f0510ca: Tessera 0.37.1 draws the splash wordmark. `BootFailureSplash` passes `product.icons.wordmark.dark` to Tessera's `Splash` as `wordmark`, so the heading is a real image named by the app name, and its own `BootFailureSplash.css` and wordmark helpers are gone. The static splash page writes `<img class="ts-wordmark">` and drops Brock's `.splash__wordmark` rules for Tessera's. Both splashes look as before. brock-react's Tessera peer range is `^0.37.1`.
- Updated dependencies [7f76f4f]
- Updated dependencies [9ff1b40]
  - @drizztdourden08/brock-core@0.49.0

## 0.48.0

### Minor Changes

- 367a4cb: Screens, widgets, title bar handlers and tour steps load on first use, so a dev boot loads only what the shell draws. `.brock/screens.ts`, `.brock/screens.dev.ts` and `.brock/widgets.ts` import each file's `meta` and hand its component over as `lazyComponent(() => import(<file>))`; settings pages stay eager. A new renderer Vite plugin, `brock-meta-modules`, serves those meta imports from `<file>?brock-meta`: the file cut down to its `meta` and `order` exports and what they reach, read with TypeScript and never run, falling back to the whole file when it cannot be cut. The authoring convention does not change. brock-react adds `lazyComponent`, `lazyLoads` (`track`, `idle`, `isIdle`, `pending`), `preloadRoute` and `LazyHost`, one Suspense boundary with a delayed Tessera spinner around the screen content in `ScreenHost`, the page body in `HubPageFrame` and the widget body in `WidgetBody`. The shell preloads the base and home screens at mount, `first-frame` waits for the loads it started, and pointing at or focusing a menu row, a hub nav entry or a bucket pill preloads that screen or page. A title bar `button` spec with literal looks becomes `lazyTitleBarButton(look, load)` and loads its handler on the first click; a tour with a literal title becomes `lazyTour(shell, load)` and loads its steps when it starts (`tours.load(id)`, and `TourDef.load`). The review's settle step and the search jump wait for lazy loads. Top-level code in a screen or widget file now runs when it first loads, not at boot. Production builds one chunk per screen and widget.
- 33e371e: Tessera 0.37: the backdrop types are `Backdrop` and `BackdropFit` (they were `HeroBackdrop` and `HeroImageFit`).

### Patch Changes

- @drizztdourden08/brock-core@0.48.0

## 0.47.0

### Minor Changes

- 6ead199: A product wordmark. `product.icons.wordmark` names the app's name drawn as an image, an SVG or PNG under `public/` given as a path like the logos (`'./logos/wordmark.svg'`), or `{ src, dark }` with a variant for the dark splash ground. `defineProduct` resolves it to `{ src, dark }` (`dark` defaults to `src`, new types `ProductWordmark`, `ProductWordmarkInput` and `ProductIconsInput`) and refuses a file that is not `.svg` or `.png`. When it is set, the boot splash and its failure screen, the window's failure splash (`BootFailureSplash`) and the Setup splash `brock package` renders show the `dark` image in place of the name text, and the About window shows `src` as its heading (`AboutPanel` takes `wordmark`). The image keeps the name as its accessible name. Unset, nothing changes. The splash page uses `ts-wordmark` ahead of Tessera shipping it and sizes the image itself until then; the window's failure splash paints the image over the name text until Tessera's `Splash` takes a wordmark image.
- 7923723: `<BrockApp profiles={{ onBeforeRemove }}>` runs before a profile is removed, after the delete confirm. It gets the profile, may be async, and keeps the profile when it returns `false` or throws (the error is logged), so an app can stop the work tied to that profile, such as a running session, or refuse while it runs. `profileRemoval.add(fn)` registers one from outside React and returns the remove call. `useProfiles().removeConfirmed(profile)` now resolves `true` when the profile was removed and `false` when a hook kept it.

### Patch Changes

- 7923723: Deleting the active profile no longer leaves a blank window where Escape and Home do nothing. When other profiles remain, the most recently used one becomes active and the user stays on the screen they are on; only when the last profile goes does the app open the profiles route (`product.profilesRoute` when set, else the `profiles` screen). Deleting a profile that is not active changes neither the active profile nor the screen. With no active profile and a home screen that needs one, Escape with nothing open opens the profiles route, Escape on that route keeps it open instead of closing it to an empty window, and the Home menu entry shows as disabled with the reason, Pick or create a profile first.
- Updated dependencies [6ead199]
  - @drizztdourden08/brock-core@0.47.0

## 0.46.0

### Minor Changes

- b1026b9: `pickFile({ anyType })` takes a host or form factor (`'mobile'`, `'desktop'`, `'electron'`, `'capacitor'`, `'web'`) or a map of them such as `{ mobile: true }`, and drops the type filter only there, so a phone opens the picker unfiltered while the Electron picker keeps its filter. A host key wins over the form factor key. `true` still drops it on every host. `anyTypeFor(anyType, info)` from brock-core resolves the value.
- 025bcf7: A hub header backdrop. `backdrop` on a bucket in `screens.config.ts` (or on a `defineHub` def) draws behind the header of every page of the hub, and `backdrop` in a page's `meta` overrides it for that page and its sub-pages. It takes the shape of a hero backdrop: `{ kind: 'node', node }`, `{ kind: 'image', src, fit?, position?, tileSize?, color?, pixelated? }`, `{ kind: 'color', color }` (a CSS colour or a token name such as `'--c-secondary'`), or `{ kind: 'none' }` to draw no art. `HubPageFrame` passes it to Tessera's `ScreenPage` and `SettingsPage` and through the settings page context, so settings pages get it too; without one the header keeps Tessera's art.
- c68c54a: One menu per hub, and only when it helps. A bucket in `screens.config.ts` (or a `defineHub` def) takes `nav: 'auto' | 'always' | false`, `'auto'` by default: the hub draws its side nav only while two pages or more are shown, and with one page shown it draws that page alone, with no side nav and no hub search field. The nav comes back as soon as a `when` rule, a host rule or developer tools show a second page. `'always'` keeps the old look for one page, and `false` never draws the nav. Back, the history and Escape (up to the hub home, then closed) work the same without the nav. The review's hub checks pass a hub with no nav: `<hub>-pages` checks that no nav is drawn, each page opens with `open` instead of its nav entry, and the hub search runs in the first hub that has one.
- 025bcf7: Credits, About and Quit close the menu. They were split, with only Quit in the menu's last group, so the View sub-menu and the title bar actions landed between About and Quit. Credits, About and Quit now form the last group, in that order, in every app. The review's menu step checks it (`menu-ends`).
- 025bcf7: The app names its profiles route, and a bucket can open without a profile. `product.profilesRoute` (for example `'data/profiles'`, a hub page) makes every way to the profiles screen land there: the Profiles menu entry, the `profiles` boot task (no profile, an unknown pinned profile, several profiles and no last one), deleting the active profile through `useProfiles` and `open('profiles')`. Brock's own `profiles` screen is then not registered, and `ProfilesScreen` closes the hub after a pick on that route. Unset, nothing changes. `requiresProfile: false` on a bucket in `screens.config.ts` (or a `defineHub` def) lets its hub open while no profile is active, so a first run can reach that page to create a profile.
- b1026b9: Asset jobs run in a renderer Web Worker too, with no main process. `runAssetWebWorkerJob(options)` from `@drizztdourden08/brock-port-kit/renderer` takes the options of `runAssetWorkerJob` with the worker constructor of a `?worker` import, and the Web Worker serves the steps with `serveAssetSteps` from the new `@drizztdourden08/brock-port-kit/web-worker` entry. One `AssetWorkerSteps` object serves both sides: each step now gets the job's `workerData` as a third argument (the thread's `workerData` in Node, posted once to a Web Worker). The job is a renderer job: `jobs.start(id, steps, options?)` from brock-react returns the same `JobHandle` as `ctx.job`, its snapshots go into the job store, so the job dialog and the title bar show it on every host, and `jobs.cancel` and `jobs.dismiss` reach it. The job registry moved to brock-core (`createJobRegistry` and the `JobHandle`, `StartJob`, `JobRegistry` types from `@drizztdourden08/brock-core/jobs`); brock-electron re-exports the types as before.
- c68c54a: App state in show rules. `<BrockApp showFlags={{ signedIn }}>` passes the app's own flags to every `hosts` and `when` rule as `ctx.flags`, so a page, a bucket, a card or a menu entry can show only while, say, the user is signed in: `when: ({ flags }) => flags.signedIn === true`. `useShowFlags({ ... })` adds flags from any component while it is mounted, which is how a module contributes them from its `Provider`; the app's prop is applied last. When a flag changes, the menu, the hub nav, the search palette, the bucket switch, the rail, the shortcuts and the open screen evaluate again. `ShowFlags` in `@drizztdourden08/brock-core/augment` types the flags. `ShowContext` now has `flags`, so code that builds a `ShowContext` by hand for `isShown` adds `flags: {}`.
- 56201a6: Tessera 0.36, and small informational windows. A card whose meta sets `size: 'info'` opens like About: a small window sized to its content and centred, at most `--size-512` wide and at most the window's height, with no page header (the window title bar names it) and its content scrolling inside; under 560 px wide it fills the window. Brock passes it to Tessera's `ScreenWindow` as `size="info"` (`ScreenDef.size`, `ScreenSize`). The built-in Credits screen and the template's `credits.card.tsx` open this way. About opens small on its own: Tessera's `InfoScreen` now always opens at `size="info"`, and its `width` prop is gone (Brock never used it).
- 025bcf7: Title bar items in the order an app chooses. A `src/title-bar/<id>.action.ts` file may export `order` (`export const order = 2`) or `meta: TitleBarItemMeta` with `order`, as screens do; `brock sync` carries it into `.brock/title-bar.ts`, and `titleBarFromFiles` puts the items with an order first, in that order, then the rest by id. Files without one keep the id order, so renaming files to order them is no longer needed.
- c68c54a: The browser host detects a phone. It reported `formFactor: 'desktop'` everywhere; it now reports `formFactor: 'mobile'` where a coarse pointer meets a narrow viewport (at most 767 px wide, or 500 px high for a phone held sideways) and `input: 'touch'` for a coarse pointer, and `PlatformProvider` follows both media queries, so the info changes with the viewport. `when` rules on `formFactor`, mobile-only settings tabs, the `platform-mobile` class and the search index now work in a phone's browser as they do in the Capacitor app, and the browser file picker reads the form factor when it opens, so `anyType: 'mobile'` drops its filter in a phone's browser too.

### Patch Changes

- Updated dependencies [b1026b9]
- Updated dependencies [025bcf7]
- Updated dependencies [b1026b9]
- Updated dependencies [c68c54a]
  - @drizztdourden08/brock-core@0.46.0

## 0.45.1

### Patch Changes

- @drizztdourden08/brock-core@0.45.1

## 0.45.0

### Minor Changes

- a85efb2: The Capacitor host reports the edge of the back gesture: `device.onBackButton` gets `left` or `right` from the `brock:back` event the Android `MainActivity` dispatches, and the app exits when nothing listens. The Android scaffold writes that activity in place of Capacitor's empty one (with `android:enableOnBackInvokedCallback` in the manifest), and leaves an activity with code of its own alone; run `platform add android` again to add it to an existing app.
- a85efb2: The Storage page works on a phone: `<BrockApp dataDomains>` gives the renderer the app's data domains, the Capacitor storage port sums each one through the Filesystem plugin, and the page shows the data folder and each domain's size and item count with no action the phone cannot run. `setDataDomains` and `rendererDataDomains` are exported.
- ef96908: `filePicker.pickFile({ extensions, anyType: true })` opens the picker with no type filter, for a file whose extension the system has no type for (Android's picker greys such a file out); the app then checks the name it gets. Without `anyType` every host filters by `extensions` as before.
- a85efb2: `product.window.titleBar.mobile: false` leaves the title bar out on a mobile form factor, for an app that draws its own phone chrome; it stays on the desktop, and the default keeps it everywhere.

### Patch Changes

- Updated dependencies [ef96908]
- Updated dependencies [a85efb2]
- Updated dependencies [aba2001]
- Updated dependencies [fb41dd1]
  - @drizztdourden08/brock-core@0.45.0

## 0.44.0

### Minor Changes

- 126c8e8: Tessera 0.35: DensityScope and the parts that replace the last app-side styles of a part.

### Patch Changes

- Updated dependencies [716553d]
  - @drizztdourden08/brock-core@0.44.0

## 0.43.0

### Patch Changes

- @drizztdourden08/brock-core@0.43.0

## 0.42.0

### Minor Changes

- 67c7a66: Tessera 0.34: Rating, Carousel and MediaViewer are available to apps.

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
- 9b081a6: A Capacitor host. On Android or iOS brock-react fell back to the web factory: no file store, `formFactor: 'desktop'`, no title bar, and `ports.capacitor` of a module was never read. It now builds a `capacitor` platform over the app's Capacitor plugins (Filesystem, App, Haptics, KeepAwake, by name): the app's files persist in the app data folder, the device port drives the back button, pause and haptics, `formFactor` is `mobile`, and module ports for `capacitor` are merged in. A new capability, `titleBar`, draws the title bar with its menu on a phone, while `windowChrome` keeps the window buttons to Electron; it is optional on `Capabilities` and reads as true when a custom platform factory leaves it out, so existing factories keep their bar. ui-views persist through the Capacitor file store, so they survive a restart on the phone.
- ae74556: Three main-side hooks for app data and sound. `bootstrapApp({ fileGuard })` is asked before each write of the base `file:*` handlers (`writeBytes`, `writeText`, `remove`, `mkdir`, `trash`) with `{ kind, path }`, and refuses the write when it answers `false` or a reason. `FileStore.trash(path)` now reaches the renderer too (`file:trash`, the Electron `files` port). `createNodeFileStore({ trashItem })` takes the function that moves a full path to the trash, so the store imports no Electron; `ctx.files` passes Electron's `shell.trashItem`, and a store made without `trashItem` has no `trash`. `window:setAudioMuted` and `window:isAudioMuted` mute the app window and read it back, also as the window port's optional `setAudioMuted` and `isAudioMuted`.
- efce654: `meta.keepMounted` on a hub page keeps it mounted, hidden, while another page of the same hub is open, so a running view keeps its state when the user looks at another page and comes back. On a card screen the same meta sets the screen's `keepMounted`.
- efce654: `MenuItem.useDisabled`: a hook that disables a menu entry while it returns `true`, for a module or app entry that depends on live state. The shell calls these hooks each render, so the title bar menu and the palette show the current state.
- ae74556: The renderer writes its log to `Data/debug/session.log` and catches what nothing else did. `BrockApp` sends the app log there in batches through `debug:appendSessionLog` (the channel existed with no writer), and turns uncaught errors and unhandled promise rejections into error entries of the app log, in the main window and in each widget window. `sessionLog={false}` stops the writing; `catchGlobalErrors` and `writeSessionLog` are exported for an app with its own log bus.
- fb285af: `--screenshot` waits until the app is ready to be pictured, and pictures the current frame. The renderer takes a hold with `holdScreenshot()` (or `useScreenshotHold(holding)`) while something it draws is not ready, such as a game view before its first frame; main waits for the reveal and then for every hold to be released, within the same 20 s watchdog. The capture now comes from the window's surface through the debugger (`Page.captureScreenshot`), since `capturePage` returned a stale frame for the headless window placed off every monitor; it falls back to `capturePage` when the debugger is taken.
- 73d8f8c: Settings: a normalise hook, a patch transform, a row predicate, disabled options and two control kinds. `settings.normalise(settings, stored)` mends what a profile loads before anything reads it; `settings.transformPatch(patch, settings)` rewrites every patch before it is applied, saved and seen by the effects. An item's `visible(settings)` leaves its row out of the page and the searches while it returns `false`. A choice option takes `disabled: true` or a reason, drawn on Tessera's own segmented control, select or toggle group with the option off. `control: { kind: 'color' }` and `{ kind: 'multi', options }` draw Tessera's colour and multi-choice rows.
- efce654: Buckets, pages and cards shown per host or per profile. `hosts` and `when({ profile, host, formFactor })` on a bucket of `screens.config.ts` or in a screen file's `meta` hide it where they do not hold: no menu, nav, bucket switch, rail or search entry, no shortcut, and no screen on `open`. `when` runs again on a profile switch. A menu entry takes the same rule as `show`.
- ae74556: `ui-views.json` is written by key. Brock read the file once and wrote its whole copy back on every change, so a key the app wrote to the same file in the meantime was lost. The renderer now sends only the keys it changed over the new `uiViews:patch` channel (`patchUiViews`), and main merges them into the file on disk, one write after another. An app keeps view state of its own there with `uiViews.read(key, fallback)`, `uiViews.write(key, value)` and `uiViews.remove(key)` from brock-react; the `profile:` keys stay Brock's.
- 1f778fd: `widgetDisabled` on `BrockApp` and `WidgetHost`: a hook that returns `(id) => ({ message, settingId }) | null`, so a widget the app cannot serve right now (a session that is not running, a device that is not plugged in) shows Tessera's disabled overlay with the reason and a button to its setting, instead of being hidden. `settingId` is a route with an optional row after `#`, opened like a search hit.

### Patch Changes

- efce654: An app submenu named like a Brock menu section joins that section. A card or page placed with `meta.menu: 'Advanced'` made a second Advanced beside Brock's own, and the review's menu walk, which picks the first item with a label, went into the app's one, failed to find a module entry such as Controllers and left the menu open, so Escape closed the menu and the screen check failed (`<screen>-escape`). The app's entries now join the section, and the review closes the menu when a menu path it walks is not there.
- ae74556: An app may declare its own `window.api` type. brock-react read and wrote `window.api` through `Window & { api?: ... }`, so an app's `declare global { interface Window { api: AppApi } }` turned those casts into type errors inside brock-react's source, which the app's own typecheck reads. brock-react now reaches `window.api` through a holder type of its own and never through the global `Window`, and the log and widget layout globals do the same. An app types its extra `window.api` members by augmenting `IpcNamespaces` in `@drizztdourden08/brock-core/augment`, or by passing its maps to `hostApi<M>()`; a global declaration of its own keeps working too.
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
- 6d7da6d: Renderer extras reach the bug report transport. `useBugReportExtras(source)` or `bugReport.setExtras(source)` registers a function that returns a JSON-safe object; the dialog calls it when it opens and the payload carries the answer as `extras`, so a main transport (`bootstrapApp({ bugReport })`) gets what only the renderer knows, such as the open screen. A source that throws leaves `extras` out and the report still goes.
- c5fc205: A module settings tab no longer clashes with an app settings page or tab of the same id. The app keeps the plain id and the module tab moves to `<moduleId>.<tabId>` (`moduleTabId`), as does a module tab whose id an earlier module tab took. A module tab nothing else claims keeps its id, so existing links to it still open it. `mergeModules` now records `moduleId` on each module tab.
- 0a63f1f: Tessera 0.32: an outside press and Escape dismiss anchored parts, a hint that follows the pointer, disabled tabs with a reason, a held Disclosure, ListDetailLayout by share with a detail side that folds, and LogPanel row selection.

### Patch Changes

- 6d7da6d: `appOpen` hands a held launch request to every handler that subscribes before the next task, not only the first. A file or link the app was launched with used to reach one screen when two screens subscribed in the same render; now each gets it, and a handler that subscribes later does not see it again.
- Updated dependencies [472754d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [bdfc457]
  - @drizztdourden08/brock-core@0.39.0

## 0.38.0

### Patch Changes

- @drizztdourden08/brock-core@0.38.0

## 0.37.0

### Minor Changes

- 8eff741: Tessera 0.31: every menu with a button opens toward the side with room (TX-56), including the title bar and row menus.

### Patch Changes

- 12d3780: A production review copies its fixtures. Vite inlines a small file of `src/review/fixtures` as a `data:` URL in a production build, and the renderer's Content Security Policy refused to fetch it, so `launch --prod --review` (the CI review job) failed `fixtures-copied` with a console error. The review now decodes an inlined fixture itself.
  - @drizztdourden08/brock-core@0.37.0

## 0.36.0

### Minor Changes

- 273846f: The input and display modules run on Android. Each ships a Capacitor plugin in its package: `BrockInput` drives SDL3 inside the app through a JNI library built against the same pinned SDL3 source as the desktop addon, and takes controller keys before the WebView without any change to `MainActivity`; `BrockDisplay` reads the display's rates and asks Android for a synced one through the window's preferred refresh rate. `inputApi()`, `displayApi()` and `window.api.input` and `window.api.display` return the same API on Android as on the desktop, so app code does not branch; raw and joystick capture, the bundled mapping database and window modes stay desktop only (the module READMEs list each limit). `platform add android` and `mobile build` wire the modules in `modules` into the Gradle project, a built-in module left out of `modules` stays out through `android.includePlugins`, and `doctor android` asks for the NDK and CMake the input module builds with. brock-core adds `nativePlugin` and `listenNative`, brock-react adds `exposeHostNamespace`.
- e40fe59: An app ships only its own brand's palette. `BrockApp` no longer imports every Tessera brand palette; `brock sync` writes `.brock/palette.css`, which imports the palette of `product.icons.brand` (nothing when Tessera has no palette for the brand), and the app's `src/main.tsx` imports it right after Tessera's `tokens.css`. The `brand-palette-import` migration (0.36.0) adds that import to an existing app's `src/main.tsx` once, and leaves a to-do when the renderer entry is elsewhere. New apps from `create-brock` have the import, and its first sync writes the template brand's palette.
- aa74a6d: The bug report hands its payload to an app transport. Brock keeps the dialog and builds `BugReportPayload` (title, description, app id, name and version, and when attached the debug text, the host facts and the last 200 redacted log lines). An app passes `transport(payload) => Promise<Result<BugReportReceipt>>` as `<BrockApp bugReport={{ transport, label? }} />`, or in main as `bootstrapApp(product, { bugReport: { transport(payload, ctx), label? } })` over the new `bugReport:transport` and `bugReport:send` channels; with neither, the GitHub issue on `product.repo` stays the default and the clipboard the last resort. The send button carries the transport's label and spins while it runs; a receipt's message and link show in the toast, and a failure keeps the dialog open with the error so the user can try again. `writeDebugZip` and `collectDebugFiles` in brock-electron give a main transport the debug zip: the payload, the logs of `Data/debug` and the app's own entries. `useDebugText` also returns `system`.
- 5289e5d: New module `@drizztdourden08/brock-catalog` (`brock add catalog`): a content catalogue client. The app configures it once with `configureCatalog(ctx, config)`: its endpoint and headers, its schema validators, its routes, an installer per container, a size cap, an install link scheme and release hooks. The renderer reads the home, the whole list and one item over `window.api.catalog`; installs run as Brock jobs (`catalog-install:<id>`: grant, download, verify, unpack) that stream the download to a temp file, check its size and sha256 against the grant before anything is unpacked, and can be cancelled while they download; an update installs the new copy before it releases and removes the old one. The installed record lives in `Data/catalog/installed.json`, and `useCatalogInstalled`, `installedRecordOf` and `installedByName` give every screen the installed guard. Install links (`<scheme>://install/<id>?v=<n>`) are parsed strictly, held until the renderer takes them with `useCatalogLinks`, and taken from `ctx.onOpen` for the scheme the product declares in `product.protocols`. `CatalogInstallBar` draws install, update, uninstall and the live progress with Tessera parts; the app tree gains its answer under actions.
- 6f6977d: OS integration in the product config. `product.protocols` declares deep link schemes (`my-app://install/abc`), `product.fileAssociations` gains a default mime type and a shipped Windows icon, and a `product.schemes` entry with `dir` is served from `Data/<dir>` through `protocol.handle` (`app-media://` over `Data/media`). `defineProduct` checks all three lists.

  The installer registers them: on Windows the updater's Velopack hooks write and remove the `HKCU\Software\Classes` keys, and the installer stub runs `--os-integration=register` after a portable install; on macOS electron-builder writes Info.plist; on Linux the deb's `.desktop` file and mime XML come from electron-builder, the managed post-install refreshes both databases, and an AppImage writes its own entry under `~/.local/share`.

  The running app receives each link or file from argv at launch, from a second launch through the single-instance lock (taken when the product declares a protocol or a file type, never for a named instance or an automation launch; `bootstrapApp({ singleInstance })` overrides it) and from macOS `open-url` and `open-file`. After the reveal, main hands each `OpenRequest` to `ctx.onOpen` and `bootstrapApp({ onOpen })`, and the renderer gets it through `useAppOpen` or `appOpen.on` (`app:takeOpens`, then `app:open`).

- 3063895: `ReleaseNotesPanel` with `markdown` draws the note with Tessera's `Markdown` composite (Tessera 0.28): `size="sm"`, `headingOffset={2}` and `hideTitle`, so the `#` title is left out, the `##` sections are h4 under the panel title, now an h3, and lists and links keep their look. A link calls `onOpenLink`, `openExternal` by default, which opens it in the system browser; the update dialog passes `openExternal`. The run-time check for a Markdown primitive, the plain-text fallback for a markdown note and the `MarkdownPartProps` type are gone.
- b42b735: `ReleaseNotesPanel` takes `markdown` and `onOpenLink`. With `markdown` on, a string note is drawn as formatted text. Links go through `onOpenLink`, `openExternal` by default. The update dialog turns `markdown` on for the release note of the chosen version.
- 0f4133a: Brock moves to Tessera ^0.30.0 (the catalog and the `brock-react` peer range). Escape follows Tessera's escape stack: dialogs, menus, popovers, confirm asks, the tour and the search palette close there, one layer per press, and the shell takes Escape only while nothing above a screen is on the stack and no control consumed the key, so a hub still goes up a level before it closes and the `ScreenWindow` frame, which now closes on Escape itself, never closes a screen twice. The shell listens on the root element, ahead of Tessera's document listener; the palette registers at `dialog` and keeps a capture listener only to cancel its confirm ask. The built-in escape layers for the palette, the bug report, the shortcuts help and the update dialog are gone, since their Tessera dialogs register themselves. A failed load has one look, Tessera's `LoadError`: the render error boundary of every screen and widget shows it as a box with the raw error behind Details and Retry, which draws the part again, ahead of Reload page, Go home and Report a bug, and the Storage page shows one with Retry when the data folder cannot be read. `ErrorBoundary` is imported from `@drizztdourden08/tessera/composites`. The lines between dock panes are Tab stops since Tessera 0.30; the widget focus guard counts them as part of the dock, so dragging one leaves the focus with the app while a keyboard user can still tab to it and resize with the arrow keys.

### Patch Changes

- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

- cbbb865: Brock moves to Tessera 0.30.1: the workspace catalog and brock-react's peer range are `^0.30.1` (MIGRATION 215 to 218). `CommandPalette` is now on the escape stack itself, so Brock drops its capture phase Escape listener for the palette's confirm questions. Escape in the palette cancels a row's question first, wherever focus is, then clears the search text, then closes the palette. After a question ends, focus goes back to the button that asked, so the arrow keys and typing keep working in the palette. An app changes nothing.
- Updated dependencies [273846f]
- Updated dependencies [aa74a6d]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
  - @drizztdourden08/brock-core@0.36.0

## 0.35.0

### Minor Changes

- af0f5c5: Tessera 0.27: JobDialog sets `data-job-id` through the dialog's `data` prop instead of a marker in the title; aria labels on TagInput, Toggle and the field kits, Widget as a named region, a danger tone on MenuItem, RowGrid selected rows, FormRow description folding and one-line ItemList rows at narrow widths.

### Patch Changes

- @drizztdourden08/brock-core@0.35.0

## 0.34.0

### Minor Changes

- 80319dd: `readDockLayout(page).main` is now in window terms, like `rects`, and is the main view alone. It was measured from the dock corner, so it was off by the title bar, and it took in a neighbouring pane that does not make room. A test that compared `main` with `rects`, or allowed for the old offset, gets different numbers: drop the offset, and expect a pane beside the main view to sit outside it.
- 08e0cd1: Show any folder or file of the machine, not only a data domain. `openFolder(path)` opens a folder in the file manager (a file is refused, since opening one would run it), and `revealPath(path)` shows a file or folder selected in its parent folder. Both resolve a `Result` and refuse a relative or missing path. Main code imports them from `@drizztdourden08/brock-electron/main`; the renderer calls `usePlatform().filePicker.openFolder` and `revealPath` (Electron only), over the new `shell:openFolder` and `shell:revealPath` channels. A settings `path` control now gives Tessera's `PathInput` a Reveal action on Electron.
- 80319dd: A page, a tab page (through `<page>.page.ts`) or a sub page can set `meta.fill: true`: the page takes the window height and its body does not scroll, so a `ListDetail` or `ListDetailLayout` inside it scrolls its list and its editor on their own, and a long editor no longer scrolls the list out of view.
- 6bdb953: Tessera 0.26: LogPanel keeps showing new rows in a log that starts empty, ItemList groups that can be empty with an action, row data attributes and a tour mark on New.

### Patch Changes

- 80319dd: `JobDialog` sets `data-job-id="<job id>"` on its dialog element, so a test finds the dialog of one job without matching its title. Tessera's `JobDialog` takes no data attributes, so Brock puts it on from its own side.
- 80319dd: The title bar job status names the current step while a hidden job runs: "Running Sunday: Generating 40%" instead of "Running Sunday 40%". A job with no current step keeps the title and the percent.
- 80319dd: The review's `<id>-in-menu` check skips the base screen (`<id>.base.tsx`) and any screen whose meta sets `menu: false`: they have no menu entry by design, so an app with a base screen no longer fails `session-in-menu` on every review.
- b4dc453: The review's `title-bar-actions-sm` check leaves out title bar status items (`bar: 'status'`, such as the job status a hidden job shows): they are text, not `sm` icon buttons, so a job running during the review no longer fails the check.
- 80319dd: A tour step whose target is absent shows its bubble centred, and now counts as shown: the review reports `<step>-centred` instead of failing `<step>-lit`, and goes on with Next. A click step (`advanceOn: { click }`) whose click target is absent too gets a Next button, so the user and the review are no longer stuck on it.
- Updated dependencies [08e0cd1]
  - @drizztdourden08/brock-core@0.34.0

## 0.33.0

### Minor Changes

- 274503e: Tessera 0.25: the widget focus guard and the review find the widget options panel and its sub-panels by Tessera's `data-widget-options` attribute instead of the `widget-options` class.

### Patch Changes

- @drizztdourden08/brock-core@0.33.0

## 0.32.1

### Patch Changes

- fb5fe3a: The first-run tour test and the widget state restart test no longer depend on how busy the machine is:

  - The first-run tour test imports the tour, profile and app state modules once at the top of the file. Its first restart used to load and transform brock-core's root entry and the tour modules inside the timed test, about 1.5 s on a quiet machine, which went past the 5 s limit in a busy full run. Once a test timed out, its body kept running and could swap the stubbed host and the module registry under the next tests, so a later test could fail with `expected false to be true`. Each restart now only runs the modules again, in a few milliseconds.
  - The first-run tour test mocks the platform once for the whole file instead of per restart, and waits for the tour progress save by queuing an empty app state change behind it, instead of waiting 20 timer ticks.
  - The widget state restart test also imports its widget modules at the top, so the widget body and the widget state hook aren't transformed inside a timed test.

  No product code changed.

  - @drizztdourden08/brock-core@0.32.1

## 0.32.0

### Minor Changes

- 92b662f: Widgets keep the keyboard with the app. A mouse click on a widget's button, tab or slider used to give it the focus, so afterwards the arrows, Enter and Space drove that control instead of the app. `WidgetHost` now runs a focus guard over the docked and floating widgets and the widget options panel in the main window: a press on a control there keeps the focus where it was and the click still fires, focus a press moves into a widget is dropped, a slider or select holds the focus only for the press and loses it on release or change, and text fields keep it. Only a pointer press inside the widgets triggers it, so Tab, the tour and the search palette still move the focus into a widget, the focus ring shows as usual, and app menus keep their keyboard navigation. A popped widget window is the widget's own app, so the guard does not run there. It is on by default; `product.widgets.keepFocusWithApp: false` in `brock.config.ts` (or `keepFocusWithApp={false}` on `WidgetHost`) turns it off. The review adds `widget-click-keeps-focus`: two real clicks on the docked logs widget's options button must leave `document.activeElement` outside the widget.

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0

## 0.31.0

### Minor Changes

- 6584277: Brock moves to Tessera 0.24.0: the workspace catalog and brock-react's peer range are `^0.24.0` (MIGRATION §198 and §199). Button and IconButton share an `xs` size of 20 px (`--control-h-xs`), `ButtonSize` and `MenuSize` take `'xs'`, and a widget's pop out, pin, options and close buttons are `xs`, so a docked widget and a popped widget window draw them at 20 px in the 30 px title bar. Brock draws no title bar button of its own on a widget, and the window title bar keeps its `sm` actions, 28 px. `--widget-btn-d` and `--menu-trigger-width` are removed; Brock's CSS used neither, and RENAMES.json maps both to `--control-h-xs`, so `brock upgrade` renames them in an app. An app button passed through `titleBarActions` or `widgetActions` with the class `widget__btn` takes `size="xs"`. Screens follow their own box: a `ScreenPage` header moves its strip, then its actions, under the title instead of cutting it, a `StageScreen` toolbar wraps under its heading, and `ScreenWindow` is a `screen-window` inline-size container, so content in a screen can use `@container screen-window`. An element positioned against the viewport inside a screen now positions against the window; Brock's full-window layers (the boot failure splash, the tour layer, the window guide, the palette, the toasts and the dock drop hints) render outside the screens or in a portal, so they still cover the whole app window.

### Patch Changes

- 6584277: The review checks the control sizes and how screens fit a narrow window. While the logs widget is docked, `widget-title-buttons-xs` checks that every button in its title bar is as tall as `--control-h-xs` and `title-bar-actions-sm` that the window title bar actions are as tall as `--control-h-sm`. After the screens step has toured every screen, it shrinks the app window to 600 by 720, opens each screen again, checks that no window or page title is cut and that the window content does not scroll sideways (`<id>-fits-narrow`), captures it as `screen-<id>-narrow`, then puts the window back.
  - @drizztdourden08/brock-core@0.31.0

## 0.30.0

### Minor Changes

- f0d71bd: Guided tours belong to the app now, not to a profile. The app marks its first use once, in `app.json` (`firstRun`: `pending`, then `done`), and a `trigger: 'first-run'` tour starts once on that first use, after the boot and the splash, whichever profile is active; making another profile later never starts it again. Tour progress (finished tours and the step to resume at) is kept app-wide in `app.json` as `tours`, so a tour finished in one profile is finished in all of them.

  An install that already has profiles or saved views is never on its first use: on the first launch after the upgrade the marker is set to `done`, so a first-run tour an app adds in a later version does not start by itself there; it is under Take the tour and in search. That launch also moves every profile's tour progress from `ui-views.json` (`profile:<id>.tours`) into the app-wide record, keeping any tour any profile started or finished, and removes the profile keys. Nothing in the app's source changes.

  brock-core adds `updateAppState(files, change)`, which applies changes to `app.json` one after another so the profile switch and the tour progress never overwrite each other; the profile store's `setLast` and `remove` use it. `AppState` gains the optional `firstRun` and `tours`. brock-react exports `updateAppState(change)` from its profiles API, bound to the platform `FileStore`.

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0

## 0.29.1

### Patch Changes

- @drizztdourden08/brock-core@0.29.1

## 0.29.0

### Minor Changes

- f3fd443: Brock moves to Tessera 0.23.0: the workspace catalog and brock-react's peer range are `^0.23.0` (MIGRATION §196 and §197). The page header's Back (Tessera's `ContentHeader`, in `ScreenPage`, `SettingsPage` and hub pages, so Back to Saves on a sub-page) is now a `md` Button, 39 px tall, like the ScreenLayer header buttons. Brock's mark is the charcoal stone on both grounds, with a black outline on the light one and a white outline on the dark one: the splash, the hero and About draw it that way, and Brock passes no `inks`. `CommandInput` is drawn with `Combobox` and its props no longer extend `TextInputProps`; Brock used neither. RENAMES.json lists `inks` as removed from `BrandMark`, `Logo` and `Logo.Combined`, so `brock upgrade` makes each app use of it a to-do; an app that passed `name` or `autoFocus` to `CommandInput` drops them.

### Patch Changes

- f3fd443: A tour click step whose click target is in a popped widget is now a Tessera `advance: 'wait'` step, which adds no click listener in the main window, so a click on the step's lit part there no longer moves it on. The widget window still relays the click on its target and the tour goes on from it; the hint line keeps the step's `hint`, else Tessera's click words. A click target in the main document stays `advance: 'click'` with `clickTarget`.
  - @drizztdourden08/brock-core@0.29.0

## 0.28.1

### Patch Changes

- 8c8d415: A tour click step whose click target is in a widget popped into its own window goes on when the user clicks it there. Before, the click never reached the main window's tour and the step fell back to Next. The step keeps Next hidden and its hint line; the main window relays the click target to the widget window (the `tour-click` slice), which sends the click back over IPC (`advanceWidgetTour`, `onWidgetTourAdvance`), and the tour moves on only if that step is still shown. The listener goes when the step changes, the tour closes or the widget docks back. The review clicks the popped widget in its own window (`reviewWidgetProbe({ kind: 'click', id, selector })`, a real mouse click) and checks the tour moves on.
- 8c8d415: While a tour is open the shell shortcuts work again (Ctrl+K, screen shortcuts, Back, Alt+Enter): the shell handler holds only Escape and the plain keys the open step moves on (Left, plus Right and Enter on a Next step). Tessera takes its keys in the capture phase, so nothing else needed holding.
- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-core@0.28.1

## 0.28.0

### Minor Changes

- c426f9a: Brock moves to Tessera 0.22.0: the workspace catalog and brock-react's peer range are `^0.22.0` (MIGRATION §192 to §195). RENAMES.json has no entry for 0.22.0, so an app changes nothing. A tour step takes `hint` and a walking `mascot` (`{ walk?, arrive }`, Tessera's `TourStepMascot`), and `before(ctx)` gets `ctx.signal`, aborted when the user leaves the step before it shows. A menu entry with `confirm` takes `onCancel`, run when its question closes without the second click, in the title bar menu and in the search palette. Icon buttons of size `md` are now 39 px, the height of a `md` Button (TX-45): the header Back and close buttons of every screen, so the ScreenLayer header row grows from 32 to 39 px; the title bar keeps its 28 px actions and dense rows keep their `sm` buttons.

### Patch Changes

- c426f9a: The confirm button of a palette row, such as Reset layout, reports its question through Tessera's `onAsk` and `onCancel` (MIGRATION 192) in place of Brock's click capture around it.
- c426f9a: A tour step whose lit part is a widget popped into its own window lights it there: the main window relays the step's spot to the widget window, which draws Tessera's `TourSpot` over the widget, while the bubble stays in the main window. Before, the bubble sat in the middle and nothing was lit. The review lights a popped widget from a tour step and checks the widget window draws the spot and drops it when the tour closes (`reviewWidgetProbe({ kind: 'tourSpot', id })`).
- c426f9a: Guided tours use Tessera 0.22's own parts in place of Brock's shims. The title bar is kept live with `keep`: it stays usable and undimmed for the whole tour, also when the lit part is inside it, with no lift and no inert moving of Brock's own (the MutationObserver is gone). Steps that end on a tour event or a context are Tessera `advance: 'wait'` steps, so Next hides there too, and a click target apart from the lit part is Tessera's `clickTarget`. Tessera now places the bubble, so it stays in the window beside a tall target, and keeps the mascot off the lit part. Escape is Tessera's, in the capture phase: it closes the tour and no longer reaches the shell, so the screen under the tour stays open.
- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-core@0.28.0

## 0.27.0

### Minor Changes

- f704655: Guided tours are part of every Brock app, drawn by Tessera's `GuidedTour` and presented by the app's brand mascot. A tour is a file: `src/tours/<id>.tour.ts` default-exports `defineTour({ id, title, steps, trigger? })`. `brock sync`, `brock dev`, `brock build` and the renderer Vite plugin write `.brock/tours.ts`, `BrockApp` takes it as `tours`, and `RendererModule.tours` adds a module's tours. `brock structure` checks the folder, and `brock-lint-config` lets tour files default-export.

  A step lights a Tessera target or a Brock one (`{ shell: 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen' }`, `{ widget: '<id>' }`, `{ setting: '<key>' }`). Before it shows it can `open` a screen or hub page, open a `widget`, set a `context` and run `before(ctx)`, which may be async. `advanceOn` waits for a click (`{ click: target }`), a tour event (`tours.emit(name)`) or a context change. Each step can name the mascot's state.

  `tours.start(id)`, `tours.stop()`, `tours.next()`, `tours.back()` and `useTour()` drive tours. Completion and the last step are kept per profile in `ui-views.json`, so a finished tour doesn't come back by itself. `trigger: 'first-run'` starts a tour once, the first time a profile opens the app, after the boot and the splash. Menu > Take the tour (in Help when the app has a Help group, else in Advanced) and a search palette action per tour start them. Escape closes a tour, and the other shell shortcuts wait while one is open. The title bar stays usable over the tour. The menu knows a `help` section.

  The review gets a `tours` step: it runs every tour end to end, clicks through interactive steps, captures each step and checks that the tour is kept as completed and that Escape closes it.

  The template ships `welcome.tour.ts`, a four-step first-run tour of the menu, the search, the Notes widget (which waits for a click) and Settings. The 0.27.0 `tour-files` migration adds `tours={appTours}` and its import to `src/main.tsx`.

### Patch Changes

- @drizztdourden08/brock-core@0.27.0

## 0.26.0

### Minor Changes

- 0204060: `SettingAction` takes `tone` in place of `variant`, named as in Tessera's `ActionData` (variant became tone on every action shape in Tessera 0.21). `tone` is a `ButtonVariant`: `'danger'` gives the settings row its danger tone and a string `confirm` dialog its danger look, and `SettingActions` draws its buttons in it. `variant` is a deprecated alias that still works until 0.27; when both are set, `tone` wins. The Storage page's Clear action uses `tone`.

  The 0.26.0 migration `setting-action-tone` rewrites `variant:` to `tone:` in the settings actions of an `actions: [...]` list (a JSX `actions` prop and mapped entries too) and in objects typed `SettingAction` by an annotation, a return type, `as` or `satisfies`. The `variant` of a `confirm` dialog stays. An object with `label`, `onSelect` and `variant` it cannot place, and an action that sets both, become to-dos. A second run changes nothing.

  The template's General page shows a row action: Widget layout, with a Reset in the danger tone that asks first.

### Patch Changes

- @drizztdourden08/brock-core@0.26.0

## 0.25.0

### Minor Changes

- 8903da0: Brock moves to Tessera 0.21.0: the workspace catalog and brock-react's peer range are `^0.21.0` (MIGRATION §181 to §191). `brock upgrade` from 0.24 replays RENAMES.json (ManagedList to ItemList, MasterDetail to ListDetail, ContentHeaderBack to BackAction, `onClick` to `onSelect` and `variant` to `tone` on the action shapes, ToastContainer to ToastStack, the removed JsonInput, NamedRange and SetPicker, and the merged strings). The profiles list is Tessera's `ItemList`, and SettingsRow actions take `onSelect`.

  `ScreenLayer` takes `back`, Tessera's `BackAction` `{ onSelect, label? }`, in place of `onBack`. The shell passes the page Back goes to as the label, the hub page or sub-page of the last history step, else the screen title, so the arrow reads Back to Saves. The 0.25.0 migration `screen-layer-back` rewrites `<ScreenLayer onBack={fn}>` to `back={{ onSelect: fn }}` and lists an `onBack` it cannot rewrite as a to-do.

- 8903da0: Toasts go through Tessera's one queue. `ToastHost` is a single `ToastStack` at the bottom right with `max={3}`, and `toast(message, { variant, duration, action })` and `dismissToast(id)` are thin wrappers over Tessera's `toast()` and `toast.dismiss()`. The same message and variant raised again joins the toast already shown, with a count such as ×2, and a toast with no `duration` leaves after Tessera's 5 s, where Brock's own default was 4 s. `useToastStore` and `ToastState` are removed: the 0.25.0 migration `toast-store-gone` lists each use as a to-do.

### Patch Changes

- 8903da0: The `json` settings control draws Tessera's `CodeBlock` with `editable` and `language="json"`, since JsonInput is gone. Each edit goes through `JSON.parse` and the `shape` check; the parsed value is saved only while the text parses, and otherwise the field is marked invalid, the line read from the parse message is tinted, and the message shows under the field. `shape` keeps its values, now typed `SettingJsonShape`.
- 8903da0: A menu entry with `confirm`, such as Widgets > Reset layout, asks before it runs from the Ctrl+K palette too. Its row carries a compact `ConfirmIconButton` (`size="xs"`) in the `action` slot; pressing it, the row or Enter asks with the check and the X. The check runs the entry and closes the palette, and the X or Escape cancels and leaves the palette open. Before, the palette ran Reset layout at once.
- 8903da0: The question before leaving a page with unsaved changes takes Tessera's merged words: it is titled Unsaved changes, where it read Discard changes?, with Discard and Keep editing, read from `common.unsavedTitle`, `common.discard` and `common.keepEditing`.
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

### Minor Changes

- e769096: Brock moves to Tessera 0.20.0: the workspace catalog and brock-react's peer range are `^0.20.0` (MIGRATION §170 to §180). `brock upgrade` from 0.22.0 replays RENAMES.json (ChosenMascot to AnimatedMascot, PathField to PathInput, the removed parts, the eighteen Glyph names, StatRow `copyable`, CommandPalette `sentri` to `rotp`), and two 0.23.0 migrations cover what it does not:

  - `tessera-tier-moves` moves imports of the parts that changed entry point: Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput and PathField (with their types) from `/primitives` to `/composites`, Overlay to `/primitives` and PixelWordmark to `/brand`. RENAMES.json names no entry point, so an import that only got renamed would point at the wrong one. The root import is left alone.
  - `menu-confirm-store` lists each use of the removed `useMenuConfirmStore`, `MenuConfirmState` and `MenuResolver.armed` as a to-do.

  The replay no longer flags every import of `Text` for the removed `Text.CodeBlock`: a removed member is a to-do only on the lines that use it.

### Patch Changes

- e769096: Brock uses the Tessera 0.20 parts in place of its own stand-ins:

  - Reset layout, and any menu entry with `confirm`, is a Tessera `DropdownMenu` item of `kind: 'confirm'`: the first press asks in the danger tone and keeps the menu open, the second runs it. `confirm: true` takes Tessera's words (Click again to reset layout), a string its own. Brock's check item stand-in and `useMenuConfirmStore` are gone.
  - `WidgetHost` passes `WidgetManager` and its gates `contextActive={(definition) => …}`, stable with `useCallback`, answering from the context registry, and no longer hides context widgets itself.
  - A title bar `kind: 'menu'` item takes `tone` and `effect`, like a button or a status.
  - The hub search and palette mascots and the hero mascot are `<AnimatedMascot brand="auto">` on Tessera's state machine: the hero waves once and blends into idle, and a search with no match cuts in with `alert` on each new query and settles into `worried`. The hero's fallback `BrandMark` passes `ground="dark"`.
  - ToastHost, SettingPathField (now on `PathInput`), the boot failure splash, the shortcuts help and the diagnostics preview import their parts from `/composites`.

- e769096: The splash sits on Tessera's dark gradient, with text that holds WCAG AA. The splash page and the boot failure splash drop Brock's white radial highlight, the light drop shadow on the mark and the bright look under the text, so Tessera paints the palette's `--c-gradient-dark-from` to `--c-gradient-dark-to` under its tested text colours. Only an app with colours of its own (`product.look`, or palette seeds in its theme without its own `--p-gradient-dark-from` and `--p-gradient-dark-to`) gets `--look-dark-from` and `--look-dark-to`, from brock-core's new `darkPair`, which darkens its look toward black until the palette's `--c-text-dim` reads at 4.5:1 at both ends. `brock icons` writes `public/logos/mark.svg` from Tessera's `brand/dark-ground/<brand>.svg`, so both splashes show the mark in its dark ground colours. The installer and its Setup splash keep the bright look.
- Updated dependencies [e769096]
  - @drizztdourden08/brock-core@0.23.0

## 0.22.0

### Minor Changes

- 73a287e: A central context registry replaces the single widget context. `useContextsStore` holds named contexts, each `{ active, data? }`; the app and modules set them with `contexts.set('session', { active, data })` or `useSetAppContext('session', active, data?)` in a component, and read them with `useAppContext('session')`. A widget names the context it needs with `context: 'session'` in its definition or file `meta` (which makes it `context-only` by default) and shows only while that context is active, docked, floating and popped; module widgets register the same way as app widgets. The registry is relayed to popped widget windows, so `useAppContext` reads the same contexts there. `BrockApp`'s and `WidgetHost`'s `widgetContext` prop is deprecated but keeps working, driving the `default` context that context-only widgets with no context of their own follow; the `widget-context-registry` migration (0.22.0) lists each use as a to-do.
- 73a287e: The review copies `src/review/fixtures/` into the app data folder, at the same paths, before the seed runs, for sample files that are easier to keep as files. `brock sync` lists them in `.brock/review.ts` (`fixtures`, lazy `?url` imports), the copy reports a `fixtures-copied` check in the `seed` step, and `brock structure` leaves the folder alone. A fresh app ships `src/review/fixtures/notes/review-note.txt`, which its seed reads into the Notes widget.
- 73a287e: App title bar items (`src/title-bar/<id>.action.ts`) take `tone` (any Tessera `StatusTone`) and `effect` (an `IconEffect`) on buttons and status tags, the same values Brock's Search and Report a bug items use. Tessera's title bar dropdown has neither, so a menu item takes none.

### Patch Changes

- 73a287e: Importing a data area asks Merge (the default) or Replace in its confirm dialog (`confirmChoice`, a confirm dialog with a radio group). Merge keeps what is there and keeps the newer file when both have the same path; `storage:applyImport` takes the mode, the result counts the kept files (`kept`), and imported files keep the modified time they were exported with.
- 73a287e: A job that succeeded clears its title bar tag by itself 30 s after it finished; a failed or cancelled job keeps its tag until it is opened. A job whose dialog is open stays until the dialog is hidden.
- 73a287e: Hub navigation: the Home entry, and Escape with nothing open, always open the home hub on its home page (`nav.home(id)`, `open(id, params, { fresh: true })`, a menu item with `fresh: true`), while the hub switch and a hub's own menu entry still reopen the page it was left on. Escape goes up one level, a sub-page to its page and a page to the hub home, then closes the hub; Back, Alt+Left and the mouse Back button keep walking the whole history. The review checks Escape going up and then closing.
- 73a287e: Reset layout in the Widgets menu asks first, in place, like Tessera's `ConfirmIconButton`: the first click turns the entry into Click again to reset and keeps the menu open, the second resets, and it goes back after 5 s. Any title bar menu item can do the same with `confirm: '<armed label>'` (`useMenuConfirmStore`).
- 73a287e: A widget or screen write reaches the saved views at once when they are already loaded, so a flush on `pagehide` right after a change saves it; the restart test runs on fake timers.
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-core@0.22.0

## 0.21.1

### Patch Changes

- @drizztdourden08/brock-core@0.21.1

## 0.21.0

### Minor Changes

- 6016488: Brock moves to Tessera 0.19.0: the workspace catalog and brock-react's peer range are `^0.19.0`. Tessera 0.19 puts rename and delete on every row of `ManagedList` (`actionVisibility`, default `'hover'`) and adds `onActivate`, so the arrow keys, Home and End can move focus without picking (MIGRATION §169). It renames nothing, so `brock upgrade` from 0.20.0 has no rename to replay.

### Patch Changes

- 0999a18: `ProfilesPanel` is drawn by Tessera's `ManagedList`, its props unchanged. The create form is an `InlineCreateForm` in the list's `create` slot, at the top of the list: New opens it with focus in the name field, Escape or Cancel closes it and puts focus back on New, and after a create that selects the new profile focus goes to its row. While no profile exists (`createOpen`) the form stays open with no Cancel, Escape leaves it open, and it stays open until the first create resolves. `selectedId` marks the active profile and `onSelect` is the list's `onActivate`: a click, Enter or Space on a row makes it the active profile, while the arrow keys, Home and End only move focus, so moving through the list never switches profile. The rows are one Tab stop, and Tab from the focused row reaches its rename (also F2) and delete. Rename and delete are on every row, as before: always shown on the active row, and on the others under the pointer or while the row holds focus, so a mouse user deletes any profile without switching to it. Delete still asks once in the row. A failed rename shows its message above the list.
  - @drizztdourden08/brock-core@0.21.0

## 0.20.0

### Minor Changes

- d700531: Brock moves to Tessera 0.18.0: the workspace catalog and brock-react's peer range are `^0.18.0`. Tessera 0.18 adds a create form slot to `ManagedList` (`create`, `createOpen`, `onCreateOpenChange`, MIGRATION §168) and renames nothing, so `brock upgrade` from 0.17.0 has no rename to replay.

### Patch Changes

- @drizztdourden08/brock-core@0.20.0

## 0.19.0

### Minor Changes

- df9c1df: Brock moves to Tessera 0.17.0: the workspace catalog and brock-react's peer range are `^0.17.0`. Small text is 12 px, and Field labels and DataTable headers are no longer forced to capitals (Archipelia review T-03). Two new settings control kinds: `path` (`pick`, `accept`, `placeholder`) draws Tessera's `PathField` on a string setting, with typing, a drop from the desktop and Browse, and `json` (`shape`) draws `JsonInput`, which saves the value only while the text parses. They come with new optional platform ports, `filePicker.pickPath`, `filePicker.pathOf` and `storage.revealLogs`, which the Electron host fills through the new `dialog:pickPath` and `debug:revealLogs` channels and the preload's `getFilePath`. `brock upgrade` writes `StatusOf` as `Status` from Tessera's `RENAMES.json`, and the `tessera-part-moves` migration moves `CopyButton`, `CopyValue` and their types from `/primitives` to `/composites`, and `ErrorBoundary` from `/composites` to `/primitives`.

### Patch Changes

- df9c1df: A renderer boot task that fails while the window shows now draws Tessera's `Splash`, the same as the boot splash page: the app name and mark, `<task> failed` with the error under it, a danger bar, the version, and Retry, Open logs (the logs folder) and Quit. It covers the window, and the app root is inert under it. The splash page draws its mark in `ts-mark` and the error in `ts-detail`, and the splash plugin puts the app look on the app page, so both splashes share the gradient.
- df9c1df: A settings row action shows its button busy while `onSelect` runs, through the Tessera SettingsRow action `loading`, on settings pages and the Storage page. `SettingActions` keeps its loading button and no longer turns the other buttons off while one runs.
- df9c1df: Brock drops its workarounds for parts Tessera 0.17 now draws: the popped widget window passes `dragRegion` to `Widget` in place of setting `data-app-region` on the title strip by hand, and a hero with no art and no backdrop relies on Tessera's own fit (`hero--bare`), so `hero-root--bare` and its CSS are gone. The Performance widget details and the About rows use the `sm` StatRow, and AboutPanel and the Performance widget import `CopyButton` from `/composites`.
- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-core@0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- 70d80cf: Back is Tessera's: a screen passes `onBack` to ScreenWindow, whose header draws Back outside the heading, so the hub dialog is named by its title alone (it read "Back Multiworld"), and a hub sub-page passes `back: { label, onSelect }` to ScreenPage for its "Back to <page>" button (B-07, B-08).
- 70d80cf: The confirm dialog is Tessera's `Dialog`, which starts a danger dialog on Cancel, keeps Tab inside and gives focus back; Brock's cancel-first dialog is gone. `confirmDelete({ what, consequence })` is unchanged.
- 70d80cf: About copies its debug info, and the Performance widget its snapshot, through Tessera's `CopyButton`.
- 70d80cf: The review check floating-widget-resizes measures the grown size against the main view's real limit, so a layout with rows above and below main passes.
- 70d80cf: A hub's side nav remembers open or folded per hub through its `storageKey`.
- 70d80cf: `JobDialog` draws Tessera's `JobDialog` and `TaskProgress`, and a done job ticks every step through Stepper `complete` instead of a made up Done step (B-15).
- 70d80cf: A tab page opened by a route that names no tab opens on its last tab, remembered per tab page in screen state.
- 70d80cf: Screen and page `meta.menuOrder` orders the title bar menu, falling back to `meta.order`, so the menu and the nav can sort differently.
- 2473089: The review focuses the hub search field when the side nav is open (Tessera 0.16 opens it with labels), counts a title bar dropdown listed as a sub-menu as a menu action, finds the screen card and the Back button by their Tessera 0.16 markup, and checks on every screen that focus moves in, the page behind is inert and the title bar and widget dock stay usable.
- 70d80cf: A failed settings save shows a danger toast with Retry, and `toast()` takes an `action` (ux-48).
- 70d80cf: Screens take focus, make the page behind inert and give focus back through Tessera's ScreenLayer; Brock's own focus and inert code is gone. The title bar and the widget dock sit outside the screens' parent and stay usable, and the review checks it on every screen (ux-38).
- 70d80cf: `SettingAction.onSelect` gets the current settings, and `disabled` takes a boolean or `(settings) => boolean`.
- 70d80cf: Settings row actions draw through SettingsRow `actions`, after the control or in its place, with the danger tone and an in-row question when `confirm` is a string; the second row under a control is gone (B-11).
- 70d80cf: The keyboard shortcuts dialog lists its keys with Tessera's `ShortcutList`.
- 70d80cf: A `kind: 'menu'` title bar item is a Tessera title bar dropdown (`bar: 'dropdown'` with `groups`), which folds into a sub-menu of the main menu as the bar narrows, and takes `groups` with labels or plain `items`. A status item passes `pulse` on, and the job status pulses while a job runs. `TitleBarMenuHost` and its store are gone (B-12).
- da0b1eb: The title bar Search button is primary with a twinkle on the looking glass, and Report a bug is red (danger) with a ping, as the owner asked (Tessera 0.16.1 tone and effect on title bar actions). This reverts the neutral bug button of 0.17.
- 70d80cf: Widgets use Tessera's body padding and fill: the Performance widget drops its own padding, the Logs widget uses `padding: 'none'`, `fill` and LogPanel `height="fill"`, and widget `meta` accepts `padding` and `fill`.
- 70d80cf: A popped widget window passes its options to Tessera's `Widget.options`, so the gear opens `WidgetOptions` in a `ControlMenu`, with the drag shortcuts as a `ShortcutList`. Its title strip is marked `data-app-region="drag"` and the Search button `no-drag`, in place of Brock's `-webkit-app-region` rules, so a click on the strip closes an open menu (tessera-66, I-61).
  - @drizztdourden08/brock-core@0.18.0

## 0.17.1

### Patch Changes

- @drizztdourden08/brock-core@0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: An IPC channel is declared once: `defineChannels({ engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'), onProgress: event<(p: number) => void>()('ap:engine:progress') })` from brock-core gives the preload maps (`maps.invoke`, `maps.send`, `maps.events`), the augmentation types (`InvokeContractOf`, `SendContractOf`, `EventContractOf`) and typed entries: main's `handle`, `on` and `emit` take an entry in place of the channel name, and brock-react's `channelApi(APP_CHANNELS)` types the renderer calls by method name. Channels written in the augmentation, a map and a handler keep working. The new app declares its channels this way, knip treats `src/ipc/contract.type.ts` as an entry, and the `channel-declarations` migration lists, as one to-do, every channel an app could move. docs/ipc.md shows both styles.
- 3a35c8e: Renderer boot tasks get `platform` (the resolved platform: `filePicker`, `files`, `storage`, `window`, `device`, `capabilities`) and `openExternal` beside `product` and `profile`, so a task that registers a search action can open the file picker or a link.
- 3a35c8e: Apps add their own review steps: each `src/review/<id>.step.ts` (default export `defineReviewStep({ run })`) runs as step `<id>` after the built-in steps, in the same report. `run(tour)` gets the built-in helpers: `check`, `report`, `capture` (named `<id>-<name>`), `find`, `findAll`, `click`, `hover`, `typeText` (inputs and textareas), `press`, `waitFor`, `settle`, `delay`, `openScreen`, `openWidget`, `resetUi`, plus `platform` and `api`. A step that finishes gets a passing `step-ran` check, and an id that is a built-in step's name fails. `brock structure` accepts `<id>.step.ts` files and the lint preset allows their default export. The new app ships `src/review/notes.step.ts`.
- 3a35c8e: The review tours the app's real content: `src/review/seed.ts` (default export `defineReviewSeed({ run })`) runs as the `seed` step right after the profile step, so the screens and widgets that follow are captured with data. The seed fills the app through its own channels, a store, or fixture files written with `tour.platform.files`. `brock sync` lists it in `.brock/review.ts`, `src/main.tsx` passes `review={appReview}` to `BrockApp` (the `review-files` migration adds it), and the new app writes a note for the Notes widget. docs/review-steps.md shows how to write one.
- d358df3: A base screen is a file now: `src/screens/<id>.base.tsx`, one per app, default-exports its component (`BaseProps`) with `title` and `icon` in `meta`. `brock sync` lists it, `BrockApp` draws it under every hub, Escape closes down to it and opens `config.home` from it, and `brock structure` rejects a second one, one inside a bucket and one named like a bucket. The `base-screen-file` migration moves a hand `defineScreen` passed through `screens` and `home` into that file, or leaves a to-do naming the file when the screen holds more than a title, an icon and a component.
- d358df3: Pages declare header actions: `meta.header` takes a primary button (`{ label, icon?, open }`, where `open` is a sub-page path or a route) and a filter field (`{ placeholder? }`, read with `usePageSearch()`), drawn in the standard page header beside the title and tabs. `<PageActions primary search>…</PageActions>` in a page body puts the same row there from props.
- d358df3: Hubs keep a page history. The window header shows Back while there is a step to go back to, Alt+Left and the mouse Back button go back too, and Escape goes back one step before it closes the hub. Each hub keeps its page and history while another hub is open, and opening it by its id brings it back where it was. `useScreenState(key, initial)` gives every screen and page a state that outlives it, kept per profile in `ui-views.json` under `screens` with the open hub, page and history, which come back after a restart. `useNavigation()` adds `back`, and `nav` adds `back`, `up` and `escape`; `useCanGoBack()` reads whether Back would do something.
- d358df3: `ScreenMeta.menu` places a page or a card screen in the title bar menu: `false` hides it, `'entry'` lists it at the top, and a path such as `'Multiworld/Hosting'` files it under those labels, creating the parent entries that do not exist and turning a plain entry into a submenu that keeps it first. Placed entries sort by `order`, then label.
- d358df3: Ctrl+K always opens the palette. Inside a hub the results come as In <hub> first and Everywhere else after, and the empty palette lists the hub's pages first. The hub search uses the same ranking as the palette for its groups and page jumps (`rankInScope`).
- d358df3: Sub-pages: `<page>/<sub>.sub.tsx` beside a page is a route under it (`meta.path`, such as `':id/edit'`), drawn in the page frame with "Back to <page>" before its title. It goes into the history, Escape and Back go up to the page, search finds the ones without params, and a page opens one with `openSub(id, params)`. `useUnsavedChanges(dirty)` asks "Discard changes?" before any navigation leaves a dirty page and adds its message to the quit confirm.
- 055bb91: `SearchEntrySeed` takes an optional `id` and `params`. `id` is the entry's key, so two entries with the same label and no anchor no longer collapse into one, and `params` are passed to `open` when the entry is picked (a Presets entry opens with its `presetId`). A hub search keeps live entries with params. A custom page's literal `searchEntries` may carry both too.
- e70afc3: `confirmDelete({ what, consequence })` resolves true or false after a confirm with the danger look and Cancel focused. `confirmAction` takes `focus: 'cancel'` for the same focus, and the deprecated `dialogs.confirmDelete` uses it too.
- e70afc3: Long jobs: `ctx.job(id, steps)` in main reports steps, weighted progress, the current line and log lines to the renderer and stops on cancel through its `signal`. `JobDialog` draws a job with Tessera's Stepper, ProgressBar and LogPanel, `useJob(id)` and `jobs.open(id)` drive it, and Hide moves a running job to a status tag in the title bar that reopens it.
- e70afc3: A settings item takes `actions` (`label`, `icon`, `variant`, `disabled`, `confirm`, `onSelect`). An item with actions and no control draws them as the row's control; an item with a control gets them in a row right under it. `confirm` asks through `confirmAction` first, the button shows its loading state while `onSelect` runs, and a throw becomes a toast. `SettingActions` draws the same buttons on a custom page.
- e70afc3: File storage per data domain: `ctx.storage.domain(id)` in main and `dataDomain(id)` in the renderer read and write JSON, text and bytes, list, remove and size files, with every path kept inside the domain folder. A built-in `StoragePage`, added to a bucket as a page file, shows each domain's size with Open folder, Clear and "older than N days" clean rules (both confirmed), and exports chosen domains to a zip or a folder and imports them back. New template apps declare two domains and carry the page.
- e70afc3: An app puts its own items in the title bar without a module: `src/title-bar/<id>.action.ts` default-exports `defineTitleBarItem({ kind: 'button' | 'menu' | 'status', ... })` or a hook that returns one. `brock sync` writes `.brock/title-bar.ts` and `BrockApp` takes it as `titleBar`. A `menu` item opens a dropdown of its own, a `status` item is a tag drawn while its status is set, and every item folds into the main menu when the bar is narrow. App items come after Search, Report a bug and the module items, whose order stays fixed. The `title-bar-files` migration wires `src/main.tsx`.
- 87fa9a3: The app says when its widget context is active: `BrockApp` (and `WidgetHost`) take `widgetContext`, a hook such as `() => useSessionStore((s) => s.session !== null)`. While it returns false, `context-only` widgets hide, docked, floating and popped out (a popped one closes its window, keeps its place and reopens there). Without the prop the context stays active, as before, and a review launch always counts as in context so its captures still show those widgets.
- 87fa9a3: A default widget layout and Reset layout. `src/widgets/layout.ts` default-exports `defineLayoutPreset({ rows, sizes, widths })`: rows of widget ids around the `main` view, with an array of ids tabbing them in one pane. `brock sync` exports it from `.brock/widgets.ts` as `appWidgetLayout` (undefined without the file), and `src/main.tsx` passes `widgetLayout={appWidgetLayout}` to `BrockApp`. A profile with no saved layout starts from it, and `meta.defaultOpen` opens a widget the preset does not place on its default side. `widgets.reset()` and the new Reset layout entry at the end of the Widgets menu put the layout back to that default. The `widget-layout-prop` migration wires `src/main.tsx`; the template ships a layout with Notes beside the main view.
- 87fa9a3: App state reaches popped widget windows through a public API. `shareWithWidgets(store, { kind, pick })` in the main window (a boot task is a good place) publishes `pick(state)` to every widget window, debounced, only while a widget is popped, at once when a window opens and again on a profile switch; it does nothing in a widget window. `useWidgetSlice(kind, fallback?)` reads the slice in both windows, so a widget reads its data the same way docked or popped. Brock's own frames and widget prefs relay now go through it.
- 87fa9a3: Every widget's state is kept per profile and comes back after a restart and a profile switch. `useWidgetState(key, initial)` is `useState` for the widget it is drawn in (it reads the widget id from `useWidgetId()`), stored with that widget's `useWidgetPref` values, relayed to its popped window and kept when the widget unmounts under a screen. `useWidgetStateReady()` turns true once the profile's saved values have arrived. Pending writes are flushed on `pagehide` and `beforeunload`, and a malformed saved widget entry is dropped instead of reaching the widget.

### Patch Changes

- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
  - @drizztdourden08/brock-core@0.17.0

## 0.16.0

### Minor Changes

- 7ef6122: `defineScreen` takes an icon name, like menu entries and `ScreenMeta`, or an element.
- 7ef6122: The hero frame passes `product.icons.brand` to Tessera's `Hero`, so a branded app shows its brand backdrop, and a hero that renders no `<Art>` shows the brand's mascot, or its `BrandMark` when the brand has none. A hero with no art and no backdrop shrinks to its content and aligns to the top instead of leaving an empty band above the title.
- 7ef6122: `hostApi<M>()` and `requireHostApi<M>()` take the app's own maps as a type argument (`{ invoke?, send?, events? }`, for example `typeof APP_INVOKE_MAP`) and add their methods to the base ones, so an app reaches its channels without a cast. Without one they return the base `IpcApi` as before. brock-core exports `AppIpcMaps` and `AppIpcApi`.
- 7ef6122: `useKeyedGuard` returns `lastError`, the most recent error still set, for a view with one alert.
- 7ef6122: brock-react exports `SearchAnchor` (`anchor`, `className?`, `children`), so a custom page marks where a search hit lands without writing `data-search-anchor` by hand. The template's custom page uses it.
- 7ef6122: Settings items take the control kinds `number` (`min`, `max`, `step`, `unit`), `text` and `password` (`placeholder`), `select` (`options`, `searchable`), `radio` and `tags` (`suggestions`, `placeholder`), each mapped to the Tessera `SettingsRow` input of the same name. A `choice` control takes `look: 'segmented' | 'select' | 'radio'` and is drawn as a select when it has more than three options, a segmented control otherwise. In development a row that resolves to no control logs a warning once instead of drawing nothing in silence.
- 7ef6122: `screens.config.ts` takes `settings: { bucket, page? }`: the Settings entry, the palette and Mod+Comma open that page when it is set, instead of the first settings page in nav order. `brock structure` names a `settings.page` the bucket does not hold.
- 7ef6122: A tab page takes its meta from `<page>.page.ts` beside its folder: a file that exports only `meta: ScreenMeta` (title, icon, order, shortcut, devOnly, keywords). The screen sync writes it as a `page-meta` entry, the nav and the search index name and place the page with it, and `brock structure` names a `.page.ts` with no tab folder beside it or no `meta` export.
- 55befe4: `@drizztdourden08/brock-build/testing` exports `readDockLayout(page)` and `widgetWindows(app)`. `readDockLayout` returns the widget layout from brock-react's layout store (`layout`, the `docked`, `floating` and `popped` ids, the main view's rect and each drawn widget's rect); `widgetWindows` returns every popped widget window from main with its id, bounds, visibility, focus, minimized and always-on-top state. Neither reads Tessera's class names. brock-react's `WidgetHost` installs the layout reader on automation launches only.
- 9a3b1f6: `beforeQuit` on `BrockApp` and `RendererModule` returns an optional message; when one does, Quit and the title bar close button show a confirm first. `quitGuards` and `requestQuit` are exported.
- 9a3b1f6: Every screen and widget, docked or popped out, renders inside `RenderErrorBoundary` (Tessera's `ErrorBoundary`): a throw shows "This page hit an error" with Reload page, Go home and Report a bug and logs the error to the log bus, instead of blanking the whole app. `RenderErrorBoundary` and `reportRenderError` are exported.
- 9a3b1f6: Jumping to a search result focuses the row's control after the scroll, and a toast says "Could not find <item> on this page" when the row does not appear in time. `scrollToAnchor` and `openSearchTarget` take an optional label for that toast.
- 9a3b1f6: Settings saves report their state: the settings store adds `saveStatus`, `saveError`, `savedAt` and `retrySave()`, the settings and hub headers show Saved after a write or Not saved with Retry, and a failed write raises a danger toast.
- 9a3b1f6: A Keyboard shortcuts entry in the Advanced menu and Ctrl+/ open a dialog listing the framework shortcuts and every screen and page shortcut with Tessera's `Shortcut` keycaps. `shortcutsHelp` opens it from code.
- 7ef6122: `WidgetMeta.order` sorts the Widgets menu, then the label, instead of the file name order. `brock structure` accepts `order` as a widget meta field.
- 7ef6122: A popped widget window mounts the standard overlays (the confirm dialog, the bug report dialog and the toasts) and registers the escape layers, so `confirmAction` and `toast` work there. `StandardOverlays` now holds the confirm dialog, and its `menu` is optional: without it the palette is left out. brock-react exports `useWindowKind()` (`{ kind: 'main' }` or `{ kind: 'widget', id }`) and `widgetWindowId()`.

### Patch Changes

- 7ef6122: With a base screen under a fullscreen screen or hub, `ScreenHost` draws a scrim (Tessera's `--c-scrim`) over the base layer, so the base content no longer shows through around the card or collides with the bucket switch.
- 7ef6122: `confirmAction` is the one confirmation API: `dialogs.confirmDelete` (and the hook's `confirmDelete`) is deprecated and is now a thin call to it with a red Delete button.
- 7ef6122: Pop in docks a widget back into the pane it left, at its old place among that pane's tabs, while that pane still exists, instead of on its `defaultSide`.
- 9a3b1f6: The hub and settings headers draw the active profile as a small tag after the title, and only when two profiles or more exist, so the bucket title stays the heading.
- 55befe4: The review opens every widget the app and its modules register (the `src/widgets` files and module widgets): docked and captured as `widget-<id>`, then popped and captured as `widget-<id>-popped` when its definition sets `popOut`. A context-only widget is shown as `always` for its captures and set back after; a devOnly one is opened only while developer tools are on.
- 55befe4: A renderer boot task that fills a session store must run `after: ['settings']`, because the profile hydration resets every session store before `settings` resolves; the architecture Boot section and the brock-react README now say so. In development the renderer boot warns in the app log when that reset wipes a session store something already filled, naming the app and module tasks that can run before `settings`.
- 7ef6122: A tab page draws its tabs in the page header beside the title, with Tessera's `SettingsPage` `tabs`, the same strip a settings page uses for its anchors, instead of in the window header row.
- 7ef6122: The title bar draws the app logo for a named instance too and marks the instance with the badge alone, instead of the near-identical bot logo.
- 9a3b1f6: A renderer boot task that fails while the window is showing draws a panel in the window, "<task> failed" with the error, Retry and Open logs, like the splash, instead of leaving only the title bar.
- 9a3b1f6: Escape in a non-empty text field clears the field first; only the next Escape closes the top layer.
- 9a3b1f6: The title bar Report a bug button uses the neutral tone instead of danger.
- 9a3b1f6: A fullscreen screen moves focus to its heading when it opens, makes the base screen behind it inert, and gives focus back to the opener when it closes.
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

- 4711645: Brock takes Tessera 0.14.0 (peer range `^0.14.0`): nested sub-menus, checks and radios that keep the menu open, lists correct under zoom, palettes in their own cascade layer, and the Island Spirit Pelago. No Brock code changes.

### Patch Changes

- Updated dependencies [33dc33c]
  - @drizztdourden08/brock-core@0.13.0

## 0.12.0

### Minor Changes

- f751683: The product brand's mascot joins search: Flint for `brock`, Pelago for `archipelia` and Sentri for `rotp` sit in the command palette's input row and in every hub search, looking around before you type and jumping up when nothing matches. A brand without a mascot, or no brand, keeps the plain search icon. The review checks the mascot in the palette and in the hub search, and captures the hub search before typing and with no match.
- f751683: Brock moves to Tessera 0.12.0 (brock-react's peer is `^0.12.0`). A widget window now draws Tessera's own pin menu in its title bar and Tessera's Pin row in its options panel, in place of Brock's `WidgetPinMenu` and the Stacking row; the pin stays off or on top, sync stays a separate option, and a saved `with-app` pin still opens as off with sync on. The `widget:popped` event carries the new `PoppedWidgetPatch`, whose pin is never `with-app`. The review reads the page header through the `content-header` classes.
- 59c1c9d: Brock moves to Tessera 0.13.0 (brock-react's peer is `^0.13.0`).

  - Palettes: `BrockApp` imports Tessera's brand palettes into the `ds.palette` layer and sets `data-palette` on the document root to `product.icons.brand`, in the main window and in popped widget windows. The starter `src/theme.css` sets no seeds and only overrides; the `brock-palette` upgrade step turns an untouched starter theme (the old blue or the Brock seeds) into that override-only file and keeps a theme the app changed. The splash, the look and the installer read the brand palette while `theme.css` sets no seeds.
  - Breaking for hero homes: `Art` takes a `kind` (`image` or `node`), `Backdrop` takes Tessera's `HeroBackdrop` (`node`, `image`, `color`) or `kind: 'none'`, and the new `Shade` slot takes `value`. The `hero-kinds` upgrade step adds `kind="image"` to art and turns a `Backdrop` with children into a to-do.
  - About has no page header, as Tessera's InfoScreen now draws none; the screen declares the new `header: 'none'` and the review checks that no header shows.
  - The search mascot comes from Tessera's `mascotForBrand`; Brock's own brand to mascot table is gone.

### Patch Changes

- Updated dependencies [f751683]
  - @drizztdourden08/brock-core@0.12.0

## 0.11.0

### Minor Changes

- 48ca303: A built-in Performance widget every app gets, closed by default and listed in the Widgets menu: the renderer (frame rate and frame time, long tasks, event loop lag, JS heap, DOM nodes), every process from main (CPU and memory per process, main process memory, uptime, windows and widget windows with their sync and group, IPC calls per second, runtime versions, GPU compositing) and the app state (version, screen and route, profile, open widgets, modules, errors and warnings since start). Its options set the refresh and the sections shown, sampling stops while it is off screen, and Copy snapshot puts the numbers on the clipboard for a bug report. The new `diagnostics:getProcesses` channel (`getProcessDiagnostics`) feeds it, and the review opens it and checks the numbers move.
- 54d913a: Widgets by convention, placed like screens: an app's widgets are `src/widgets/<id>.widget.tsx` files whose default export is the component and whose `meta` holds the label, icon, popOut, devOnly, visibility, side and sizes. `brock sync` and the dev server write `.brock/widgets.ts`, and `BrockApp` takes it as the new `widgets` prop; `defineWidget`, `registerWidgets` and module widgets keep working. `brock structure` checks the folder, the lint config lets widget files export `meta` beside their default export, the starter app has a Notes widget, and `brock adopt` gives each app of a workspace its own views and prints where every kind of code goes. The `widget-files` migration wires `src/main.tsx` and lists every hand-made widget as a to-do naming its new file. Brock's own Logs and Performance widgets follow the same layout inside brock-react, and `docs/app-structure.md` maps where every piece of an app goes.

### Patch Changes

- Updated dependencies [48ca303]
  - @drizztdourden08/brock-core@0.11.0

## 0.10.0

### Minor Changes

- a265770: Every screen shows Tessera's page header with an icon and a title.

  - Breaking: `ScreenDef.icon`, `HubDef.icon` and `HubPage.icon` are required, and `ScreenLayer` takes a required `icon`. Every built-in screen has one: Profiles, Settings, About, Credits and the input tester.
  - A fullscreen screen's content sits in Tessera's `ScreenPage` inside the `ScreenLayer` card, with the screen icon and title. `header: 'own'` leaves the content to draw its own headers; hubs and the settings screen use it. Each hub page draws under its own header: settings pages in `SettingsPage` with their anchors, a settings tab that renders itself in `SettingsPage` too, and every other page in `ScreenPage`. `HubPage.fullBleed` keeps a page such as a bucket's hero home filling the pane.
  - The About screen passes the app name as the `InfoScreen` heading and an info icon.
  - The `screen-icons` migration (0.10.0) leaves a to-do on each `defineScreen` or `defineHub` call without an icon.
  - The review checks the page header, its icon and its title on every screen and every hub page that has one.

- a265770: Every settings row has a description and a hint, as in Tessera 0.10.0.

  - Breaking: a settings item is `{ key, label, hint, description | noDescription: true, keywords?, link?, control? }`, the same shape as Tessera's `SettingsItem`. The typecheck fails on an item without a `hint`, or without a `description` or an explicit `noDescription: true`. `SettingDescription` and `SettingItemFields` are exported, and a `choice` option takes its own `hint`.
  - Each item draws as a Tessera `SettingsRow`: the description under the title at rest, and the hint in its place while the control is pointed at or focused. A custom control from `renderControl` stays a content row, and a boolean item with a `link` stays a toggle with the link. `DefaultControl` is gone.
  - Search finds hints: the hub search matches the hint and each option's label and hint, the palette scores the hint like the description, and the build-time search seeds read `hint` from `.settings.ts` pages.
  - Every built-in row has a real description and hint: the template's General page, the display module's window and refresh rate rows, the updater dialog's pre-release and version rows, and the input module's dead zone sliders, which are now settings rows.
  - The `settings-row-hints` migration (0.10.0) leaves a to-do on each app settings row, in a `.settings.ts` page, a settings tab or a Tessera `SettingsSection`, that lacks a hint or a description, naming the missing fields.
  - The review points at a settings row on each settings page, checks that its hint replaces the description, and captures it.

- a265770: Brock takes Tessera 0.10.0. The catalog and the brock-react peer move to `^0.10.0`.

  - `brock migrate` replays the new `configKeys` group of Tessera's `RENAMES.json`: dotted setting paths moved inside JSON files a project keeps, by file name, where `*` stands for any one key such as an app folder. The step edits `tessera.config.json` and `package.json` at the app root, the repo root and every workspace package in place. A key whose parent stays the same is renamed where it stands, an object whose every key moves to the same new sibling is renamed whole, and any other key is cut and pasted at the indentation of its new place, with an emptied parent removed. Order, layout and indentation are kept, a second run changes nothing, and a target that is already set is never overwritten: it becomes a to-do. For Tessera 0.10.0 that moves the usage settings object to `guide`, at the top level and under each `apps` entry, and the `package.json` guide script to `guide`.
  - Brock's own `tessera.config.json` holds `guide`, and the prose exception for the old key is gone.

- a265770: Tessera 0.10.0 draws the widget window controls, so Brock's interim pieces are gone.

  - The popped options panel passes `sync`, `onSyncChange`, `group`, `groups` and `onGroupChange` to Tessera's `WidgetOptions`, which draws the "Sync with main window" switch and the "Window group" select with their tooltips and hints. `WindowGroupControls` is removed.
  - The app window shows Tessera's `WindowGuideOverlay` while a widget window moves or resizes. Brock's own overlay is removed.
  - The app title bar passes `windowGroup`, `windowGroups` and `onWindowGroupChange` to `WindowTitleBar`, so the View sub-menu has a Window group radio sub-menu. The cycling "Window group" title bar action and `useWindowGroupTitleAction` are removed.
  - A full screen window group sets Tessera's `square` on the open screen's `ScreenLayer` and on the widget window's `Widget`, in place of the `brock-app--square` and `widget-window--square` classes.
  - Brock keeps its own pin menu and "Stacking" row until Tessera reworks its pin button.
  - The review reads the new markup: the guide by `.window-guide--open`, its mode and its snapping line, the square chrome on an open screen, and the View > Window group sub-menu, with a capture of it. It also captures the popped widget options with the sync and group rows.

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

- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-core@0.8.0

## 0.7.1

### Patch Changes

- e0ea131: Brock takes Tessera 0.9.1: a Button leaving its loading state shows its label at once, so the About "Copy debug info" button is no longer blank in background windows and review captures.
  - @drizztdourden08/brock-core@0.7.1

## 0.7.0

### Minor Changes

- f6cfba5: Brock takes Tessera 0.8.0 and its rimmed logos. `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's `brand/<rim>-rim/<brand>/` set, and it defaults to `'light'` for the `brock` brand, so the mark reads on dark surfaces. `brock icons`, the splash mark, the bot variant, the installer and Setup splash mark read from that tree. `brock icons` also copies `icon-32.png` and `icon-24.png` to `public/logos/`, and with a brand `product.logos.app` defaults to `./logos/icon-32.png`, so the title bar no longer scales a 256 px icon down to 20 px and loses the rim. A copied file is skipped only when it holds the same bytes, so a rim switch recopies the set. The About panel draws a rimmed brand as its bare mark. Migration `gitignore-title-bar-logos` ignores the two new logo files.
- 6d32d18: Brock takes Tessera 0.9.0 (peer range `^0.9.0`): the slim side-nav scrollbar and typed InputIcon names, with no code changes in Brock.
- f6cfba5: Breaking: `RendererModule.titleBar` and `TitleBarSlot` are gone, and `STANDARD_TITLE_BAR_SLOTS` is now `STANDARD_TITLE_BAR_ACTIONS`. Tessera 0.8.0's `WindowTitleBar` takes `actions`, so a module lists `titleBarActions`: each a `WindowTitleBarAction` or a hook that returns one. Search (Ctrl+K) and Report a bug are standard actions, and the updater contributes `useUpdateAction`, a status pill reading "Update available" while an update waits. Every action is also in the hamburger, beside a View sub-menu with the pin and full screen, and an action replaces the menu entry of the same key there; Quit sits in its own group below them. The review checks the bar items, the menu actions and the View sub-menu. Migration `title-bar-actions` rewrites the updater badge and the standard buttons and leaves a to-do for any other slot.

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0

## 0.6.1

### Patch Changes

- 227dadf: Brock takes Tessera 0.7.1: the hero title fits its column, and the logs widget uses Tessera's own "1 entry" / "n entries" count instead of Brock's workaround.
  - @drizztdourden08/brock-core@0.6.1

## 0.6.0

### Minor Changes

- 0d9b68a: Brock moves onto Tessera 0.7.0. Hubs and settings hubs sit on `SideNavLayout`, a settings page draws one `SettingsSection` per section (with its own empty message), and hub search hits show their path and description. The logs widget hands `LogPanel` the whole log and keeps its type filter as a widget pref (`filters`, a list of filter clauses, in place of `hiddenLevels`). `ProfilesPanel` rows pass their aside as an end column. Popped widget windows follow Tessera's `visibleLayoutOf` gates, and `onPopOut` takes Tessera's `ScreenPoint`. The input tester and `CalibrationPanel` draw controller glyphs with Tessera's `InputIcon`: `CalibrationPanel` takes `family`, and `inputFamilyOf(vendorId)` picks Xbox, PlayStation, Switch or generic. The display settings tab lets its sections keep Tessera's spacing. Brock's root `tessera.config.json` sets `layer: renderer-shell` and an app tree for the panels Tessera handed over.

### Patch Changes

- @drizztdourden08/brock-core@0.6.0

## 0.5.0

### Minor Changes

- 241d164: Widget windows work end to end. A linked window is towed by the edge it sits on, so resizing the app from any side keeps it flush, and maximize or fullscreen hides the windows linked to the app until it is back to normal. Towed moves report their bounds, pending reports are flushed when the app closes or quits, and links survive a restart. The app snaps to widget windows with the same 14 px rule and links the one it lands against. A window lost after a display change comes back into a work area; a plain drag is left to the OS and no snap fights a move across displays of another scale. The `devOnly`, context-only and `show` gates close and reopen popped widgets, which keep their place. A drag-out opens the window at the release point: `onPopOut(id, point?: ScreenPoint)` is accepted ahead of Tessera 0.7.0, with the cursor as the fallback. Drop-in turns the window translucent over the app, ignores a drop where another widget window covers the app, and no longer loses a release between two renders; dock-backs carry a sequence number, Alt+F4 closes the widget, widget windows stay off the taskbar unless a definition sets `taskbar: true`, and followers come back without taking the focus. Widget windows get the active profile and the settings, with changes sent back to the app, and the log arrives as increments. The review drives all of it in a new `widget-windows` step.

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now, with ProfilesPanel replacing Tessera's ProfilePicker: brock-react exports `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel`, and `@drizztdourden08/brock-input/renderer` exports `CalibrationPanel`, each with its props types and a Tessera usage file. The About screen sits in Tessera's `InfoScreen`, the Profiles screen can rename a profile in its row (`useProfiles().rename`), the input tester shows the buttons held while it calibrates, and the updater dialog draws brock-react's `ReleaseNotesPanel`.
- babbff5: Brock takes Tessera 0.6.0 (peer range `^0.6.0`); Brock uses neither the renamed numeric Stepper nor Emphasis, so no code changes. Standards is at ^1.0.3.

### Patch Changes

- @drizztdourden08/brock-core@0.4.0

## 0.3.0

### Minor Changes

- dde5d7e: Brock takes Tessera 0.5.0 (peer range `^0.5.0`): screens sit in Tessera's ScreenWindow (the former FullScreenLayer, classes `screen-layer*` and `screen-window__*`), and the title-bar search button draws the twinkling search icon in place of the removed SearchSpark. Brock's own code was moved with `brock migrate --tessera-from 0.4.0`.

### Patch Changes

- @drizztdourden08/brock-core@0.3.0

## 0.2.0

### Patch Changes

- Brock takes Tessera 0.4.0: SectionNav is SideNav and HeaderTabs is HeaderAnchorNav (replayed with Brock's own Tessera renames step), the title bar menu, the fixed-head search results and the config loader are the published ones.

  New apps' knip ignores `@drizztdourden08/standards`, whose stylelint plugins it sees through brock-lint-config; the `standards-lint-deps` upgrade step does the same for an existing app and drops `typescript-eslint` and `eslint-plugin-react-hooks`, which standards now carries.

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- 374cf2f: `upgrade` moves the app's Tessera to the range brock-react asks for (its catalog entry or plain spec; a linked Tessera is left alone), so an app upgraded across a Tessera release installs the Tessera its new Brock was built on. brock-react's Tessera peer range is `^0.4.0`.
- Updated dependencies [f818087]
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- db1a6be: A hub search shows a settings page's matching rows live, under their section titles and editable in place, as rotp's profile hub does, instead of links. Other pages keep link hits; pages whose name matches are offered as jumps. The review checks the live row, its control and the group heading.
- f60b232: `product.widgets.mainLabel` in `brock.config.ts` names the main view in the widget dock (default `Main`). The saved layout key stays `main`.
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 7e039b6: Every app gets a Ctrl+K search palette with an action API, a bug report dialog that opens a prefilled GitHub issue with diagnostics attached, a fuller About, toasts, and a widget host with a built-in logs widget kept per profile.
- 9fdc2e1: Brock builds on Tessera 0.2.0, which brings the brand gradients, resolved tokens and transparent marks the splash and installer read.
- d50bd75: Every visual part of the shell is now a Tessera composite and Brock keeps only the wiring. The title bar is `WindowTitleBar`, the search palette is `CommandPalette` behind `PaletteHost`, About is `AboutPanel`, the profiles screen is `ProfilePicker` with `InlineCreateForm`, the screen rail is `SectionNav` in its rail variant, hubs and the settings hub sit in `NavLayout` with `SearchResults`, and settings pages are Tessera's `SettingsPage` with `SettingsGroupList`. The bug report button takes the `IconButton` danger tone, the diagnostics preview is a `CodeBlock`, the logs widget colours warnings and errors through `LogKindDef` tones, and the updater dialog uses `ReleaseNotesPanel` and `Callout`.

  Removed exports: `TitleBar`, `WindowControls`, `InstanceBadge`, `About`, `ProfileCard`, `CreateProfileForm`, `ScreenRail`, `SettingsPage`, `SearchPalette` and `partitionByLock`; use the Tessera composites in their place. `useProfiles` gains `removeConfirmed`, which deletes without the confirm dialog. The search flash class is now `search-hit`.

  Breaking: the removed shell exports ship the `removed-shell-exports` migration, which turns each import into a to-do naming its Tessera composite.

- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
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

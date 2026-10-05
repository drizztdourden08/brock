# @drizztdourden08/brock-react

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

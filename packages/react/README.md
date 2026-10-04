<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-react

The renderer layer of Brock: `BrockApp`, the platform provider and its hosts, the stores kit, the screen registry, the settings engine and the shell views. Everything in JSX is a Tessera primitive or composite; every stylesheet takes its values from Tessera tokens.

## Using it

```tsx
import '@drizztdourden08/tessera/tokens.css';
import './theme.css';
import { BrockApp } from '@drizztdourden08/brock-react';
import { product } from './product';
import { DEFAULT_SETTINGS } from './settings.constants';
import { rendererModules } from '../.brock/modules.renderer';
import { screenTree } from '../.brock/screens';

<BrockApp product={product} settings={{ defaults: DEFAULT_SETTINGS }} screenTree={screenTree} modules={rendererModules} />
```

`screenTree` comes from the files in `src/screens` (see Screens by convention). An app not yet converted passes `screens`, `home`, `menu` and `settings.tabs` as before.

`BrockApp` composes, outermost first: `PlatformProvider` (host factories plus module ports), the app context, the screen registry, the settings store, the module Providers, then the shell: Tessera's `WindowTitleBar` where the host has window chrome, `ScreenHost` (the home screen with the open screen over it) and `ConfirmDialog`. Nothing inside the app window shows loading: the splash window does. Built-in screens `profiles`, `settings` and `about` are registered unless the app supplies one with the same id, plus `credits` when the `credits` prop is given.

`AppShell` runs the renderer boot tasks once: `profiles` (the pinned instance profile, an unknown name fails loudly, else the only profile, else the last one used, else the `profiles` screen), `settings` (waits until the active profile's settings are hydrated), `fonts` (the `--font-sans` and `--font-title` stacks loaded), `images` (the app logo decoded, and the instance logo on an instance launch), module `bootTasks`, the `bootTasks` prop (`.brock/boot.renderer.ts`), then `first-frame`, which sets the boot phase to `painting` and resolves two frames after the shell commits. Progress goes to main on `boot:progress` with a heartbeat every second, then `boot:ready` or `boot:failed`. `defineBootTask` types a renderer task; `useBootStore` exposes the phase. A task that fills a session store runs `after: ['settings']`, since the profile hydration resets every session store before `settings` resolves; in development the boot warns in the app log when that reset wipes a filled store and names the tasks that can run before `settings`.

## Public API

| Area | Exports |
|---|---|
| App | `BrockApp`, `useBrock`, `useProduct`, `useDeveloperTools`, `useConfirmDialog`, `buildMenu` |
| Escape | `escapeLayers`, `useEscapeLayer`, `resolveEscape` |
| Screens | `defineScreen`, `createScreenRegistry`, `useScreenRegistry`, `ScreenHost`, `ScreenLayer`, `matchesShortcut` |
| Screen conventions | `defineScreens`, `buildScreenTree`, `resolveScreenTree`, `deriveMenu`, `ScreensConfig`, `BucketDef`, `ScreenMeta`, `ScreenEntry`, `ScreenTree`, `CardProps`, `PageProps`, `HeroProps`, `HeroSlots` |
| Navigation | `useNavigation`, `useNavigationStore`, `nav` (for code outside React), `joinRoute`, `resolveRoute`, `routeAliases` |
| Stores | `createSettingsStore`, `useSettings`, `useSettingsStore`, `useSettingValue`, `createSessionStore`, `resetAllSessionStores`, `useProfiles`, `useProfilesStore`, `useDialogStore`, `dialogs`, `useWidgetPrefStore` |
| Boot | `defineBootTask`, `useBootStore`, `RendererBootTask`, `RendererBootContext` |
| Platform | `PlatformProvider`, `usePlatform`, `useCapability`, `getPlatform`, `setPlatformPorts`, `installApiShim`, `createElectronFactory`, `createWebFactory` |
| Settings | `SettingsHub`, `SettingsLayout`, `SettingsPageContext`, `createTabRegistry`, `resolveSections`, `matchTabs` |
| Shell | `useAboutInfo`, `useRailEntries`, `ConfirmDialog`, `ProfilesScreen`, `WorkspaceSwitch` |
| Compounds | `AboutPanel`, `ProfilesPanel`, `ReleaseNotesPanel`, with their props types |
| Modules | `RendererModule`, `mergeModules` |
| Menu | `MenuEntry`, `MenuItem`, `MenuSection`, `MENU_SECTIONS`, `toMenuGroups`, `MenuResolver` |
| Host, log, profiles | `hostApi`, `requireHostApi`, `instanceName`, `instanceProfile`, `isAutomationLaunch`, `isInstanceLaunch`, `createAppLog`, `getAppLog`, `exposeLogGlobals`, the renderer profile store functions |
| Hooks | `useSafeAreaInsets`, `applyNotchMode`, `useWidgetPref` |
| Standard overlays | `StandardOverlays`, `STANDARD_TITLE_BAR_ACTIONS` |
| Search | `PaletteHost`, `SearchButton`, `palette`, `usePaletteOpen`, `buildSearchIndex`, `useSearchIndex`, `useSearchEntries`, `registerSearchActions`, `useSearchActions`, `rankEntries`, `entriesInBucket`, `openSearchTarget`, `buildCatalog` |
| Bug report, diagnostics | `BugReportDialog`, `BugReportButton`, `bugReport`, `buildIssueUrl`, `buildIssueBody`, `useDebugText`, `buildDebugText`, `runtimeLabels`, `formatLogLine`, `useAppVersion` |
| Toasts | `toast`, `dismissToast`, `ToastHost`, `useToastStore` |
| Widgets | `WidgetHost`, `defineWidget`, `registerWidgets`, `widgetsFromFiles`, `widgets`, `useWidgetMenuEntries`, `buildWidgetMenuEntries`, `useWidgetLayoutStore`, `LogsWidget`, `PerformanceWidget`, `WidgetMeta`, `WidgetFile` |

## Layout: menu or rail

`layout` picks where the screens are listed. The default, `menu`, keeps them in the title-bar dropdown. `rail` draws Tessera's `SideNav` in its `rail` variant down the left edge of the screen host: every registered screen, grouped by `ScreenDef.group` (ungrouped screens first, then groups in first-seen order), with its `icon` and `title`. The title bar then keeps only the window controls, the instance badge and the menu entries that are not screens. `screenGroups` gives a label per group id; a group without one shows its id. A `devOnly` screen is listed only with developer tools on and a `requiresProfile` screen is disabled until a profile is active. Picking the home screen closes the open one.

```tsx
<BrockApp
  layout="rail"
  screenGroups={[{ id: 'library', label: 'Library' }]}
  screens={[home, library]}
  home="home"
/>
```

`useRailEntries(screens, home, groups?)` is exported on its own: it returns the `SideNav` config, the active id and the select handler the rail uses.

## Screens

```ts
defineScreen({
  id, title, icon, render(ctx), layer?: 'fullscreen' | 'own', header?: 'page' | 'own' | 'none', keepMounted?, devOnly?,
  group?, shortcut?: 'Mod+Comma', requiresProfile?, subtitle?(ctx), extra?(ctx), floating?(ctx),
});
```

`ctx` carries `params`, `profile`, `open` and `close`. Every screen has an `icon` and a `title`. A fullscreen screen draws inside `ScreenLayer`, the reference frame: a card at 90% of the window over a scrim, one header with the title, `subtitle`, `extra` controls and the close button, and `floating` overhanging the top edge. Inside the card, the screen's content sits in Tessera's `ScreenPage`, the page header with the glowing icon and the title over the backdrop, which compacts once the body scrolls; `header: 'own'` leaves the content to draw its own headers, as a hub does for its pages, and `header: 'none'` marks a screen with no page header at all, as About is; the review then checks that none shows. `ScreenLayer` takes `square` for a window shown fullscreen, and `BrockApp` sets it while the window's snap cluster is in full screen. It enters over 0.2 s, with no entrance while the app boots. An own screen draws its own frame. Every screen with a shortcut toggles on it.

## Hubs

`defineHub` returns a fullscreen screen, so a hub sits in the same card as every other screen: the hub title with the profile name as subtitle, the active page's tabs in the header, the section nav and the page inside. `HubDef.icon` and `HubPage.icon` are required. Each page draws under a page header with its icon and label: a settings page in Tessera's `SettingsPage`, with its section anchors, and any other page in `ScreenPage`. A page with `fullBleed: true`, such as a bucket's hero home, fills the pane itself. With two hubs or more, a hub switch overhangs the top edge of the card and moves between them.

## Screens by convention

An app lists its buckets in `src/screens/screens.config.ts` with `defineScreens({ buckets, home, settings? })` and drops one file per screen under `src/screens`. `brock sync` and the dev server write `.brock/screens.ts`, which calls `buildScreenTree(config, entries)`; `BrockApp` takes the result as `screenTree`.

- A bucket folder is one hub. `<id>.hero.tsx` is its home and gets `HeroProps`: the page props plus `slots` (`Title`, `Eyebrow`, `Backdrop`, `Shade`, `Art`, `Actions`, `Tools`, `Facts`, `Aside`, `Panel`), one per slot of the Tessera `Hero` composite; `Facts` takes `rows` of `{ label, value, mono? }` facts; `Art` takes Tessera's `HeroArt`, `kind: 'image'` with `src`, `alt` and `pixelated` or `kind: 'node'` with `node` and `label`; `Backdrop` takes Tessera's `HeroBackdrop` (`kind: 'node'`, `'image'` or `'color'`), or `kind: 'none'` for no backdrop, and without it the hero draws the brand gradient; `Shade` takes `value`, `fade`, `scrim` or `none`. `<id>.page.tsx` is a page and gets `PageProps` (`params`, `profile`, `open`, `close`, `bucket`, `page`, `tab`). A folder of `<tab>.tab.tsx` files is one page with header tabs. `<id>.settings.ts` default-exports sections and becomes a settings page. A subfolder without tabs is a nav group.
- `<page>.custom.tsx` in a bucket is a custom page: the hub frame, nav entry, header, Escape and search stay standard and the content is free. It gets `PageProps` and must export `searchEntries: SearchEntrySeed[]`, a literal list the build reads.
- At the root, `<id>.card.tsx` is a card screen and `<id>.layer.tsx` draws its own full-bleed layer; both get `CardProps`.
- `meta: ScreenMeta` sets `title`, `icon`, `order`, `shortcut`, `devOnly`, `requiresProfile` and `keywords`.
- `resolveScreenTree(tree, builtInTabs)` runs inside `BrockApp`: it adds the built-in and module settings tabs to the settings bucket, turns each hub into a screen with `defineHub`, derives the menu with `deriveMenu` and points the `settings` route at the settings bucket, so no separate Settings screen is registered.
- The menu reads `BucketDef.menu`: `entry` for one entry, `submenu` for one child per page, `hidden` for none. The home bucket is already the Home entry. `MenuItem` takes `{ bucket, page, tab }` as a target, and `open('game/tracker/map')` opens that bucket, page and tab.
- The hero slots come from `screens/kinds/hero-frame.constants.ts`, the one place the Tessera Hero composite plugs in. The page renders the slots it fills and the frame draws one `Hero` with them.

## Widgets by convention

An app drops one file per widget in `src/widgets`: `<id>.widget.tsx`, whose default export is the component and whose optional `meta: WidgetMeta` holds the `defineWidget` fields but `id` and `render` (`label`, `icon`, `popOut`, `devOnly`, `taskbar`, `defaultVisibility`, `defaultSide`, `defaultDockedSize`, `defaultFloatingSize`) plus `settings`, a component for the options panel. `brock sync` and the dev server write `.brock/widgets.ts`, which calls `widgetsFromFiles([{ id, component, meta }])`; `BrockApp` takes the result as `widgets` and adds it to the module widgets, in the main window and in a popped widget window. A widget without `label` is named after its id in title case. `defineWidget`, `registerWidgets` and `RendererModule.widgets` still work.

Brock's own widgets have the same shape: `src/widgets/built-in/logs.widget.tsx` and `performance.widget.tsx` beside their component folders, listed in `built-in-widgets.constants.ts` through `widgetsFromFiles`.

## Performance widget

The built-in `performance` widget is the debug view for a bug report. It starts closed and sits in the Widgets menu for everyone, developer tools or not, and it pops out like any widget. It is built from Tessera's chart parts:

- **Tiles:** a `StatTile` each for frame rate, CPU, memory and event loop lag, with the latest value, the change since the previous sample and its trend, and a `Sparkline` of the last 60 samples (a low frame rate band, a lag band above 50 ms).
- **Gauges:** the app's CPU, its share of system memory and the JS heap against its limit, each a `Gauge` with warning and danger zones. They take the largest size that fits side by side.
- **Memory by process:** a `StackedBar` of the working set of main, the renderer, the GPU, utility processes, widget windows and anything else, with a legend and the total against system memory.
- **Activity:** long tasks since the widget opened, and the errors and warnings since start (counted by the app log bus; a popped window counts the relayed log).
- **Details:** collapsed by default (kept with `useWidgetPref`); every reading as Tessera `StatRow`s in three groups. Renderer: frame rate and average and worst frame time (`requestAnimationFrame`), long tasks and their total time (`PerformanceObserver` `longtask`), event loop lag (the worst drift of a 100 ms timer), the JS heap and its limit where `performance.memory` exists, the DOM node count. Processes, from `diagnostics:getProcesses` in main: the process count with total CPU and memory, the system memory, the main process memory and heap, uptime, the window count, IPC calls per second and in total, the Electron, Chrome and Node versions, GPU compositing, then one row per process (CPU, working set, the window it draws) and one per widget window. App: version, screen and route, profile, the open widgets, the active modules and the log counts. In a browser preview there is no main process and the Processes parts stay out.

A container query lays it out: docked (280 to 360 px) two tiles a row with the panels stacked, from 560 px four tiles a row with the gauges beside memory and activity. The widget body is Tessera's slim `ScrollArea`, so the widget adds no scroll box of its own.

The options panel (`PerformanceSettings`) sets the refresh, 0.5, 1, 2 or 5 s (1 s by default), and which sections show (Renderer, Processes, App), both kept with `useWidgetPref`. Nothing is sampled while the widget is off screen: an `IntersectionObserver` on its root and the page visibility gate the frame loop, the observers, the lag timer and the IPC poll, so a closed, tabbed-away or minimized widget costs nothing, and a hidden section is neither drawn nor sampled. Each sample is one state update, and the chart parts update their elements in place. Copy snapshot copies every reading as text, under a dated title. The review's `performance` step opens it from the Widgets menu, checks that it samples, that the four tiles, their sparklines, the CPU and memory gauges and memory by process (main and renderer at least) render, that sparklines and tiles move within 2.5 s and that the panel adds no scroll box inside the widget body, captures it docked, then pops it out and captures it narrow and wide.

## Search

The palette and every hub search read one index of `SearchEntry { id, kind, label, keywords, breadcrumb, target: { route, anchor? }, icon }`.

- `.brock/search.ts` calls `buildSearchIndex(config, seeds)` with seeds the build read from the screen files: buckets, pages, tabs, cards, settings sections and rows, and each custom page's `searchEntries`. It imports no screen file, so page code stays lazy. `screens.ts` hands the result to `buildScreenTree` and it reaches `BrockApp` as `screenTree.search`.
- `useSearchIndex(enabled, menu, actions)` merges it with the live sources: module screens and settings tabs, the widget registry, the menu, the registered actions and the `useSearchEntries` entries. Entries with the same id or the same target appear once, the build index first.
- `useSearchEntries(entries, route?)` adds `SearchEntrySeed` entries while the caller is mounted, pointing at the page open when it mounted (or `route`). Pass a stable list.
- `rankEntries(entries, query)` folds case and accents and needs every word to match the label, a keyword, the description, the hint or the breadcrumb. `entriesInBucket(entries, id)` keeps what one hub shows.
- `openSearchTarget(target)` opens the route through `nav.open` and scrolls to the element whose `data-setting-key`, `data-section` or `data-search-anchor` equals `anchor`, flashing it with `search-hit`.
- A generated hub has search on: SideNavLayout's results slot shows Tessera's `SearchResults`, one group per page, and a hit jumps to its page and row. Ctrl+K (Mod+K) inside an open hub focuses its search; elsewhere it opens the palette.
- The product brand's mascot (Tessera's `mascotForBrand(product.icons.brand)`: Flint for `brock`, Pelago for `archipelia`, Sentri for `rotp`) sits in the palette's input row, as Tessera's `CommandPalette` `mascot`, and in every hub search: it looks around while the field is empty and jumps up in alarm when nothing matches. A brand without a mascot, or no brand, shows the plain search icon and no mascot.

## Escape and home

Escape closes the topmost thing: an open escape layer, then the confirm dialog, then the open screen. With nothing open it opens the home screen, the Home menu entry's target. With a `screenTree` that is `config.home`; otherwise `product.homeScreen` names it (`settings` by default). The `homeScreen` prop overrides both. A surface that must close first, a palette for example, registers itself with `useEscapeLayer({ isOpen, close })` or `escapeLayers.add`; the last one registered that reports open is closed first.

## Menu

The built-in order is Home, Profiles, Settings (left out when it is home), the app entries, the sections, then the module entries, Credits, About and Quit. Every built-in entry has an icon; `icon` takes a Tessera icon name or any node. An entry with `section` goes into that submenu: `widgets` and `advanced` come first, any other id becomes a section named after it. `devOnly` entries show only with developer tools, which are on in development or when the `developerToolsEnabled` setting is true; the built-in Dev Console in Advanced is one of them. Widgets holds the `useWidgetMenuEntries()` toggles and Advanced always holds Report a bug. The search palette and the bug report dialog are registered escape layers. Credits shows when a `credits` screen exists, which the `credits` prop registers.

## Settings

A tab is `{ id, label, navIcon, group, sections(settings) | render(ctx), icon?, mobileOnly? }`. Sections hold items keyed by settings key (dotted paths allowed). `SettingsHub` wires the tabs into Tessera's `SideNavLayout` and `SearchResults`; `SettingsLayout` feeds one tab's sections, with per-section reset and lock overlays, as one Tessera `SettingsSection` per section inside `SettingsPage`. The settings store hydrates per profile, patches, runs effects `(patch, next, prev)` and saves 300 ms after the last change. The `settings` prop of `BrockApp` also carries the control hooks the hub forwards to every tab: `renderControl` for non-boolean keys, `isDisabled`, `lockCauseOf` and `lockOverlay`; a tab that needs its own layout still uses `TabDef.render`.

## App shell

- `BrockApp` is the composition root: it resolves the modules once, creates the log bus, the settings store and the screen registry, installs the api shim on hosts without a bridge, then wraps the shell in the platform, settings and module providers. Module Providers nest with the first module outermost. The title bar is drawn only where the host reports the `windowChrome` capability.
- Palette: `BrockApp` imports Tessera's brand palettes (`@drizztdourden08/tessera/palettes/<brand>.css`, in the `ds.palette` layer) and sets `data-palette` on the document root to `product.icons.brand`, in the main window and in every popped widget window, so the app shows its brand's colours. The app's `src/theme.css` is unlayered, so any seed it sets wins; the starter's theme sets none.
- Props: `home` is the screen id drawn as the base layer once a profile is active; `homeScreen` overrides `product.homeScreen`; `menu` holds the app's title-bar entries, placed as described under Menu (a built-in entry is skipped when the app or a module already names that screen); `credits` is the content of the Credits screen; `settings.effects` run on every patch and receive the patch and both states; `profileHooks` carry the app-specific profile fields and patchable keys; `legalText` is the licence and attribution copy. The title bar and the about screen show `product.logos.app`, and a named instance shows `product.logos.instance`; a Tessera brand draws in the About panel as its app icon, or as its bare mark with `product.icons.rim`.
- Startup order: the pinned instance profile (matched by id, then by name; an unknown name logs an error and opens the profiles screen instead of running on the wrong data), else the only profile, else the last one used, else the profiles screen. `settled` turns true in a `finally` block so every exit path, a failed boot included, still ends with a visible window.
- The `first-frame` task waits for the shell to commit with the boot phase `painting`, then for two animation frames: the first commits the layout, the second proves it painted. The frame request is not cancelled on effect cleanup, because a strict-mode double invoke would cancel the only scheduled signal.
- Keyboard: Escape follows the order under Escape and home; Alt+Enter toggles fullscreen; a screen's shortcut toggles it, a `requiresProfile` screen waits for a profile, a `devOnly` screen only responds with developer tools on; while an input, textarea or contenteditable is focused, screen shortcuts fire only with Ctrl or Meta held. A shortcut string is tokens joined by `+` (`Mod` matches Ctrl or the platform's command key; aliases `Comma`, `Period`, `Space`, `Esc`, `Return`).
- When the active profile changes, every session store resets and the settings store loads that profile's config; with no profile the settings return to the defaults. Log entries main sends over IPC are forwarded into the renderer's log bus; an unknown channel lands on `ipc` and an unknown level reads as `info`.

## Host, log and profiles

- The preload installs `window.api` before the renderer runs; a web or mobile host has none unless the app installs the shim, so `hostApi()` returns null instead of throwing at module load, and `requireHostApi()` is for call sites that only run on a host with a bridge. Both take the app's own maps as a type argument and add their methods to the base ones, so an app reaches its channels without a cast: `hostApi<{ invoke: typeof APP_INVOKE_MAP; events: typeof APP_EVENT_MAP }>()`. Without one they return the base `IpcApi`.
- `instanceName` and `instanceProfile` read the launch identity flags from the preload bridge at call time. A named instance is an automated launch running beside the person's own window: marked on screen, booted into its own profile, never writing the files every launch shares. `isAutomationLaunch` is true for any automated launch, named or not.
- There is one log bus per app, created by `BrockApp` with the module channels; plain modules reach it through `getAppLog()`. In development `__logEntries` and `__logSubscribe` are exposed on `window` so an automation harness can read them.
- The renderer profile store wraps the core store bound to the platform `FileStore`; `configureProfileStore` must run before the first store call and resets the cached store. `setLastProfile` is a no-op on an automated launch, gated at this single seam so no call site can forget that an automated run never repoints the shared `app.json`.

## Platform

- The `Platform` facade is resolved once on first use so hooks (through the provider) and plain modules (through `getPlatform`) share one instance; `setPlatformPorts` must run before the first `getPlatform()` and throws afterwards. Module ports are registered before the facade resolves. The `platform-mobile` class is reflected on the document root because portaled surfaces sit outside the app subtree.
- Every Electron port delegates to the preload bridge so the renderer never touches Node or Electron directly; the device port is inert because the desktop window handles sleep and backgrounding itself. The web factory is also the fallback when no host matches: no window chrome, no persistent storage, a file picker built on an input element and a download link; a browser cannot tell whether a download finished, so a started download counts as saved.
- The api shim is a boot-safe `window.api` stub for hosts without a preload, built from the channel maps so every method exists: events return a no-op unsubscribe, sends do nothing, invokes resolve to an empty value (an array for `listMethods`, a shaped value for those in `returns`, else null). It is a no-op when a real bridge is present; an app with extended maps installs its own shim before rendering.

## Screens and menus

- The home screen is the base layer and the open screen draws over it. A fullscreen screen gets the shell's `ScreenLayer`, an own screen draws its own frame. The mounted set is the active screen plus every `keepMounted` screen opened once this session; those stay mounted hidden so their scroll and local state survive being closed. `defineScreen` defaults: layer fullscreen, `keepMounted` false, `devOnly` false, `requiresProfile` true. An app screen with the same id replaces a built-in one; the profiles screen needs no profile because it is the setup screen when none exists.
- `ScreenLayer`: `extra` holds controls in the header line before the close button; `floating` overhangs the top edge of the card; `hidden` keeps the layer mounted but out of sight.
- A menu item either opens a screen by id or runs its own `onClick`; the title bar menu resolves `screen` through navigation so app and module menus stay plain data. Every pick closes the menu first; separators inside a submenu are dropped because the dropdown draws them at the top level only. Modules are flattened in module order, ports merged per host with later modules winning on the same key, log channels deduplicated.
- `nav` is the imperative navigation surface for callers outside React; `toggle` opens when closed or another screen shows and closes when that screen is already open.

## Settings engine

- A section holds either flat `items` or named `subsections`, never both. Each item is `{ key, label, hint, description | noDescription: true, keywords?, link?, control? }`, the same shape as Tessera's `SettingsItem`: the typecheck fails on an item without a `hint`, or without a `description` or an explicit `noDescription: true`. Each item draws as a Tessera `SettingsRow`, the description under the title at rest and the hint in its place while the control is pointed at or focused; a `choice` option can carry its own `hint`. `control` picks the input: `choice` (`options`, `look?: 'segmented' | 'select' | 'radio'`; a select above three options, a segmented control otherwise), `select` (`options`, `searchable?`), `radio`, `range` (a slider), `number` (`min?`, `max?`, `step?`, `unit?`), `text` and `password` (`placeholder?`) and `tags` (`suggestions?`, `placeholder?`), each the SettingsRow input of the same name; a boolean with no control is a toggle. In development a row that resolves to no control logs one warning naming its key, instead of drawing nothing in silence. Keys may be dotted paths into a nested settings object (`haptics.intensity`). The hub search matches the label, the description, the hint, the option labels and hints and `keywords`, extra words a search matches on; the palette and the build-time search seeds match the label, the description, the hint and `keywords`; `link` is an external URL shown beside the description of a boolean item. `SettingLockCause` is the app's own vocabulary and null means unlocked. Omitting `defaults` hides the per-section reset; `renderControl` returning null falls back to the boolean toggle; `lockOverlay` defaults to a disabled overlay naming the cause. A tab's `navIcon` is the line icon for nav and header, `icon` a short mark for search rows; tabs sharing a `group` sit together in first-seen order.
- `SettingsHub`: while the search field has focus or holds text, no tab is selected and the pane shows matching settings from every tab; picking a tab from the nav or a result clears the search. `activeTab` is a controlled active tab (the hub keeps its own when left out); `homeTabId` is pinned above the groups and defaults to the first tab; `backdrop` is drawn behind every page header; `mobileOnly` tabs are listed only on a mobile form factor. Per-tab match counts use the same filter as the pages (`resolveSections`), so a count always equals the rows drawn.
- `SettingsLayout` reads the page context: `page` draws a full Tessera `SettingsPage` whose header links to each section; `results` draws only the rows matching the (lowercased, trimmed) query, bare, so a search pane can stack every tab's matches, or null when none match; no context draws the bare sections. A section with subsections yields one titled group per subsection; a flat section yields one untitled group anchored on the section itself. Empty groups and sections are dropped so a search that matches nothing leaves no stray heading.
- Locks: items are split into contiguous runs by lock cause so neighbouring rows locked for the same reason share one overlay; runs with different causes never merge. Reset: a key counts as changed only when the defaults know it, the row is not locked, and the stored value differs (compared by JSON serialization); a nested field is written through a copy of the live parent object so sibling fields the section never listed survive. A search narrows a section to the rows it still shows, and the per-section reset follows that: it resets exactly the settings in front of the reader.
- The settings store: `patch` merges a partial, runs the effects with `(patch, next, prev)` and schedules a debounced save (default 300 ms). Hydrating a new profile flushes the pending save for the old one first, so a quick switch never writes one profile's settings into another's file; a hydration token discards a stale load. `reset` returns to the defaults with no profile and saves nothing; `flush` writes any pending change now. `BrockApp` creates one store from the app's defaults and `useSettings` reads it typed as the app's own settings shape.

## Shell views and stores

- Title bar: the shell renders Tessera's `WindowTitleBar`, which draws the hamburger and the menu from `toMenuGroups(menu, { openScreen })`, with the trailing Quit in its own group, and reports every button to one `onControl`; it takes `actions`: `STANDARD_TITLE_BAR_ACTIONS` (Search with Ctrl+K, Report a bug) then each module's `titleBarActions`, a `WindowTitleBarAction` or a `TitleBarActionHook` that returns one; every action is also an item of the hamburger, beside the View sub-menu with the pin and full screen, and replaces the menu entry whose key is its id; `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; an empty menu hides the hamburger; the shell conceals the bar when the `windowMode` setting is `borderless` or `fullscreen`, read by key, so no module import is needed, and the bar peeks while the pointer is in the 40 px strip along the top edge; a normal launch shows no instance badge. The instance badge shows the name verbatim because the name is the identifier.
- About: the About screen is Tessera's `InfoScreen`, with no page header, holding Brock's `AboutPanel`, which shows the logo and the app name, with the rows from `useAboutInfo` and the legal text in the screen footer; the version comes from the bridge's `getAppVersion` and falls back to `0.0.0` without a bridge; the copy button is Tessera's `CopyButton`, putting the debug text on the clipboard; a product whose `icons.brand` is the Tessera brand of the same name shows that brand's app icon and wordmark.
- `ProfilesScreen` doubles as the setup screen when no profile exists (the form is forced open); it wires Brock's `ProfilesPanel` to `useProfiles`: picking a profile makes it active and closes the screen, renaming edits the name in the row, deleting asks once in the row and then removes it, and `createOptions()` is merged into the create request. Enter in the name field submits, `canSubmit: false` blocks submit while an extra field is incomplete, and `extraFields` render between the name and the actions. A failed create or rename shows its message in the form. `WorkspaceSwitch.label` is the accessible name for the whole switch.
- Profiles store: `rename(id, name)` on the store, and `useProfiles().rename(profile, name)`, write the new name and refresh the list; renaming the active profile updates `active` too.
- Profiles store: selecting a profile records it as the default for the next launch (skipped on an automated launch) and bumps its last-played time; `loaded` is true once the first refresh finished. `useProfiles().remove` asks first through the confirm dialog, and when the active profile is deleted the profiles screen opens so the app is never left without one.
- `confirmAction(options)` is the promise form: it resolves `true` on confirm and `false` on cancel, Escape or a newer dialog.
- The shell shows one confirm dialog at a time; `dialogs` is the imperative surface for code outside React; `confirmAction` is the one confirmation API, and `dialogs.confirmDelete` is deprecated: a thin call to `confirmAction` with a red Delete button that runs `onConfirm` on confirm; `dismiss` runs the config's `onCancel`.
- Every store made with `createSessionStore` is tracked, and `resetAllSessionStores()` returns each to its initial state when a new profile is selected. Widget preference values must survive a JSON round-trip; the widget-pref store is a session store, so a new profile starts empty and the host hydrates it from disk and saves on change.

## Compounds

Brock's own compounds sit in `src/compounds/<Name>/`, the `parts.compounds` folders of the root `tessera.config.json`. Each was made with `brock tessera new compound` and carries a `<Name>.usage.ts` that says when to use it; `brock structure` fails without it, and `brock tessera check` checks the sentences, the example and the props hash.

- `AboutPanel`: the body of an About screen. `title`, `brand` and `heading` (`wordmark` or `title`) draw the app icon and the wordmark of a Tessera brand, or `logo` and the title for any other app; `rows` are `StatRow` facts; `copyText` shows a copy button (null while it is gathered, left out to hide it) and `copyLabel` names it; `legal` is a dim paragraph at the bottom. It goes in as the children of `InfoScreen`.
- `ReleaseNotesPanel`: release notes in a box with a titled bar (`title`, default Release notes), plain text keeping its line breaks, scrolling past a fixed height. It fits the details of a `UtilityScreen` or the body of a dialog; the updater dialog uses it.
- `ProfilesPanel`: a premade profile list that replaces Tessera's `ProfilePicker`. `profiles`, `selectedId` and `onSelect` draw and pick; `onCreate(name)`, `onRename(id, name)` and `onDelete(id)` turn on the create form (Tessera's `InlineCreateForm`), the rename field in the row and the delete question (`ConfirmIconButton`). `onCreate` and `onRename` return a promise: the form closes when it resolves and shows the message of a rejection. `createOpen` keeps the create form open with no cancel; `extraFields`, `canSubmit`, `placeholder` and `newLabel` shape it.

## Hooks

- A mobile shell running edge to edge forwards the display cutout sizes as custom properties on the document root (`--sai-top`, `--sai-right`, `--sai-bottom`, `--sai-left`, in CSS px) and fires the `safeareainsets` window event when they change; hosts that set none read as zero. `applyNotchMode` toggles `notch-fill` or `notch-safe` on the document root.
- `useWidgetPref` is a `useState` drop-in whose value belongs to the profile: with a widget id the value survives unmount, a profile switch and a restart; with null it degrades to plain local state. The stored value is cast to the caller's type without validation; a value written by an older build with another shape lands there and the next write corrects it.

- `useNow(intervalMs, active = true)` returns the current time and ticks every `intervalMs` while `active`.
- `useCopyText(resetMs = COPIED_RESET_MS)` returns `{ copied, error, copy(text) }`. `copy` writes to the clipboard and resolves true or false; `copied` resets after `resetMs`. A button that only copies is Tessera's `CopyButton`.
- `useKeyedGuard()` guards async work per key: `guard(key, work)` returns the work's result, or undefined when it threw. `isBusy(key?)` with no key asks whether any key is busy. `errorOf(key)` and `clearError(key?)` read and clear the recorded message. `keyedGuardReducer` is the pure state machine behind it.

## Stories

`stories/*.stories.tsx` follow the Tessera story shape and import the package from `../src`. The gallery config is not wired in this repo yet; the files are ready for it.

## Automated review

On a `--review` launch `BrockApp` loads `review/run-review` as a separate chunk once startup settles; a normal launch never loads it. The tour drives the shell like a person, from the registries and the product config: title bar, first-run profile form, menu, every screen (through its menu entry when one exists, else `nav.open`), Escape to home, the palette, search from both the palette and a hub (with the brand mascot in the palette and in the hub search before typing and with no match), the bug report dialog, About, the logs widget docking, a pop-out widget opening in its own window, and the hero homes. Each step sends its checks and a screenshot request to main, which writes the report. Run it with `brock start -- --review --no-focus --muted --user-data=<dir>` after a build; the report is `Data/review/<name>/report.md`.

## Checks

```
pnpm typecheck
pnpm exec eslint packages/react
pnpm exec stylelint "packages/react/**/*.css"
```

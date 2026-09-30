<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-react

The renderer layer of Brock: `BrockApp`, the platform provider and its hosts, the stores kit, the screen registry, the settings engine and the shell views. Everything in JSX is a Tessera primitive or composite; every stylesheet takes its values from Tessera tokens.

## Using it

```tsx
import '@drizztdourden08/tessera/tokens.css';
import './theme.css';
import { BrockApp, defineScreen } from '@drizztdourden08/brock-react';
import { product } from './product';
import { DEFAULT_SETTINGS, SETTINGS_TABS } from './settings';
import { rendererModules } from '../.brock/modules.renderer';

const home = defineScreen({ id: 'home', title: 'Home', layer: 'own', render: () => <HomeView /> });

<BrockApp
  product={product}
  settings={{ defaults: DEFAULT_SETTINGS, tabs: SETTINGS_TABS }}
  screens={[home]}
  modules={rendererModules}
  home="home"
  menu={[{ key: 'rooms', label: 'Rooms', icon: 'users', screen: 'rooms' }]}
/>
```

`BrockApp` composes, outermost first: `PlatformProvider` (host factories plus module ports), the app context, the screen registry, the settings store, the module Providers, then the shell: `TitleBar` where the host has window chrome, `ScreenHost` (the home screen with the open screen over it), `ConfirmDialog` and `BootProgressBar`. Built-in screens `profiles`, `settings` and `about` are registered unless the app supplies one with the same id, plus `credits` when the `credits` prop is given.

Startup picks the profile: the pinned instance profile (an unknown name fails loudly), else the only profile, else the last one used, else the `profiles` screen. `useShellReady` signals main once startup settled and two frames painted.

## Public API

| Area | Exports |
|---|---|
| App | `BrockApp`, `useBrock`, `useProduct`, `useDeveloperTools`, `useConfirmDialog`, `buildMenu` |
| Escape | `escapeLayers`, `useEscapeLayer`, `resolveEscape` |
| Screens | `defineScreen`, `createScreenRegistry`, `useScreenRegistry`, `ScreenHost`, `ScreenLayer`, `matchesShortcut` |
| Navigation | `useNavigation`, `useNavigationStore`, `nav` (for code outside React) |
| Stores | `createSettingsStore`, `useSettings`, `useSettingsStore`, `useSettingValue`, `createSessionStore`, `resetAllSessionStores`, `useProfiles`, `useProfilesStore`, `useDialogStore`, `dialogs`, `useBootProgressStore`, `bootProgress`, `useWidgetPrefStore` |
| Platform | `PlatformProvider`, `usePlatform`, `useCapability`, `getPlatform`, `setPlatformPorts`, `installApiShim`, `createElectronFactory`, `createWebFactory` |
| Settings | `SettingsHub`, `SettingsLayout`, `SettingsPage`, `SettingsPageContext`, `createTabRegistry`, `resolveSections`, `matchTabs` |
| Shell | `TitleBar`, `WindowControls`, `InstanceBadge`, `BootProgressBar`, `About`, `useAboutInfo`, `ConfirmDialog`, `ProfileCard`, `CreateProfileForm`, `ProfilesScreen`, `WorkspaceSwitch` |
| Modules | `RendererModule`, `mergeModules` |
| Menu | `MenuEntry`, `MenuItem`, `MenuSection`, `MENU_SECTIONS`, `toDropdownItems` |
| Host, log, profiles | `hostApi`, `requireHostApi`, `instanceName`, `instanceProfile`, `isAutomationLaunch`, `isInstanceLaunch`, `createAppLog`, `getAppLog`, `exposeLogGlobals`, the renderer profile store functions |
| Hooks | `useSafeAreaInsets`, `applyNotchMode`, `useWidgetPref` |
| Standard overlays | `StandardOverlays`, `STANDARD_TITLE_BAR_SLOTS` |
| Search | `SearchPalette`, `SearchButton`, `palette`, `usePaletteOpen`, `registerSearchActions`, `useSearchActions`, `rankEntries`, `buildCatalog` |
| Bug report, diagnostics | `BugReportDialog`, `BugReportButton`, `bugReport`, `buildIssueUrl`, `buildIssueBody`, `useDebugText`, `buildDebugText`, `runtimeLabels`, `formatLogLine`, `useAppVersion` |
| Toasts | `toast`, `dismissToast`, `ToastHost`, `useToastStore` |
| Widgets | `WidgetHost`, `defineWidget`, `registerWidgets`, `widgets`, `useWidgetMenuEntries`, `buildWidgetMenuEntries`, `LogsWidget` |

## Layout: menu or rail

`layout` picks where the screens are listed. The default, `menu`, keeps them in the title-bar dropdown. `rail` draws a `ScreenRail` down the left edge of the screen host: every registered screen, grouped by `ScreenDef.group` (ungrouped screens first, then groups in first-seen order), with its `icon` and `title`. The title bar then keeps only the window controls, the instance badge and the menu entries that are not screens. `screenGroups` gives a label per group id; a group without one shows its id. A `devOnly` screen is listed only with developer tools on and a `requiresProfile` screen is disabled until a profile is active. Picking the home screen closes the open one.

```tsx
<BrockApp
  layout="rail"
  screenGroups={[{ id: 'library', label: 'Library' }]}
  screens={[home, library]}
  home="home"
/>
```

`ScreenRail` is exported on its own: `screens`, `home`, `groups?`, `collapsed?` (icons only, at the collapsed section-nav width), `className?`.

## Screens

```ts
defineScreen({
  id, title, icon?, render(ctx), layer?: 'fullscreen' | 'own', keepMounted?, devOnly?,
  group?, shortcut?: 'Mod+Comma', requiresProfile?, subtitle?(ctx), extra?(ctx), floating?(ctx),
});
```

`ctx` carries `params`, `profile`, `open` and `close`. A fullscreen screen draws inside `ScreenLayer`, the reference frame: a card at 90% of the window over a scrim, one header with the title, `subtitle`, `extra` controls and the close button, and `floating` overhanging the top edge. It enters over 0.2 s, with no entrance while the app boots. An own screen draws its own frame. Every screen with a shortcut toggles on it.

## Hubs

`defineHub` returns a fullscreen screen, so a hub sits in the same card as every other screen: the hub title with the profile name as subtitle, the active page's tabs in the header, the section nav and the page inside. With two hubs or more, a hub switch overhangs the top edge of the card and moves between them.

## Escape and home

Escape closes the topmost thing: an open escape layer, then the confirm dialog, then the open screen. With nothing open it opens the home screen, the Home menu entry's target. `product.homeScreen` names it (`settings` by default) and the `homeScreen` prop overrides it. A surface that must close first, a palette for example, registers itself with `useEscapeLayer({ isOpen, close })` or `escapeLayers.add`; the last one registered that reports open is closed first.

## Menu

The built-in order is Home, Profiles, Settings (left out when it is home), the app entries, the sections, then the module entries, Credits, About and Quit. Every built-in entry has an icon; `icon` takes a Tessera icon name or any node. An entry with `section` goes into that submenu: `widgets` and `advanced` come first, any other id becomes a section named after it. `devOnly` entries show only with developer tools, which are on in development or when the `developerToolsEnabled` setting is true; the built-in Dev Console in Advanced is one of them. Widgets holds the `useWidgetMenuEntries()` toggles and Advanced always holds Report a bug. The search palette and the bug report dialog are registered escape layers. Credits shows when a `credits` screen exists, which the `credits` prop registers.

## Settings

A tab is `{ id, label, navIcon, group, sections(settings) | render(ctx), icon?, mobileOnly? }`. Sections hold items keyed by settings key (dotted paths allowed). `SettingsHub` draws the nav, the active page and the search; `SettingsLayout` draws one tab's sections with per-section reset and lock overlays; `SettingsPage` is the page chrome. The settings store hydrates per profile, patches, runs effects `(patch, next, prev)` and saves 300 ms after the last change. The `settings` prop of `BrockApp` also carries the control hooks the hub forwards to every tab: `renderControl` for non-boolean keys, `isDisabled`, `lockCauseOf` and `lockOverlay`; a tab that needs its own layout still uses `TabDef.render`.

## App shell

- `BrockApp` is the composition root: it resolves the modules once, creates the log bus, the settings store and the screen registry, installs the api shim on hosts without a bridge, then wraps the shell in the platform, settings and module providers. Module Providers nest with the first module outermost. The title bar is drawn only where the host reports the `windowChrome` capability.
- Props: `home` is the screen id drawn as the base layer once a profile is active; `homeScreen` overrides `product.homeScreen`; `menu` holds the app's title-bar entries, placed as described under Menu (a built-in entry is skipped when the app or a module already names that screen); `credits` is the content of the Credits screen; `settings.effects` run on every patch and receive the patch and both states; `profileHooks` carry the app-specific profile fields and patchable keys; `legalText` is the licence and attribution copy. The title bar and the about screen show `product.logos.app`, and a named instance shows `product.logos.instance`.
- Startup order: the pinned instance profile (matched by id, then by name; an unknown name logs an error and opens the profiles screen instead of running on the wrong data), else the only profile, else the last one used, else the profiles screen. `settled` turns true in a `finally` block so every exit path, a failed boot included, still ends with a visible window.
- The shell-ready signal waits for startup to settle and then for two animation frames: the first commits the settled layout, the second proves it painted. The `booting` class is removed from the document root in the first frame so entrance animations resume only once the shell is done. The frame request is deliberately not cancelled on effect cleanup: a strict-mode double invoke would cancel the only scheduled signal.
- Keyboard: Escape follows the order under Escape and home; Alt+Enter toggles fullscreen; a screen's shortcut toggles it, a `requiresProfile` screen waits for a profile, a `devOnly` screen only responds with developer tools on; while an input, textarea or contenteditable is focused, screen shortcuts fire only with Ctrl or Meta held. A shortcut string is tokens joined by `+` (`Mod` matches Ctrl or the platform's command key; aliases `Comma`, `Period`, `Space`, `Esc`, `Return`).
- When the active profile changes, every session store resets and the settings store loads that profile's config; with no profile the settings return to the defaults. Log entries main sends over IPC are forwarded into the renderer's log bus; an unknown channel lands on `ipc` and an unknown level reads as `info`.

## Host, log and profiles

- The preload installs `window.api` before the renderer runs; a web or mobile host has none unless the app installs the shim, so `hostApi()` returns null instead of throwing at module load, and `requireHostApi()` is for call sites that only run on a host with a bridge.
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
- A menu item either opens a screen by id or runs its own `onClick`; the TitleBar resolves `screen` through navigation so app and module menus stay plain data. Every pick closes the menu first; separators inside a submenu are dropped because the dropdown draws them at the top level only. Modules are flattened in module order, ports merged per host with later modules winning on the same key, log channels deduplicated.
- `nav` is the imperative navigation surface for callers outside React; `toggle` opens when closed or another screen shows and closes when that screen is already open.

## Settings engine

- A section holds either flat `items` or named `subsections`, never both. Keys may be dotted paths into a nested settings object (`haptics.intensity`). `keywords` are extra words a search matches on; `link` is an external URL shown beside the description. `SettingLockCause` is the app's own vocabulary and null means unlocked. Omitting `defaults` hides the per-section reset; `renderControl` returning null falls back to the boolean toggle; `lockOverlay` defaults to a disabled overlay naming the cause. A tab's `navIcon` is the line icon for nav and header, `icon` a short mark for search rows; tabs sharing a `group` sit together in first-seen order.
- `SettingsHub`: while the search field has focus or holds text, no tab is selected and the pane shows matching settings from every tab; picking a tab from the nav or a result clears the search. `activeTab` is a controlled active tab (the hub keeps its own when left out); `homeTabId` is pinned above the groups and defaults to the first tab; `backdrop` is drawn behind every page header; `mobileOnly` tabs are listed only on a mobile form factor. Per-tab match counts use the same filter as the pages (`resolveSections`), so a count always equals the rows drawn.
- `SettingsLayout` reads the page context: `page` draws a full `SettingsPage` whose header links to each section; `results` draws only the rows matching the (lowercased, trimmed) query, bare, so a search pane can stack every tab's matches, or null when none match; no context draws the bare sections. A section with subsections yields one titled group per subsection; a flat section yields one untitled group anchored on the section itself. Empty groups and sections are dropped so a search that matches nothing leaves no stray heading.
- Locks: items are split into contiguous runs by lock cause so neighbouring rows locked for the same reason share one overlay; runs with different causes never merge. Reset: a key counts as changed only when the defaults know it, the row is not locked, and the stored value differs (compared by JSON serialization); a nested field is written through a copy of the live parent object so sibling fields the section never listed survive. A search narrows a section to the rows it still shows, and the per-section reset follows that: it resets exactly the settings in front of the reader.
- `SettingsPage`: an anchor's `id` must match a `data-section` attribute in the body, so the page needs no refs into its content; `tabs` replaces the anchors for a page whose subsections are views; `scroll: false` is for content that scrolls its own columns; `actions` sit at the right end of the header line. The header compacts after 24 px of scroll but stays in place; a section counts as current within 48 px below the body's top edge.
- The settings store: `patch` merges a partial, runs the effects with `(patch, next, prev)` and schedules a debounced save (default 300 ms). Hydrating a new profile flushes the pending save for the old one first, so a quick switch never writes one profile's settings into another's file; a hydration token discards a stale load. `reset` returns to the defaults with no profile and saves nothing; `flush` writes any pending change now. `BrockApp` creates one store from the app's defaults and `useSettings` reads it typed as the app's own settings shape.

## Shell views and stores

- `TitleBar`: an empty `menu` hides the menu button; the shell hides the bar when the `windowMode` setting is `borderless` or `fullscreen`, read by key, so no module import is needed; `instanceName` null means a normal launch; `hidden` hides the bar and reveals it while the pointer is in the 40 px strip along the top edge or over the bar itself; `extra` holds controls after the menu button (mute, save, a status tag). The outside-click handler also ignores clicks inside `.dropdown-menu` because the dropdown is portaled outside the trigger's subtree. Menu and pin icons use a 16-unit viewBox; minimize, restore, maximize and close use a 12-unit one. The instance badge shows the name verbatim because the name is the identifier.
- `About`: the version comes from the bridge's `getAppVersion` and falls back to `0.0.0` without a bridge; `copyText` is what the copy button puts on the clipboard and omitting it hides the button.
- `BootProgressBar`: the label flips from light to dark over the fill through a clipped duplicate element; the 1000 ms minimum on-screen time is cosmetic and never gates readiness. `ratio` is 0..1 for a determinate bar and null for an indeterminate sweep; phase `ready` completes the bar and lets it fade; `bootProgress` is the imperative surface for the code doing the work.
- `ProfilesScreen` doubles as the setup screen when no profile exists (the form is forced open); picking a profile makes it active and closes the screen; `createOptions()` is merged into the create request. In `CreateProfileForm`, Enter in the name field submits, `canSubmit: false` blocks submit while an extra field is incomplete, and `extraFields` render between the name and the actions. `WorkspaceSwitch.label` is the accessible name for the whole switch.
- Profiles store: selecting a profile records it as the default for the next launch (skipped on an automated launch) and bumps its last-played time; `loaded` is true once the first refresh finished. `useProfiles().remove` asks first through the confirm dialog, and when the active profile is deleted the profiles screen opens so the app is never left without one.
- `confirmAction(options)` is the promise form: it resolves `true` on confirm and `false` on cancel, Escape or a newer dialog.
- The shell shows one confirm dialog at a time; `dialogs` is the imperative surface for code outside React; `confirmDelete` is a red destructive confirm that closes itself before running `onConfirm`; `dismiss` runs the config's `onCancel`.
- Every store made with `createSessionStore` is tracked, and `resetAllSessionStores()` returns each to its initial state when a new profile is selected. Widget preference values must survive a JSON round-trip; the widget-pref store is a session store, so a new profile starts empty and the host hydrates it from disk and saves on change.

## Hooks

- A mobile shell running edge to edge forwards the display cutout sizes as custom properties on the document root (`--sai-top`, `--sai-right`, `--sai-bottom`, `--sai-left`, in CSS px) and fires the `safeareainsets` window event when they change; hosts that set none read as zero. `applyNotchMode` toggles `notch-fill` or `notch-safe` on the document root.
- `useWidgetPref` is a `useState` drop-in whose value belongs to the profile: with a widget id the value survives unmount, a profile switch and a restart; with null it degrades to plain local state. The stored value is cast to the caller's type without validation; a value written by an older build with another shape lands there and the next write corrects it.

- `useNow(intervalMs, active = true)` returns the current time and ticks every `intervalMs` while `active`.
- `useCopyText(resetMs = COPIED_RESET_MS)` returns `{ copied, error, copy(text) }`. `copy` writes to the clipboard and resolves true or false; `copied` resets after `resetMs`.
- `useKeyedGuard()` guards async work per key: `guard(key, work)` returns the work's result, or undefined when it threw. `isBusy(key?)` with no key asks whether any key is busy. `errorOf(key)` and `clearError(key?)` read and clear the recorded message. `keyedGuardReducer` is the pure state machine behind it.

## Stories

`stories/*.stories.tsx` follow the Tessera story shape and import the package from `../src`. The gallery config is not wired in this repo yet; the files are ready for it.

## Automated review

On a `--review` launch `BrockApp` loads `review/run-review` as a separate chunk once startup settles; a normal launch never loads it. The tour drives the shell like a person, from the registries and the product config: title bar, first-run profile form, menu, every screen (through its menu entry when one exists, else `nav.open`), Escape to home, the palette, the bug report dialog, About and the logs widget. Each step sends its checks and a screenshot request to main, which writes the report. Run it with `brock start -- --review --no-focus --muted --user-data=<dir>` after a build; the report is `Data/review/<name>/report.md`.

## Checks

```
pnpm typecheck
pnpm exec eslint packages/react
pnpm exec stylelint "packages/react/**/*.css"
```

<!-- @layer docs @kind doc -->
# brock-display

Refresh rate detection, a synced rate for fullscreen, and window mode and screen switching, with a Display tab for the settings hub.

## Install

```sh
brock add display
```

`brock sync` then imports the module on all three sides. The preload adds `window.api.display`:

```ts
window.api.display.getRefreshRate()                       // RefreshRateInfo
window.api.display.getSyncedRateStatus()                  // SyncedRateStatus
window.api.display.setSyncedRatePreference(enabled, hz)   // hz 0 picks the highest multiple of 60
window.api.display.applyRefreshRate(hz)                   // switch now and keep it
window.api.display.listMonitors()                         // MonitorInfo[]
window.api.display.getWindowMode()
window.api.display.setWindowMode(mode, monitorId)         // windowed, borderless or fullscreen
window.api.display.onChanged(() => ...)
```

## Settings

The Display tab reads and writes four keys of the profile settings. `windowMode` is already part of `BaseSettings`; add the other three to the app's defaults:

```ts
import { DEFAULT_DISPLAY_SETTINGS } from '@drizztdourden08/brock-display';

const DEFAULT_SETTINGS: AppSettings = { ...DEFAULT_BASE_SETTINGS, ...DEFAULT_DISPLAY_SETTINGS };
```

| Key | Holds |
|---|---|
| `windowMode` | `windowed`, `borderless` or `fullscreen` |
| `displayMonitor` | The screen id to use, or an empty string for the screen the window is on |
| `syncedRateInFullscreen` | Switch to the target rate while in fullscreen |
| `syncedRateTargetHz` | The target rate, or 0 for the highest multiple of 60 |

The module's provider pushes these to main once the profile settings load, and again on every change. A missing key reads as its default.

## Refresh rate

The renderer reads the rate twice: the rate the OS reports for the screen under the window, and a rate measured from frame spacing, which works on every host. `effectiveHz(info)` picks the measured one once it has settled.

```tsx
const info = useRefreshRate();
const hz = effectiveHz(info);
```

A rate that is a multiple of 60 shows every frame of 60 Hz content for the same time. 144 Hz does not, and scrolling stutters. `isSyncedRate`, `syncedRateOptions` and `bestSyncedRate` do that arithmetic.

## Synced rate

With the setting on, main switches the display to the target rate when the window enters fullscreen and puts the old rate back when it leaves, when the window closes, and on quit. "Change refresh rate" in the tab switches the rate for good, after a confirm dialog.

Switching needs a native driver:

| OS | Driver |
|---|---|
| Windows | `user32` through `koffi` |
| macOS | CoreGraphics through `koffi` |
| Linux | the `xrandr` command, X11 only |

`koffi` is a peer that `brock add display` adds to the app. It switches rates on Windows and macOS. Without it the status reports why, and the controls stay off. The macOS and Linux drivers have not run on hardware yet.

Both koffi 2 (from 2.9) and koffi 3 work: the peer range is `^2.9.0 || ^3.0.0`, and an app that already has either keeps it. The driver only declares a struct and C prototypes and calls them, which koffi 3 left as they were; its pointers became BigInt values, and the macOS driver only passes them back and checks them for null. The Windows driver is tested against both on every run. koffi 3 ships its native code in per-platform packages (`@koromix/koffi-<platform>-<arch>`), which the package manager installs and the packaged app carries with `node_modules`; its install script is not needed.

## Window mode

`setWindowMode` moves the window to the chosen screen, then applies the mode. Borderless covers the whole screen without entering fullscreen, and going back to windowed restores the old bounds.

## Automation launches

A headless launch (`--no-focus`, `--muted` and the other automation flags) never changes the display. The driver reports itself unavailable and `setWindowMode` returns the current state with the reason in `lastError`.

## Main side

Other main code reaches the same state through the context:

```ts
import { getDisplay } from '@drizztdourden08/brock-display/main';

getDisplay(ctx).syncedRate.status();
```

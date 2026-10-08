<!-- @layer docs @kind doc -->
# brock-input

Game controllers through SDL3: device list with hotplug, live button and axis state, the gamecontrollerdb mapping database, stick and trigger calibration, rumble, and an InputTester screen. It is generic input. Button meaning belongs to the app.

## The SDL3 addon

The module drives a Node-API addon, `sdl3_input.node`, with SDL3 and libusb beside it. The C++ source lives in `native/`. The pinned SDL3 and libusb versions, and the addon build version, are in `native/package.json`. An app does no binary work of its own.

| Step | What happens |
|---|---|
| install | The package postinstall downloads the prebuild for this platform into `native/prebuilds/<platform>-<arch>/`. It is skipped when `CI` is set or a local build is there. It never fails the install. |
| `brock dev`, `brock build` | Brock runs the same step first (the manifest `prepare`). This covers a pnpm install that blocked the postinstall. When no prebuild exists and CMake, a C/C++ toolchain and `cmake-js` are present, it builds from source. |
| packaging | The builder config copies `native/prebuilds/<platform>-<arch>/` to `<resourcesPath>/sdl3/<platform>-<arch>/` and `resources/gamecontrollerdb.txt` to `<resourcesPath>/`. `native/` stays out of `app.asar`. |

A prebuild is `sdl3-input-<version>-<key>-<platform>-<arch>.tar.gz` on the `sdl3-addon-v<version>` release of the brock repo, with a `.sha256` beside it. `<key>` hashes the addon, SDL3 and libusb versions, so a moved pin finds no asset and falls back to a source build. `.github/workflows/sdl3-addon.yml` builds the prebuilds for win32-x64, linux-x64 and darwin-arm64 and uploads them. It runs by hand and on a change under `native/` on `main`. Raise `version` in `native/package.json` when the C++ changes.

To build from source in the brock checkout:

```sh
pnpm --filter @drizztdourden08/brock-input addon:build
```

SDL3 is built from source with libusb on, because the official SDL3 package has no libusb. On Linux and macOS, libusb and pkg-config must be installed first. The addon loads libusb by its full path before SDL starts, so SDL finds the copy beside the addon.

Main looks for the addon in this order:

| Where | When |
|---|---|
| `<resourcesPath>/sdl3/<platform>-<arch>/sdl3_input.node` | a packaged app |
| `getInput(ctx).configure({ addonPath })` | the app sets it in `onReady` |
| `<brock-input>/native/prebuilds/<platform>-<arch>/sdl3_input.node` | development, the package resolved from the app root |
| `<appPath>/sdl3/<platform>-<arch>/sdl3_input.node` | development, a copy the app keeps itself |

When no addon loads, main logs one warning, every call returns an empty or false result, and the renderer shows that controllers are off. The app keeps running.

An automation launch never starts SDL3, so a test run cannot take a controller from a session already running on the same machine.

## Android

On Android the same SDL3 drives the controllers, inside the app's own process, through the `BrockInput` Capacitor plugin that ships in this package (`android/`). The renderer API does not change: `inputApi()` and `window.api.input` return the same `InputApi`, so app code never asks which host it runs on.

| Part | Where |
|---|---|
| `BrockInputPlugin` | the Capacitor plugin: `start`, `stop`, `rumble`, `addMapping`, `mappingForGuid`, and the `controllerEvent` it sends |
| `Sdl3Bridge` | loads `libbrockinput.so`, starts SDL on the UI thread and polls it every 16 ms there |
| `Sdl3InputRouter`, `ControllerWindowCallback` | hand controller keys and stick motion to SDL before the WebView sees them |
| `src/main/cpp` | the JNI bridge, built against the same pinned SDL3 as the desktop addon |

`package.json#capacitor` makes the package a Capacitor plugin, so `cap sync` (run by `platform add android` and `<app> mobile build`) puts the library in the app's Gradle project. The library build reads the SDL3 pin from `native/package.json`, fetches that source with `node bin/ensure-sdl3-source.mjs` when it is missing (the same verified tarball as a desktop source build), compiles SDL3 statically into `libbrockinput.so`, and compiles SDL's own Java classes from that source, so the Java and C halves of SDL never drift apart. It needs the NDK and CMake the module names in `brock.android.sdkPackages`; `<app> doctor android` lists them. The library builds `arm64-v8a` only; set `brockInputAbis=arm64-v8a,x86_64` in `mobile/android/gradle.properties` to add an emulator ABI.

The plugin hooks the window callback when it loads, so the app's `MainActivity` needs no change. Every pad arrives as a system input device that SDL reads directly. SDL's USB HID layer stays off: it would ask for USB permission per pad and detach the driver that presents it. While the app is paused the poll stops and SDL keeps its state, so the pads it had come back without a new `added` event.

The renderer side lives in `src/renderer/android/`: it keys devices the same way main does (`vid:pid`, then `#2`), builds the same `DeviceEntry` snapshot, plays vibrate patterns with the same haptic player, and keeps calibration and added mapping lines in the WebView's `localStorage` under `brock-input:`, at the same paths as the desktop files. Added lines go back into SDL each time it starts.

What Android does not do:

- Raw HID capture and joystick capture: `capture.startRaw` returns `{ ok: false }`, `capture.startJoystick` returns `false`, and `listJoysticks` and `listHid` are empty. `releaseHold` and `restoreHold` return `false`.
- The bundled `gamecontrollerdb.txt` is not loaded; SDL's built-in mappings and the lines the user adds apply.
- `rescan` sends the current list again; SDL finds pads on its own.
- `busType` comes from SDL's connection state (`wired` is `usb`, `wireless` is `bluetooth`), and is `unknown` when SDL does not know it.
- A pad's keys go to SDL, so the WebView's own Gamepad API sees nothing while SDL runs.
- Up to 8 pads at once.
- An ABI the library was not built for (an x86_64 emulator by default) loads no library: `status()` reports controllers off and the app keeps running.

## What it stores

| Path under `Data/` | Holds |
|---|---|
| `input/gamecontrollerdb.txt` | Mapping lines the user added. It loads after the bundled database, so a line here wins for its GUID. |
| `input/stick-calibration.json` | `{ [deviceKey]: { left, right, updatedAt } }` |
| `input/trigger-calibration.json` | `{ ["<deviceKey>:<axisIndex>"]: { base, max, deadzone } }` |

The bundled database is `resources/gamecontrollerdb.txt`, taken from SDL_GameControllerDB. Main reads it from `configure({ mappingDbPath })`, then `<resourcesPath>/gamecontrollerdb.txt`, then this package.

## Device keys

A device is keyed by `vid:pid` in lowercase hex, `057e:2009` style. A second device with the same `vid:pid` gets `#2`, the next `#3`. A freed number is reused by the next device to connect, and no other key moves.

## Install

```sh
brock add input
```

The preload adds `window.api.input`:

```ts
window.api.input.status()                      // { available, sdlVersion }
window.api.input.list()                        // DeviceEntry[], ready and unavailable
window.api.input.rescan()
window.api.input.rumble(deviceKey, low, high, durationMs)
window.api.input.vibratePattern(deviceKey, [{ durationMs, intensity }], gapMs)
window.api.input.onState((deviceKey, buttons, axes) => ...)
window.api.input.onDevices((entries) => ...)
window.api.input.mapping.add(line)
window.api.input.calibration.writeStick(deviceKey, calibration)
window.api.input.capture.startJoystick(joystickId)
```

`buttons` and `axes` follow SDL's gamepad order. `SDL_BUTTON_NAMES`, `SDL_AXIS_NAMES` and `SDL_AXIS` name each index. Sticks read from -1 to 1 and triggers from 0 to 1.

## Main side

The module needs no main code from the app. `configure` points at an addon or a mapping database of the app's own:

```ts
import { getInput } from '@drizztdourden08/brock-input/main';

bootstrapApp(product, {
  modules: mainModules,
  onReady: (ctx) => {
    getInput(ctx).configure({ addonPath: join(app.getAppPath(), 'native', 'sdl3_input.node') });
  },
});
```

SDL starts when the window opens and stops on quit. `getInput(ctx).runtime()` gives the controller source, the haptic player and the mapping database to other main code.

## Renderer side

The module adds a `Controllers` screen (`input-tester`) and a menu entry that opens it. The screen lists every device, lights each button as it is pressed (Tessera `PressedGrid`), draws both sticks (`StickPlot`) and both triggers (`StatRow` over a `ProgressBar`), runs a stick or trigger calibration in the module's `CalibrationPanel` (the stick step draws a large `StickPlot` with the measured range, the recorded center and the dead zones; the trigger step shows the peak as the bar's second value; the buttons held show in the panel while it is open), plays rumble patterns, and takes a new mapping line.

`CalibrationPanel` is a Brock compound, exported from `@drizztdourden08/brock-input/renderer` with its types. It sits in `src/compounds/CalibrationPanel/` with its usage file, built on Tessera's `StickPlot`, `PressedGrid`, `ProgressBar` and `StatRow`. It takes `title`, `instruction`, `readout`, `action` (`label`, `disabled`, `onClick`), `onCancel`, `cancelLabel` and `children` like the Tessera panel it replaces, plus `reading`, the live stick (`x`, `y`, `center`, `range`, the dead zones) or trigger (`value`, `peak`) named by its SDL control name and label, and `buttons`, the `PressedGrid` items and the ones held. Every control glyph is drawn by one sub-component, `InputGlyph`, which today writes the control's label in a key cap.

The stores are exported for an app screen of its own: `useControllerDevicesStore`, `useControllerState(deviceKey)` and `useCalibrationStore`. `applyStickCalibration` and `applyTriggerCalibration` turn a raw reading into a calibrated one.

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

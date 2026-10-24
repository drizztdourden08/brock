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

A source build keeps its CMake build folders in `native/third_party/`. Deep in a worktree or a pnpm store, that path can pass the Windows path length limit. Set `BROCK_INPUT_CMAKE_DIR` to a short folder to put the SDL3 and addon build folders there instead, or to `temp` for the system temp folder. Each copy of the package gets its own subfolder, named by a short hash of its path, so two checkouts never share a CMake cache. The downloads, the SDL3 source and the install stay in the package.

```sh
BROCK_INPUT_CMAKE_DIR=C:/b pnpm --filter @drizztdourden08/brock-input addon:build
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

In the renderer, `inputApi()` never returns null. On a host with no input side (a browser, or an Android build without the plugin) it returns `noopInputApi`: `status()` reports `available: false`, the lists are empty, every action resolves to `false` or `{ ok: false }`, and every subscription hands back an unsubscribe that does nothing. App code calls it without a null check. `isInputAvailable()` tells the two apart, and `inputApi() === noopInputApi` does too.

An automation launch leaves SDL3 off by default, so a test run cannot take a controller from a session already running on the same machine. The Controllers list is then empty and main logs why.

## Checking a real pad headless: `--input-live`

`--input-live` turns SDL3 on in an automation launch, so a thread can read a real pad without a window on the desktop. It has no effect on a normal or `--visible` launch, where SDL3 is already on.

```sh
<app> launch <name> none --input-live
brock start -- --no-focus --muted --user-data=<dir> --input-live
```

`launch` forwards flags it does not own to the app, so the launch verb of a repo built on `@drizztdourden08/brock-thread` (the `rotp` verb included) needs nothing more than the flag on the command line. A tool that builds the app's arguments itself must add `--input-live` to them.

Only one instance may hold the pad. Every instance that starts SDL3 records itself in `brock-input-pad.lock` in the OS temp folder (one file for the whole machine, any app, any `--user-data`). A normal launch always takes the pad. A `--input-live` launch looks first: when another running process holds it, main logs one warning naming that app and process, SDL3 stays off and the list stays empty. The check retries on the next `input:list`, so it starts once the other instance quits. A lock whose process is gone is ignored. The holder releases the file when it stops. An app built on an older Brock writes no lock, so it cannot be seen: close it before a live check.

## Android

On Android the same SDL3 drives the controllers, inside the app's own process, through the `BrockInput` Capacitor plugin that ships in this package (`android/`). The renderer API does not change: `inputApi()` and `window.api.input` return the same `InputApi`, so app code never asks which host it runs on.

| Part | Where |
|---|---|
| `BrockInputPlugin` | the Capacitor plugin: `start`, `stop`, `rumble`, `addMapping`, `mappingForGuid`, and the `controllerEvent` it sends |
| `Sdl3Bridge` | loads `libbrockinput.so`, starts SDL on the UI thread and polls it every 16 ms there |
| `Sdl3InputRouter`, `ControllerWindowCallback` | hand controller keys and stick motion to SDL before the WebView sees them |
| `src/main/cpp` | the JNI bridge, built against the same pinned SDL3 as the desktop addon |

`package.json#capacitor` makes the package a Capacitor plugin, so `cap sync` (run by `platform add android` and `<app> mobile build`) puts the library in the app's Gradle project. The library build reads the SDL3 pin from `native/package.json`, fetches that source with `node bin/ensure-sdl3-source.mjs` when it is missing (the same verified tarball as a desktop source build), compiles SDL3 statically into `libbrockinput.so`, and compiles SDL's own Java classes from that source, so the Java and C halves of SDL never drift apart. It needs the NDK and CMake the module names in `brock.android.sdkPackages`; `<app> doctor android` lists them. The library builds `arm64-v8a` only; set `brockInputAbis=arm64-v8a,x86_64` in `mobile/android/gradle.properties` to add an emulator ABI. The same short-path option applies to the library's CMake staging folder: set `brockInputCmakeDir` in `mobile/android/gradle.properties` (a path, relative to `mobile/android`, or `temp`), or the `BROCK_INPUT_CMAKE_DIR` environment variable.

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

## The mapping directory

`mapping.list()` returns every gamepad mapping SDL knows: the built-in table, the bundled database and the lines the user added. Each entry is `{ guid, name, vid, pid, platform?, family?, source, mapping, inputCount }`. An app can show them as a searchable table and join them with `list()` on `vid:pid`.

- `vid` and `pid` come from the SDL GUID. The GUID is 16 bytes in hex. Bytes 0 to 1 are the bus, bytes 2 to 3 are a CRC of the name, bytes 4 to 5 the vendor, bytes 8 to 9 the product, bytes 12 to 13 the version. Each word is little endian. The CRC is skipped. A GUID that carries the product name in place of ids, and the `xinput` pseudo GUID, give `0` and `0`.
- `platform` is the value of the mapping's `platform:` field, such as `Windows`, `Linux` or `Mac OS X`. It is left off when the line has none.
- `family` is `xbox`, `playstation` or `nintendo`. It comes from the vendor (Microsoft, Sony, Nintendo) and, when the vendor is unknown, from the name. It is left off for a generic pad.
- `source` says where the mapping came from: `builtin` for SDL's own table, `bundled` for a line in the bundled database, `user` for a line in the user's file or added with `mapping.add`. The user file wins over the bundled one, and the bundled one over the built-in table. Main reads both files on load and matches by GUID, ignoring lines for another platform.
- `mapping` is the SDL GameControllerDB line as SDL reports it.
- `inputCount` is the number of bound inputs the line declares. The `platform:`, `crc:`, `hint:`, `sdk>=:`, `sdk<=:`, `type:` and `face:` fields are not inputs.
- SDL keeps one mapping per GUID, so there is no cross platform duplicate to merge. If the same GUID and platform ever repeats, the last line wins. The same GUID on two platforms stays as two entries.
- Main parses the list once and caches it. Adding a mapping with `mapping.add` clears the cache. An empty answer is never cached, since SDL may not be up yet.
- The call needs addon 1.3.0. With an older addon, with controllers off, and on Android, it returns `[]` and never throws.

## Device keys

A device is keyed by `vid:pid` in lowercase hex, `057e:2009` style. A second device with the same `vid:pid` gets `#2`, the next `#3`. A freed number is reused by the next device to connect, and no other key moves.

On Windows a Bluetooth Xbox pad has two faces. SDL opens it through XInput as `045e:02ff`, and the HID listing shows its real id, `045e:0b13` for a Series pad. The addon pairs the two through the Windows device container, so the pad lists once, under its XInput key.

## Install

```sh
brock add input
```

The preload adds `window.api.input`:

```ts
window.api.input.status()                      // { available, sdlVersion }
window.api.input.list()                        // DeviceEntry[], ready and unavailable (the cached snapshot)
window.api.input.refresh()                     // same shape, after a full device scan
window.api.input.rescan()
window.api.input.rumble(deviceKey, low, high, durationMs)
window.api.input.vibratePattern(deviceKey, [{ durationMs, intensity }], gapMs)
window.api.input.onState((deviceKey, buttons, axes) => ...)
window.api.input.onDevices((entries) => ...)
window.api.input.mapping.add(line)
window.api.input.mapping.list()                // MappingEntry[], every mapping SDL knows
window.api.input.calibration.writeStick(deviceKey, calibration)
window.api.input.capture.startJoystick(joystickId)
```

`list()` is cheap. It returns the snapshot main already holds, and the `onDevices` stream keeps that snapshot current on hotplug, so never poll it for changes. `refresh()` runs a full HID scan on the main thread and emits `onDevices`. Call it from a user action, such as a Rescan button, and never on a timer: a scan beside SDL's own HID thread can drop a pad that is in use.

`buttons` and `axes` follow SDL's gamepad order. `SDL_BUTTON_NAMES`, `SDL_AXIS_NAMES` and `SDL_AXIS` name each index. Sticks read from -1 to 1 and triggers from 0 to 1.

## Pad slots

`onState` speaks SDL's order. For a controller drawing, `window.api.input.onPadState((deviceKey, pad) => ...)` sends the same state keyed by the control's physical place. It rides the `input:state` stream, so no second event crosses the bridge. In the renderer, `usePadState(deviceKey)` gives the same `PadState`, and `padStateOf(buttons, axes)` converts a raw reading yourself.

A `PadState` is `{ slots, extras }`. It feeds the Tessera `ControllerLayout` directly: pass `pad.slots` as `slots` and `pad.extras` as `extras`.

`slots` holds the 20 silhouette places of Tessera's `ControllerSlotId`, with plain data. Buttons set `pressed`, triggers set `value` (0 to 1), sticks set `x` and `y` (-1 to 1, up is positive; SDL's Y is flipped for you). The state is raw: calibration is not applied.

| Slot | SDL control |
|---|---|
| `face.south`, `face.east`, `face.west`, `face.north` | `SOUTH`, `EAST`, `WEST`, `NORTH` |
| `dpad.up`, `dpad.down`, `dpad.left`, `dpad.right` | `DPAD_*` |
| `shoulder.left`, `shoulder.right` | `LEFT_SHOULDER`, `RIGHT_SHOULDER` |
| `trigger.left`, `trigger.right` | the trigger axes |
| `stick.left`, `stick.right` | the stick axes |
| `stick.left.click`, `stick.right.click` | `LEFT_STICK`, `RIGHT_STICK` |
| `meta.view` | `BACK` (Select, Minus, PS share) |
| `meta.menu` | `START` (Options, Plus) |
| `meta.guide` | `GUIDE` (Home, PS, Xbox) |
| `meta.capture` | `MISC1` (Switch capture, Xbox share) |

`extras` is a separate list of `{ id, label, pressed }` items, shaped like Tessera's `ControllerExtra` without a glyph. It lists only the controls the device has, so an Xbox pad with no paddles has no paddle rows. The device reports what it has through SDL (`SDL_GamepadHasButton`), carried on `DeviceEntry.hasButton`. The full set is ten items, in this order:

| Extra `id` | `label` | SDL control |
|---|---|---|
| `extra.misc2` to `extra.misc6` | `Misc 2` to `Misc 6` | `MISC2` to `MISC6` |
| `extra.paddle.right1`, `extra.paddle.left1`, `extra.paddle.right2`, `extra.paddle.left2` | `Paddle R1`, `Paddle L1`, `Paddle R2`, `Paddle L2` | `RIGHT_PADDLE1`, `LEFT_PADDLE1`, `RIGHT_PADDLE2`, `LEFT_PADDLE2` |
| `extra.touchpad` | `Touchpad` | `TOUCHPAD` |

The `label` is the default one in the table. A device with a `family` gets the names its own hardware uses for the paddles:

| Extra `id` | `xbox` | `playstation` | `nintendo` | `generic` |
|---|---|---|---|---|
| `extra.paddle.right1` | `P1` | `RB` | `GR` | `Paddle R1` |
| `extra.paddle.left1` | `P3` | `LB` | `GL` | `Paddle L1` |
| `extra.paddle.right2` | `P2` | `Right Fn` | `Paddle R2` | `Paddle R2` |
| `extra.paddle.left2` | `P4` | `Left Fn` | `Paddle L2` | `Paddle L2` |

The ids never change, only the labels. `onPadState` and `usePadState` fill this in for you. Call `padStateOf(buttons, axes, device)` with a `DeviceEntry` (or any `{ family, hasButton }`) to do the same by hand. Without a device, or when the device sent no `hasButton`, all ten extras are listed with the default labels.

`ControllerSlotId` and `ControllerSlotState` are Tessera's own types, re-exported. The slot list `CONTROLLER_SLOT_IDS` comes from Tessera too.

Each ready `DeviceEntry` has a `family` hint: `'xbox'`, `'playstation'`, `'nintendo'` or `'generic'`, from SDL's gamepad type (`padFamilyOf(sdlType)`). Xbox 360 and One are `xbox`; PS3, PS4 and PS5 are `playstation`; Switch Pro, the Joy-Cons and GameCube are `nintendo`; standard and unknown are `generic`. An unavailable entry has no family. An app uses it to pick a layout variant.

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

An app adds its own buttons to every device card, on the module's Controllers screen too, with `registerDeviceCardActions(actions)` (it returns the unregister) or the `useDeviceCardActions(actions)` hook. `InputTester` and `DeviceCard` also take them as a prop (`deviceActions` and `actions`); a prop action replaces a registered one with the same `id`. Each `DeviceCardAction` has `id`, `label`, `icon`, `variant`, `disabled` (a flag, or a check on the `DeviceEntry`), `visible` (a check on the `DeviceEntry`) and `onSelect(entry)`. They show as a row of buttons under the rumble row.

```ts
import { registerDeviceCardActions } from '@drizztdourden08/brock-input/renderer';

registerDeviceCardActions([
  { id: 'report', label: 'Report a problem', icon: 'bug', onSelect: (entry) => openReport(entry.deviceKey) },
]);
```

The stores are exported for an app screen of its own: `useControllerDevicesStore`, `useControllerState(deviceKey)` and `useCalibrationStore`. `applyStickCalibration` and `applyTriggerCalibration` turn a raw reading into a calibrated one.

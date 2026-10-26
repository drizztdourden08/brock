# @drizztdourden08/brock-input

## 0.102.0

### Patch Changes

- Updated dependencies [ca5ed20]
- Updated dependencies [03fae52]
  - @drizztdourden08/brock-react@0.102.0
  - @drizztdourden08/brock-core@0.102.0
  - @drizztdourden08/brock-electron@0.102.0

## 0.101.0

### Patch Changes

- Updated dependencies [b0d5e5e]
  - @drizztdourden08/brock-react@0.101.0
  - @drizztdourden08/brock-core@0.101.0
  - @drizztdourden08/brock-electron@0.101.0

## 0.100.0

### Patch Changes

- Updated dependencies [148e7f2]
- Updated dependencies [e24df4e]
  - @drizztdourden08/brock-react@0.100.0
  - @drizztdourden08/brock-core@0.100.0
  - @drizztdourden08/brock-electron@0.100.0

## 0.99.0

### Patch Changes

- 71099b9: `resolveDeviceFromEntry` and `recallControllerSdlType` are now exported from the root entry `@drizztdourden08/brock-input` too, so code with no UI, such as a worker, can use them without pulling React and Tessera through the renderer entry. The renderer entry keeps them.
- Updated dependencies [ce95881]
- Updated dependencies [9c53bf7]
  - @drizztdourden08/brock-react@0.99.0
  - @drizztdourden08/brock-core@0.99.0
  - @drizztdourden08/brock-electron@0.99.0

## 0.98.0

### Patch Changes

- Updated dependencies [106472e]
- Updated dependencies [40c83ac]
- Updated dependencies [40c83ac]
  - @drizztdourden08/brock-react@0.98.0
  - @drizztdourden08/brock-core@0.98.0
  - @drizztdourden08/brock-electron@0.98.0

## 0.97.2

### Patch Changes

- e7fe0aa: Pad callout leaders keep off the body of the pad. The layout now charges extra for every unit of a leader that runs inside the silhouette, so the nearest clear spot wins over a long diagonal across the pad, and a short second pass moves a callout to a cheaper spot when that frees room. The Menu, View and Share callouts (the start, back and misc buttons) prefer the top of the pad and look further along the top row to find a clear spot.
- e7fe0aa: The `ControllerSilhouette` component comes from Tessera again, and the module no longer carries a copy of it. Brock keeps the anchors: `CONTROLLER_SILHOUETTE_ANCHORS`, the anchor ids, the variants and the anchor types stay exported from `@drizztdourden08/brock-input/renderer`, with the same positions, and `PadOverlay` and the pad page read them. `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_PATHS` and `CONTROLLER_SILHOUETTE_VIEW_BOX` are no longer exported from the module. Upgrading: import them from `@drizztdourden08/tessera/composites`. The migration `silhouette-from-tessera` rewrites those imports.
  - @drizztdourden08/brock-core@0.97.2
  - @drizztdourden08/brock-electron@0.97.2
  - @drizztdourden08/brock-react@0.97.2

## 0.97.1

### Patch Changes

- 1e9e7a6: The `ControllerSilhouette` component comes from Tessera again, and the module no longer carries a copy of it. Brock keeps the anchors: `CONTROLLER_SILHOUETTE_ANCHORS`, the anchor ids, the variants and the anchor types stay exported from `@drizztdourden08/brock-input/renderer`, with the same positions, and `PadOverlay` and the pad page read them. `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_PATHS` and `CONTROLLER_SILHOUETTE_VIEW_BOX` are no longer exported from the module. Upgrading: import them from `@drizztdourden08/tessera/composites`. The migration `silhouette-from-tessera` rewrites those imports.
- Updated dependencies [5d73454]
  - @drizztdourden08/brock-core@0.97.1
  - @drizztdourden08/brock-electron@0.97.1
  - @drizztdourden08/brock-react@0.97.1

## 0.97.0

### Minor Changes

- 8432d36: The module now owns the whole controller component. `ControllerSilhouette` draws the outline of a pad for an app to put its own marks on, with the same props and the same rendering as the one in Tessera. The module also owns the anchors: `CONTROLLER_SILHOUETTE_ANCHORS` gives `{ x, y, r? }` for each anchor id of each variant, and the values are the ones measured and reviewed in Relic of the Past, so the marks sit closer to the real controls. `PadOverlay`, the pad page and the family overlays read this table. It exports `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_ANCHORS`, `CONTROLLER_SILHOUETTE_ANCHOR_IDS`, `CONTROLLER_SILHOUETTE_VARIANTS`, `CONTROLLER_SILHOUETTE_PATHS`, `CONTROLLER_SILHOUETTE_VIEW_BOX` and the anchor types from `@drizztdourden08/brock-input/renderer`. The outline path data and view box of each variant still come from Tessera. The outline classes are now `controller-outline`. Upgrading: import `ControllerSilhouette` and the anchors from `@drizztdourden08/brock-input/renderer`; Tessera will drop them.

### Patch Changes

- 69d854c: The pad callouts now read better. A callout above or below the pad puts its text at the far end of the underline, away from the leader. The underline is never shorter than five characters, even for a short label such as A or LB. A face button shows the direction it sits in on the pad (Up, Right, Down or Left) on its second line, whatever the family calls the button.
- Updated dependencies [1f3d40b]
  - @drizztdourden08/brock-react@0.97.0
  - @drizztdourden08/brock-core@0.97.0
  - @drizztdourden08/brock-electron@0.97.0

## 0.96.1

### Patch Changes

- 9136ad1: The Controllers hub keeps each pad in its Connected list while the Diagnostics wizard has the pads released. Before, the list showed "No controllers" for the whole capture. Each pad stays listed with " (in diagnostics)" after its name until the hold returns, then the live list shows again. `padLivePages` takes an optional second argument that adds the same mark. The wizard text now says what the pause means for the player ("Your controllers are paused in the app while the capture runs.") in place of "Controllers released." and the other release and hold wording.
  - @drizztdourden08/brock-core@0.96.1
  - @drizztdourden08/brock-electron@0.96.1
  - @drizztdourden08/brock-react@0.96.1

## 0.96.0

### Minor Changes

- 5a13543: The input module now carries the controller input foundation an app needs to build controller pages. It adds the SDL family layer (`resolveDeviceControls`, `buildDisplayContext`, the five family tables, `buildDeviceProfile` and the vibration shaping), the `controllerInputStore` with its processing step, the controller name and family caches, the controller event log, `padDisplayName`, `layoutFamilyOf`, `groupAxisControls`, `controllerCardInfo`, `groupControllerDevices` and the `useControllerDevices` and `useAppVersion` hooks. It also adds seven compounds: `ControllerStatusBar`, `ControllerPortRow`, `ControllerStatusBadge`, `ControllerCapabilityBadges`, `UnavailableControllerNotice`, `MappingPasteBox` and `RescanButton`. The new device profile type names its input API `DeviceInputApi`, so it does not clash with the existing `InputApi`. The module starts the store feed, the two caches and the event log from one renderer boot task, so nothing runs on import. The package now depends on `@iconify/react`, `@iconify-icons/lucide` and `@iconify/types`. No change is needed in an existing app, and no screen looks different yet.
- 86159bd: The input module now adds a Controllers hub in place of the single input tester screen. The hub has the id `controllers` and sits under Advanced, outside the hub switcher. It holds a Directory page (a searchable table of every controller SDL3 knows, with Rescan), a Logs page (the connect and disconnect history) and a Diagnostics page (the guided capture wizard and its result). The pages come with the stick and trigger calibration wizards, the HID byte capture and the diagnostics report builder. The module exports `ControllerDirectory`, `ControllerLogs` and `ControllerDiagnostics`, plus `StepIndicator`, `ReportSection`, `buildReport`, `useDiagnosticsWizardState` and the other pieces an app needs to build its own report dialog around the wizard. `registerDeviceCardActions` keeps working, and is the hook an app uses to add a Report button. The Controllers hub also has a live page for each connected pad: the pad drawn with a callout for each input, the sticks and triggers with their calibration, the buttons, and the facts of the controller with its rumble tests. Its Controller box shows Run diagnostics and every action added with `registerDeviceCardActions` as icon buttons. `registerRumbleTests` adds rumble test buttons after the module's own, and `registerGlyphSource` supplies the button and pad images, which the module does not ship (with none registered the pad page draws without glyph images). The module also exports `PadOverlay`, `DpadCross`, `SvgImage`, `CONTROLLER_SLOT_IDS` and `ControllerExtra`. The capture API gains `writeDebug(name, data)` (the channel `input:capture:writeDebug`), which writes a JSON file under the data folder's `debug` folder; the diagnostics wizard and the HID calibration use it instead of an app call. The peer range for `@drizztdourden08/tessera` is now `>=0.60.0`. `brock-build` adds `<id>.page.tsx` and `<id>.live.tsx` to the module file names its structure check accepts. Upgrading: `InputTester`, `DeviceCard`, `CalibrationPanel` and its types, `ControllerLayout` with `ControllerLayoutProps`, `ControllerLayoutVariant`, `ControllerSlots` and `CONTROLLER_LAYOUT_VARIANTS` (use Tessera's `ControllerSilhouette` or the new `PadOverlay`), `inputFamilyOf`, `inputTesterScreen` and `INPUT_TESTER_SCREEN_ID` are removed, and the `input-tester` screen is gone, so the Advanced entry now opens the `controllers` hub. An app that declares its own bucket with the id `controllers` fails at start. `brock upgrade` turns each import of a removed name, a `controllers` bucket in `screens.config.ts`, an `input-tester` id and an input module override with `screens: []` into a to-do (migration `controllers-bucket`).

### Patch Changes

- Updated dependencies [03e9f16]
- Updated dependencies [df9190a]
  - @drizztdourden08/brock-react@0.96.0
  - @drizztdourden08/brock-core@0.96.0
  - @drizztdourden08/brock-electron@0.96.0

## 0.95.0

### Patch Changes

- Updated dependencies [19d15bf]
- Updated dependencies [8a93950]
- Updated dependencies [7e3cae1]
  - @drizztdourden08/brock-electron@0.95.0
  - @drizztdourden08/brock-react@0.95.0
  - @drizztdourden08/brock-core@0.95.0

## 0.94.0

### Patch Changes

- Updated dependencies [675874a]
- Updated dependencies [aeee8c7]
- Updated dependencies [ce4e429]
- Updated dependencies [6e8de00]
  - @drizztdourden08/brock-react@0.94.0
  - @drizztdourden08/brock-electron@0.94.0
  - @drizztdourden08/brock-core@0.94.0

## 0.93.1

### Patch Changes

- @drizztdourden08/brock-core@0.93.1
- @drizztdourden08/brock-electron@0.93.1
- @drizztdourden08/brock-react@0.93.1

## 0.93.0

### Patch Changes

- Updated dependencies [ee7a2a8]
  - @drizztdourden08/brock-core@0.93.0
  - @drizztdourden08/brock-electron@0.93.0
  - @drizztdourden08/brock-react@0.93.0

## 0.92.0

### Patch Changes

- Updated dependencies [ca050ce]
  - @drizztdourden08/brock-react@0.92.0
  - @drizztdourden08/brock-core@0.92.0
  - @drizztdourden08/brock-electron@0.92.0

## 0.91.0

### Patch Changes

- Updated dependencies [c364271]
  - @drizztdourden08/brock-core@0.91.0
  - @drizztdourden08/brock-electron@0.91.0
  - @drizztdourden08/brock-react@0.91.0

## 0.90.0

### Patch Changes

- Updated dependencies [a45f9fd]
  - @drizztdourden08/brock-react@0.90.0
  - @drizztdourden08/brock-core@0.90.0
  - @drizztdourden08/brock-electron@0.90.0

## 0.89.1

### Patch Changes

- @drizztdourden08/brock-core@0.89.1
- @drizztdourden08/brock-electron@0.89.1
- @drizztdourden08/brock-react@0.89.1

## 0.89.0

### Patch Changes

- Updated dependencies [8b785cc]
- Updated dependencies [af60e66]
  - @drizztdourden08/brock-electron@0.89.0
  - @drizztdourden08/brock-react@0.89.0
  - @drizztdourden08/brock-core@0.89.0

## 0.88.1

### Patch Changes

- Updated dependencies [a44158f]
  - @drizztdourden08/brock-electron@0.88.1
  - @drizztdourden08/brock-core@0.88.1
  - @drizztdourden08/brock-react@0.88.1

## 0.88.0

### Patch Changes

- Updated dependencies [8422f5e]
- Updated dependencies [ea6faa6]
  - @drizztdourden08/brock-core@0.88.0
  - @drizztdourden08/brock-electron@0.88.0
  - @drizztdourden08/brock-react@0.88.0

## 0.87.2

### Patch Changes

- @drizztdourden08/brock-core@0.87.2
- @drizztdourden08/brock-electron@0.87.2
- @drizztdourden08/brock-react@0.87.2

## 0.87.1

### Patch Changes

- @drizztdourden08/brock-core@0.87.1
- @drizztdourden08/brock-electron@0.87.1
- @drizztdourden08/brock-react@0.87.1

## 0.87.0

### Patch Changes

- Updated dependencies [f32d5d9]
- Updated dependencies [20ce5ee]
- Updated dependencies [5c45abf]
- Updated dependencies [ec02417]
- Updated dependencies [20ce5ee]
  - @drizztdourden08/brock-electron@0.87.0
  - @drizztdourden08/brock-react@0.87.0
  - @drizztdourden08/brock-core@0.87.0

## 0.86.0

### Patch Changes

- Updated dependencies [4b2f410]
  - @drizztdourden08/brock-react@0.86.0
  - @drizztdourden08/brock-core@0.86.0
  - @drizztdourden08/brock-electron@0.86.0

## 0.85.0

### Patch Changes

- Updated dependencies [2e23c94]
  - @drizztdourden08/brock-react@0.85.0
  - @drizztdourden08/brock-core@0.85.0
  - @drizztdourden08/brock-electron@0.85.0

## 0.84.0

### Patch Changes

- c813440: An app can add entries to the title bar View menu. An app menu item keyed `view` with `children` hands them to Tessera 0.54 `WindowTitleBar` as `viewItems`, drawn after Tessera's own View rows with a separator. The item still works as the placement marker for View, and the search palette lists the entries under View. `brock-react` now requires Tessera `^0.54.0`.

  Tessera 0.54 removes the controller composites and the `stickPosition` and `calibrated` strings. The input module's StickPlot owns those two labels, and the guide registers ControllerLayout, PressedGrid and StickPlot as Brock parts.

- Updated dependencies [c813440]
  - @drizztdourden08/brock-react@0.84.0
  - @drizztdourden08/brock-core@0.84.0
  - @drizztdourden08/brock-electron@0.84.0

## 0.83.0

### Patch Changes

- Updated dependencies [203ad09]
- Updated dependencies [3dd25e5]
- Updated dependencies [10222eb]
- Updated dependencies [7a23ca9]
- Updated dependencies [203ad09]
  - @drizztdourden08/brock-core@0.83.0
  - @drizztdourden08/brock-react@0.83.0
  - @drizztdourden08/brock-electron@0.83.0

## 0.82.0

### Minor Changes

- 39c91ec: ControllerLayout, StickPlot and PressedGrid move from Tessera to the input module. They keep their props and types, and the module exports them from `@drizztdourden08/brock-input/renderer` with `CONTROLLER_LAYOUT_VARIANTS`, `CONTROLLER_SLOT_IDS`, `ControllerExtra`, `ControllerSlots` and the prop types of each. `CalibrationPanel` and the device card now use the local copies. The controller strings (`Controller`, `Held now`, the slot names) ship with the component, so a Tessera strings override no longer reaches them. The BEM block of each part gains an `input-` prefix (`input-controller-layout`, `input-stick-plot`, `input-pressed-grid`), so an app stylesheet that reached into the old classes needs the new names. The `controller-components-to-input` migration of 0.82.0 rewrites an app's imports of the three names, and of their types, from `@drizztdourden08/tessera` and its `/composites` entry to `@drizztdourden08/brock-input/renderer`; the app needs the input module installed. The import codemod now also sees files that import only from the Tessera root.
- d8d48d0: `input.mapping.list()` entries now carry `source` (`builtin`, `bundled` or `user`), the `mapping` string and `inputCount`, the number of bound inputs the line declares. Main works out the source from the bundled and user database files, so the addon is unchanged.

### Patch Changes

- Updated dependencies [44e91ce]
- Updated dependencies [9e2ade8]
- Updated dependencies [a44cf5d]
- Updated dependencies [b5c6c13]
- Updated dependencies [c0b1c3d]
  - @drizztdourden08/brock-react@0.82.0
  - @drizztdourden08/brock-electron@0.82.0
  - @drizztdourden08/brock-core@0.82.0

## 0.81.0

### Patch Changes

- Updated dependencies [1f6543a]
  - @drizztdourden08/brock-core@0.81.0
  - @drizztdourden08/brock-electron@0.81.0
  - @drizztdourden08/brock-react@0.81.0

## 0.80.0

### Patch Changes

- c53d56d: The Windows addon build unpacks libusb with 7-Zip instead of tar, and skips the download when native/third_party already holds the pinned libusb version.
- Updated dependencies [b6459f5]
- Updated dependencies [845f695]
- Updated dependencies [9398c37]
- Updated dependencies [7fe7469]
  - @drizztdourden08/brock-core@0.80.0
  - @drizztdourden08/brock-electron@0.80.0
  - @drizztdourden08/brock-react@0.80.0

## 0.79.0

### Patch Changes

- Updated dependencies [6b26c03]
  - @drizztdourden08/brock-core@0.79.0
  - @drizztdourden08/brock-electron@0.79.0
  - @drizztdourden08/brock-react@0.79.0

## 0.78.0

### Patch Changes

- Updated dependencies [dd4f22c]
- Updated dependencies [0a78a00]
  - @drizztdourden08/brock-electron@0.78.0
  - @drizztdourden08/brock-core@0.78.0
  - @drizztdourden08/brock-react@0.78.0

## 0.77.0

### Minor Changes

- 475439c: `window.api.input.mapping.list()` returns every gamepad mapping SDL knows as `{ guid, name, vid, pid, platform?, family? }`, so an app can show a searchable directory of supported controllers. The vendor and product ids are decoded from the SDL GUID, the platform comes from the mapping line, and the family comes from the vendor or the name. Main parses the list once and clears it when a mapping is added. The addon adds a `mappingList` call and moves to version 1.3.0. With an older addon, with controllers off, or on Android, `list()` returns an empty list. See the mapping directory section of the module README.

### Patch Changes

- Updated dependencies [44c38e9]
- Updated dependencies [0cffb66]
- Updated dependencies [af040f2]
- Updated dependencies [49214f2]
  - @drizztdourden08/brock-react@0.77.0
  - @drizztdourden08/brock-core@0.77.0
  - @drizztdourden08/brock-electron@0.77.0

## 0.76.0

### Patch Changes

- Updated dependencies [1e8234c]
- Updated dependencies [05f559e]
- Updated dependencies [5830a25]
- Updated dependencies [3a1ebfb]
  - @drizztdourden08/brock-react@0.76.0
  - @drizztdourden08/brock-core@0.76.0
  - @drizztdourden08/brock-electron@0.76.0

## 0.75.0

### Patch Changes

- Updated dependencies [f7c46f5]
  - @drizztdourden08/brock-react@0.75.0
  - @drizztdourden08/brock-core@0.75.0
  - @drizztdourden08/brock-electron@0.75.0

## 0.74.1

### Patch Changes

- 8d987b1: `PadState.extras` now lists only the controls the device has. An Xbox pad with no paddles no longer shows ten dead rows. The list comes from the device's `hasButton` capabilities, which the addon already reports, so no new addon is needed. The paddles get the names of the pad's family: P1 to P4 on Xbox, RB, LB and the two Fn buttons on PlayStation, GR and GL on Nintendo. The ids stay the same. `padStateOf` takes an optional third argument, a `DeviceEntry` or `{ family, hasButton }`. When a device sent no capabilities, all ten extras are listed as before.
  - @drizztdourden08/brock-core@0.74.1
  - @drizztdourden08/brock-electron@0.74.1
  - @drizztdourden08/brock-react@0.74.1

## 0.74.0

### Minor Changes

- a46d346: The input module now uses the Tessera 0.50 controller types instead of its own copy. A `PadState` is now `{ slots, extras }`. `slots` holds the 20 Tessera slot ids with `pressed`, `value`, `x` and `y`. The ten extra controls (`extra.misc2` to `extra.misc6`, the four paddles and the touchpad) are no longer slots. They come as `extras`, a list of `{ id, label, pressed }` items shaped like Tessera's `ControllerExtra`, so `pad.slots` and `pad.extras` go straight into `ControllerLayout`. `onPadState` and `usePadState` carry the new shape. Read `pad.slots['face.south']` where you read `pad['face.south']` before. `CONTROLLER_SLOT_IDS` is no longer exported by the input module, import it from Tessera. Requires Tessera 0.50.0.

### Patch Changes

- Updated dependencies [a46d346]
  - @drizztdourden08/brock-react@0.74.0
  - @drizztdourden08/brock-core@0.74.0
  - @drizztdourden08/brock-electron@0.74.0

## 0.73.0

### Patch Changes

- Updated dependencies [7cdfd3a]
  - @drizztdourden08/brock-react@0.73.0
  - @drizztdourden08/brock-core@0.73.0
  - @drizztdourden08/brock-electron@0.73.0

## 0.72.0

### Minor Changes

- a86ed4e: Report each controller's state by physical place. `onPadState` and `usePadState` give a `PadState` keyed by slot (`face.south`, `stick.left`, `trigger.right`, and so on), with stick Y up positive. Each ready `DeviceEntry` now has a `family` hint (`xbox`, `playstation`, `nintendo` or `generic`).

### Patch Changes

- e4a5b6c: A Bluetooth Xbox pad on Windows lists once. SDL opens it through XInput as `045e:02ff`, and the HID listing also showed its real id, `045e:0b13`, as a second unavailable pad. The addon now reads the Windows device container of each HID device and marks the ones that share a container with an XInput interface. The snapshot lets each open XInput pad claim one such device, so two real pads still list as two. The SDL3 addon moves to 1.2.0. An older addon sends no mark, and the list behaves as before.
  - @drizztdourden08/brock-core@0.72.0
  - @drizztdourden08/brock-electron@0.72.0
  - @drizztdourden08/brock-react@0.72.0

## 0.71.1

### Patch Changes

- e0ac787: `input.list()` returns the cached device snapshot again and no longer runs a full HID scan on every call. An app that polled it could drop a pad that was in use. The scan moves to a new `input.refresh()` verb (`input:refresh`) meant for a user action, never a timer.
  - @drizztdourden08/brock-core@0.71.1
  - @drizztdourden08/brock-electron@0.71.1
  - @drizztdourden08/brock-react@0.71.1

## 0.71.0

### Patch Changes

- Updated dependencies [3a70d40]
  - @drizztdourden08/brock-react@0.71.0
  - @drizztdourden08/brock-core@0.71.0
  - @drizztdourden08/brock-electron@0.71.0

## 0.70.0

### Patch Changes

- Updated dependencies [a7bdec6]
- Updated dependencies [34221ba]
- Updated dependencies [0793ab8]
  - @drizztdourden08/brock-electron@0.70.0
  - @drizztdourden08/brock-react@0.70.0
  - @drizztdourden08/brock-core@0.70.0

## 0.69.0

### Minor Changes

- 0f510b1: Add `--input-live`: it turns SDL3 on in a headless automation launch, so a pad can be checked without a window. It stays off by default and refuses, with one warning, while another running instance holds the pad (a lock file in the OS temp folder).

### Patch Changes

- f5cb604: Fix the Controllers window showing no controllers: the input, catalog, display and secrets modules now keep one instance per app, so register and onWindow no longer build two.
- Updated dependencies [f5cb604]
- Updated dependencies [9ef1f24]
  - @drizztdourden08/brock-electron@0.69.0
  - @drizztdourden08/brock-react@0.69.0
  - @drizztdourden08/brock-core@0.69.0

## 0.68.6

### Patch Changes

- Updated dependencies [8b48bd8]
  - @drizztdourden08/brock-react@0.68.6
  - @drizztdourden08/brock-core@0.68.6
  - @drizztdourden08/brock-electron@0.68.6

## 0.68.5

### Patch Changes

- Updated dependencies [75e4730]
  - @drizztdourden08/brock-react@0.68.5
  - @drizztdourden08/brock-core@0.68.5
  - @drizztdourden08/brock-electron@0.68.5

## 0.68.4

### Patch Changes

- ab69377: Refresh HID devices when listing controllers and publish the initial controller snapshot after SDL3 starts.
- Updated dependencies [19a9788]
  - @drizztdourden08/brock-electron@0.68.4
  - @drizztdourden08/brock-core@0.68.4
  - @drizztdourden08/brock-react@0.68.4

## 0.68.3

### Patch Changes

- Updated dependencies [223a01b]
  - @drizztdourden08/brock-react@0.68.3
  - @drizztdourden08/brock-core@0.68.3
  - @drizztdourden08/brock-electron@0.68.3

## 0.68.2

### Patch Changes

- Updated dependencies [997015d]
  - @drizztdourden08/brock-react@0.68.2
  - @drizztdourden08/brock-core@0.68.2
  - @drizztdourden08/brock-electron@0.68.2

## 0.68.1

### Patch Changes

- Updated dependencies [2d1698e]
  - @drizztdourden08/brock-react@0.68.1
  - @drizztdourden08/brock-core@0.68.1
  - @drizztdourden08/brock-electron@0.68.1

## 0.68.0

### Patch Changes

- Updated dependencies [1f7604e]
  - @drizztdourden08/brock-react@0.68.0
  - @drizztdourden08/brock-core@0.68.0
  - @drizztdourden08/brock-electron@0.68.0

## 0.67.0

### Patch Changes

- Updated dependencies [1289dac]
  - @drizztdourden08/brock-react@0.67.0
  - @drizztdourden08/brock-core@0.67.0
  - @drizztdourden08/brock-electron@0.67.0

## 0.66.0

### Patch Changes

- Updated dependencies [620e6d8]
  - @drizztdourden08/brock-react@0.66.0
  - @drizztdourden08/brock-core@0.66.0
  - @drizztdourden08/brock-electron@0.66.0

## 0.65.0

### Patch Changes

- Updated dependencies [3a7f2b1]
  - @drizztdourden08/brock-react@0.65.0
  - @drizztdourden08/brock-core@0.65.0
  - @drizztdourden08/brock-electron@0.65.0

## 0.64.0

### Patch Changes

- Updated dependencies [961c0e4]
- Updated dependencies [9150a2b]
  - @drizztdourden08/brock-react@0.64.0
  - @drizztdourden08/brock-core@0.64.0
  - @drizztdourden08/brock-electron@0.64.0

## 0.63.0

### Patch Changes

- Updated dependencies [c5c4a48]
- Updated dependencies [c5c4a48]
  - @drizztdourden08/brock-react@0.63.0
  - @drizztdourden08/brock-core@0.63.0
  - @drizztdourden08/brock-electron@0.63.0

## 0.62.0

### Patch Changes

- Updated dependencies [16321f1]
- Updated dependencies [16321f1]
- Updated dependencies [9a154a7]
- Updated dependencies [16321f1]
  - @drizztdourden08/brock-react@0.62.0
  - @drizztdourden08/brock-electron@0.62.0
  - @drizztdourden08/brock-core@0.62.0

## 0.61.0

### Patch Changes

- Updated dependencies [1d810a5]
  - @drizztdourden08/brock-react@0.61.0
  - @drizztdourden08/brock-core@0.61.0
  - @drizztdourden08/brock-electron@0.61.0

## 0.60.1

### Patch Changes

- Updated dependencies [c8bfd82]
  - @drizztdourden08/brock-react@0.60.1
  - @drizztdourden08/brock-electron@0.60.1
  - @drizztdourden08/brock-core@0.60.1

## 0.60.0

### Patch Changes

- Updated dependencies [ebaabc3]
  - @drizztdourden08/brock-react@0.60.0
  - @drizztdourden08/brock-core@0.60.0
  - @drizztdourden08/brock-electron@0.60.0

## 0.59.0

### Patch Changes

- Updated dependencies [ea30589]
- Updated dependencies [4cdb713]
- Updated dependencies [4cdb713]
- Updated dependencies [4cdb713]
- Updated dependencies [19b7a49]
- Updated dependencies [19b7a49]
- Updated dependencies [e886c2a]
- Updated dependencies [ea30589]
  - @drizztdourden08/brock-react@0.59.0
  - @drizztdourden08/brock-electron@0.59.0
  - @drizztdourden08/brock-core@0.59.0

## 0.58.0

### Patch Changes

- Updated dependencies [c4b9b7d]
  - @drizztdourden08/brock-react@0.58.0
  - @drizztdourden08/brock-core@0.58.0
  - @drizztdourden08/brock-electron@0.58.0

## 0.57.0

### Patch Changes

- Updated dependencies [2bf0884]
- Updated dependencies [0b699d7]
  - @drizztdourden08/brock-core@0.57.0
  - @drizztdourden08/brock-react@0.57.0
  - @drizztdourden08/brock-electron@0.57.0

## 0.56.0

### Patch Changes

- Updated dependencies [1c0b1b6]
  - @drizztdourden08/brock-react@0.56.0
  - @drizztdourden08/brock-core@0.56.0
  - @drizztdourden08/brock-electron@0.56.0

## 0.55.0

### Patch Changes

- Updated dependencies [d974d98]
  - @drizztdourden08/brock-react@0.55.0
  - @drizztdourden08/brock-core@0.55.0
  - @drizztdourden08/brock-electron@0.55.0

## 0.54.0

### Patch Changes

- Updated dependencies [c34bf5c]
- Updated dependencies [8a06415]
  - @drizztdourden08/brock-react@0.54.0
  - @drizztdourden08/brock-core@0.54.0
  - @drizztdourden08/brock-electron@0.54.0

## 0.53.0

### Patch Changes

- Updated dependencies [60cb320]
  - @drizztdourden08/brock-react@0.53.0
  - @drizztdourden08/brock-electron@0.53.0
  - @drizztdourden08/brock-core@0.53.0

## 0.52.1

### Patch Changes

- Updated dependencies [0856664]
  - @drizztdourden08/brock-react@0.52.1
  - @drizztdourden08/brock-core@0.52.1
  - @drizztdourden08/brock-electron@0.52.1

## 0.52.0

### Patch Changes

- Updated dependencies [1477d7f]
  - @drizztdourden08/brock-react@0.52.0
  - @drizztdourden08/brock-core@0.52.0
  - @drizztdourden08/brock-electron@0.52.0

## 0.51.1

### Patch Changes

- Updated dependencies [024e1b8]
  - @drizztdourden08/brock-react@0.51.1
  - @drizztdourden08/brock-core@0.51.1
  - @drizztdourden08/brock-electron@0.51.1

## 0.51.0

### Patch Changes

- @drizztdourden08/brock-core@0.51.0
- @drizztdourden08/brock-electron@0.51.0
- @drizztdourden08/brock-react@0.51.0

## 0.50.0

### Patch Changes

- Updated dependencies [7230540]
  - @drizztdourden08/brock-react@0.50.0
  - @drizztdourden08/brock-core@0.50.0
  - @drizztdourden08/brock-electron@0.50.0

## 0.49.0

### Patch Changes

- Updated dependencies [a0eedd2]
- Updated dependencies [7f76f4f]
- Updated dependencies [9ff1b40]
- Updated dependencies [35fbe2d]
- Updated dependencies [f0510ca]
- Updated dependencies [a0eedd2]
  - @drizztdourden08/brock-react@0.49.0
  - @drizztdourden08/brock-core@0.49.0
  - @drizztdourden08/brock-electron@0.49.0

## 0.48.0

### Patch Changes

- Updated dependencies [367a4cb]
- Updated dependencies [33e371e]
  - @drizztdourden08/brock-react@0.48.0
  - @drizztdourden08/brock-core@0.48.0
  - @drizztdourden08/brock-electron@0.48.0

## 0.47.0

### Patch Changes

- Updated dependencies [6ead199]
- Updated dependencies [7923723]
- Updated dependencies [7923723]
  - @drizztdourden08/brock-core@0.47.0
  - @drizztdourden08/brock-react@0.47.0
  - @drizztdourden08/brock-electron@0.47.0

## 0.46.0

### Patch Changes

- Updated dependencies [3df3667]
- Updated dependencies [b1026b9]
- Updated dependencies [025bcf7]
- Updated dependencies [c68c54a]
- Updated dependencies [025bcf7]
- Updated dependencies [025bcf7]
- Updated dependencies [b1026b9]
- Updated dependencies [c68c54a]
- Updated dependencies [56201a6]
- Updated dependencies [025bcf7]
- Updated dependencies [c68c54a]
- Updated dependencies [3df3667]
  - @drizztdourden08/brock-electron@0.46.0
  - @drizztdourden08/brock-core@0.46.0
  - @drizztdourden08/brock-react@0.46.0

## 0.45.1

### Patch Changes

- Updated dependencies [4ec937c]
  - @drizztdourden08/brock-electron@0.45.1
  - @drizztdourden08/brock-core@0.45.1
  - @drizztdourden08/brock-react@0.45.1

## 0.45.0

### Patch Changes

- Updated dependencies [a85efb2]
- Updated dependencies [a85efb2]
- Updated dependencies [ef96908]
- Updated dependencies [a85efb2]
- Updated dependencies [aba2001]
- Updated dependencies [4caea84]
- Updated dependencies [fb41dd1]
  - @drizztdourden08/brock-react@0.45.0
  - @drizztdourden08/brock-core@0.45.0
  - @drizztdourden08/brock-electron@0.45.0

## 0.44.0

### Patch Changes

- Updated dependencies [716553d]
- Updated dependencies [716553d]
- Updated dependencies [126c8e8]
  - @drizztdourden08/brock-core@0.44.0
  - @drizztdourden08/brock-electron@0.44.0
  - @drizztdourden08/brock-react@0.44.0

## 0.43.0

### Patch Changes

- @drizztdourden08/brock-core@0.43.0
- @drizztdourden08/brock-electron@0.43.0
- @drizztdourden08/brock-react@0.43.0

## 0.42.0

### Patch Changes

- Updated dependencies [67c7a66]
  - @drizztdourden08/brock-react@0.42.0
  - @drizztdourden08/brock-core@0.42.0
  - @drizztdourden08/brock-electron@0.42.0

## 0.41.0

### Patch Changes

- Updated dependencies [8300ee8]
  - @drizztdourden08/brock-react@0.41.0
  - @drizztdourden08/brock-core@0.41.0
  - @drizztdourden08/brock-electron@0.41.0

## 0.40.0

### Patch Changes

- Updated dependencies
- Updated dependencies [9b081a6]
- Updated dependencies [ae74556]
- Updated dependencies [ae74556]
- Updated dependencies [efce654]
- Updated dependencies [efce654]
- Updated dependencies [efce654]
- Updated dependencies [ae74556]
- Updated dependencies [fb285af]
- Updated dependencies [73d8f8c]
- Updated dependencies [efce654]
- Updated dependencies [ae74556]
- Updated dependencies [1f778fd]
- Updated dependencies [ae74556]
  - @drizztdourden08/brock-core@0.40.0
  - @drizztdourden08/brock-electron@0.40.0
  - @drizztdourden08/brock-react@0.40.0

## 0.39.0

### Minor Changes

- 8397e03: `BROCK_INPUT_CMAKE_DIR` puts the CMake build folders of an addon source build at a short path (a folder, or `temp` for the system temp folder), one subfolder per package copy, so a build deep in a worktree stays under the Windows path length limit. The Android library build reads the same variable, or `brockInputCmakeDir` in `mobile/android/gradle.properties`, for its CMake staging folder.
- 8397e03: Apps can add their own buttons to the input module's device cards. `registerDeviceCardActions(actions)` (or the `useDeviceCardActions` hook) adds them to every card, the module's Controllers screen included, and `InputTester` (`deviceActions`) and `DeviceCard` (`actions`, now exported) take them as a prop too. Each `DeviceCardAction` has an `id`, a `label`, an optional `icon` and `variant`, `disabled` and `visible` checks on the `DeviceEntry`, and `onSelect(entry)`.
- 8397e03: `inputApi()` no longer returns null. On a host with no input side it returns `noopInputApi`, which reports controllers off, lists nothing, refuses every action and hands back an unsubscribe for every subscription, so app code needs no null check. `isInputAvailable()` tells whether a real input host is there. Existing `inputApi()?.` calls keep working; they can drop the `?.`.

### Patch Changes

- Updated dependencies [6d7da6d]
- Updated dependencies [472754d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [bdfc457]
- Updated dependencies [bdfc457]
- Updated dependencies [c5fc205]
- Updated dependencies [0a63f1f]
  - @drizztdourden08/brock-react@0.39.0
  - @drizztdourden08/brock-core@0.39.0
  - @drizztdourden08/brock-electron@0.39.0

## 0.38.0

### Patch Changes

- @drizztdourden08/brock-core@0.38.0
- @drizztdourden08/brock-electron@0.38.0
- @drizztdourden08/brock-react@0.38.0

## 0.37.0

### Patch Changes

- Updated dependencies [12d3780]
- Updated dependencies [8eff741]
  - @drizztdourden08/brock-react@0.37.0
  - @drizztdourden08/brock-core@0.37.0
  - @drizztdourden08/brock-electron@0.37.0

## 0.36.0

### Minor Changes

- 273846f: The input and display modules run on Android. Each ships a Capacitor plugin in its package: `BrockInput` drives SDL3 inside the app through a JNI library built against the same pinned SDL3 source as the desktop addon, and takes controller keys before the WebView without any change to `MainActivity`; `BrockDisplay` reads the display's rates and asks Android for a synced one through the window's preferred refresh rate. `inputApi()`, `displayApi()` and `window.api.input` and `window.api.display` return the same API on Android as on the desktop, so app code does not branch; raw and joystick capture, the bundled mapping database and window modes stay desktop only (the module READMEs list each limit). `platform add android` and `mobile build` wire the modules in `modules` into the Gradle project, a built-in module left out of `modules` stays out through `android.includePlugins`, and `doctor android` asks for the NDK and CMake the input module builds with. brock-core adds `nativePlugin` and `listenNative`, brock-react adds `exposeHostNamespace`.

### Patch Changes

- Updated dependencies [273846f]
- Updated dependencies [e40fe59]
- Updated dependencies [aa74a6d]
- Updated dependencies [5289e5d]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [3063895]
- Updated dependencies [b42b735]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
- Updated dependencies [0f4133a]
- Updated dependencies [cbbb865]
- Updated dependencies [524dcf3]
  - @drizztdourden08/brock-core@0.36.0
  - @drizztdourden08/brock-react@0.36.0
  - @drizztdourden08/brock-electron@0.36.0

## 0.35.0

### Patch Changes

- Updated dependencies [af0f5c5]
  - @drizztdourden08/brock-react@0.35.0
  - @drizztdourden08/brock-core@0.35.0
  - @drizztdourden08/brock-electron@0.35.0

## 0.34.0

### Patch Changes

- Updated dependencies [08e0cd1]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [08e0cd1]
- Updated dependencies [80319dd]
- Updated dependencies [80319dd]
- Updated dependencies [b4dc453]
- Updated dependencies [6bdb953]
- Updated dependencies [80319dd]
  - @drizztdourden08/brock-electron@0.34.0
  - @drizztdourden08/brock-react@0.34.0
  - @drizztdourden08/brock-core@0.34.0

## 0.33.0

### Patch Changes

- Updated dependencies [274503e]
  - @drizztdourden08/brock-react@0.33.0
  - @drizztdourden08/brock-core@0.33.0
  - @drizztdourden08/brock-electron@0.33.0

## 0.32.1

### Patch Changes

- Updated dependencies [fb5fe3a]
  - @drizztdourden08/brock-react@0.32.1
  - @drizztdourden08/brock-core@0.32.1
  - @drizztdourden08/brock-electron@0.32.1

## 0.32.0

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0
  - @drizztdourden08/brock-react@0.32.0
  - @drizztdourden08/brock-electron@0.32.0

## 0.31.0

### Patch Changes

- Updated dependencies [6584277]
- Updated dependencies [6584277]
  - @drizztdourden08/brock-react@0.31.0
  - @drizztdourden08/brock-core@0.31.0
  - @drizztdourden08/brock-electron@0.31.0

## 0.30.0

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0
  - @drizztdourden08/brock-react@0.30.0
  - @drizztdourden08/brock-electron@0.30.0

## 0.29.1

### Patch Changes

- @drizztdourden08/brock-core@0.29.1
- @drizztdourden08/brock-electron@0.29.1
- @drizztdourden08/brock-react@0.29.1

## 0.29.0

### Patch Changes

- Updated dependencies [f3fd443]
- Updated dependencies [f3fd443]
  - @drizztdourden08/brock-react@0.29.0
  - @drizztdourden08/brock-core@0.29.0
  - @drizztdourden08/brock-electron@0.29.0

## 0.28.1

### Patch Changes

- Updated dependencies [8c8d415]
- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-react@0.28.1
  - @drizztdourden08/brock-core@0.28.1
  - @drizztdourden08/brock-electron@0.28.1

## 0.28.0

### Patch Changes

- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-react@0.28.0
  - @drizztdourden08/brock-core@0.28.0
  - @drizztdourden08/brock-electron@0.28.0

## 0.27.0

### Patch Changes

- Updated dependencies [f704655]
  - @drizztdourden08/brock-react@0.27.0
  - @drizztdourden08/brock-core@0.27.0
  - @drizztdourden08/brock-electron@0.27.0

## 0.26.0

### Patch Changes

- Updated dependencies [0204060]
  - @drizztdourden08/brock-react@0.26.0
  - @drizztdourden08/brock-core@0.26.0
  - @drizztdourden08/brock-electron@0.26.0

## 0.25.0

### Patch Changes

- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
- Updated dependencies [8903da0]
  - @drizztdourden08/brock-react@0.25.0
  - @drizztdourden08/brock-core@0.25.0
  - @drizztdourden08/brock-electron@0.25.0

## 0.24.1

### Patch Changes

- Updated dependencies [0dd8c3c]
  - @drizztdourden08/brock-electron@0.24.1
  - @drizztdourden08/brock-react@0.24.1
  - @drizztdourden08/brock-core@0.24.1

## 0.24.0

### Patch Changes

- @drizztdourden08/brock-core@0.24.0
- @drizztdourden08/brock-electron@0.24.0
- @drizztdourden08/brock-react@0.24.0

## 0.23.0

### Patch Changes

- Updated dependencies [e769096]
- Updated dependencies [e769096]
- Updated dependencies [e769096]
  - @drizztdourden08/brock-react@0.23.0
  - @drizztdourden08/brock-core@0.23.0
  - @drizztdourden08/brock-electron@0.23.0

## 0.22.0

### Patch Changes

- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-react@0.22.0
  - @drizztdourden08/brock-core@0.22.0
  - @drizztdourden08/brock-electron@0.22.0

## 0.21.1

### Patch Changes

- Updated dependencies [0e425f6]
- Updated dependencies [0e425f6]
  - @drizztdourden08/brock-electron@0.21.1
  - @drizztdourden08/brock-core@0.21.1
  - @drizztdourden08/brock-react@0.21.1

## 0.21.0

### Patch Changes

- Updated dependencies [0999a18]
- Updated dependencies [6016488]
  - @drizztdourden08/brock-react@0.21.0
  - @drizztdourden08/brock-core@0.21.0
  - @drizztdourden08/brock-electron@0.21.0

## 0.20.0

### Patch Changes

- Updated dependencies [d700531]
  - @drizztdourden08/brock-react@0.20.0
  - @drizztdourden08/brock-core@0.20.0
  - @drizztdourden08/brock-electron@0.20.0

## 0.19.0

### Patch Changes

- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-react@0.19.0
  - @drizztdourden08/brock-core@0.19.0
  - @drizztdourden08/brock-electron@0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [2473089]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
- Updated dependencies [da0b1eb]
- Updated dependencies [70d80cf]
- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-react@0.18.0
  - @drizztdourden08/brock-core@0.18.0
  - @drizztdourden08/brock-electron@0.18.0

## 0.17.1

### Patch Changes

- @drizztdourden08/brock-core@0.17.1
- @drizztdourden08/brock-electron@0.17.1
- @drizztdourden08/brock-react@0.17.1

## 0.17.0

### Patch Changes

- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [d358df3]
- Updated dependencies [055bb91]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
- Updated dependencies [87fa9a3]
  - @drizztdourden08/brock-core@0.17.0
  - @drizztdourden08/brock-electron@0.17.0
  - @drizztdourden08/brock-react@0.17.0

## 0.16.0

### Patch Changes

- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [9a3b1f6]
- Updated dependencies [7ef6122]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-react@0.16.0
  - @drizztdourden08/brock-core@0.16.0
  - @drizztdourden08/brock-electron@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0
  - @drizztdourden08/brock-electron@0.15.0
  - @drizztdourden08/brock-react@0.15.0

## 0.14.0

### Patch Changes

- Updated dependencies [add0686]
  - @drizztdourden08/brock-electron@0.14.0
  - @drizztdourden08/brock-react@0.14.0
  - @drizztdourden08/brock-core@0.14.0

## 0.13.0

### Patch Changes

- Updated dependencies [33dc33c]
- Updated dependencies [4711645]
  - @drizztdourden08/brock-core@0.13.0
  - @drizztdourden08/brock-electron@0.13.0
  - @drizztdourden08/brock-react@0.13.0

## 0.12.0

### Patch Changes

- Updated dependencies [f751683]
- Updated dependencies [f751683]
- Updated dependencies [59c1c9d]
- Updated dependencies [f2b86ff]
  - @drizztdourden08/brock-react@0.12.0
  - @drizztdourden08/brock-core@0.12.0
  - @drizztdourden08/brock-electron@0.12.0

## 0.11.0

### Patch Changes

- Updated dependencies [48ca303]
- Updated dependencies [54d913a]
  - @drizztdourden08/brock-core@0.11.0
  - @drizztdourden08/brock-electron@0.11.0
  - @drizztdourden08/brock-react@0.11.0

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

### Patch Changes

- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
- Updated dependencies [a265770]
  - @drizztdourden08/brock-react@0.10.0
  - @drizztdourden08/brock-core@0.10.0
  - @drizztdourden08/brock-electron@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0
  - @drizztdourden08/brock-electron@0.9.0
  - @drizztdourden08/brock-react@0.9.0

## 0.8.1

### Patch Changes

- @drizztdourden08/brock-core@0.8.1
- @drizztdourden08/brock-electron@0.8.1
- @drizztdourden08/brock-react@0.8.1

## 0.8.0

### Patch Changes

- Updated dependencies [b7c919a]
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-electron@0.8.0
  - @drizztdourden08/brock-core@0.8.0
  - @drizztdourden08/brock-react@0.8.0

## 0.7.1

### Patch Changes

- Updated dependencies [e0ea131]
  - @drizztdourden08/brock-react@0.7.1
  - @drizztdourden08/brock-core@0.7.1
  - @drizztdourden08/brock-electron@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
- Updated dependencies [6d32d18]
- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0
  - @drizztdourden08/brock-react@0.7.0
  - @drizztdourden08/brock-electron@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [227dadf]
  - @drizztdourden08/brock-react@0.6.1
  - @drizztdourden08/brock-core@0.6.1
  - @drizztdourden08/brock-electron@0.6.1

## 0.6.0

### Minor Changes

- 0d9b68a: Brock moves onto Tessera 0.7.0. Hubs and settings hubs sit on `SideNavLayout`, a settings page draws one `SettingsSection` per section (with its own empty message), and hub search hits show their path and description. The logs widget hands `LogPanel` the whole log and keeps its type filter as a widget pref (`filters`, a list of filter clauses, in place of `hiddenLevels`). `ProfilesPanel` rows pass their aside as an end column. Popped widget windows follow Tessera's `visibleLayoutOf` gates, and `onPopOut` takes Tessera's `ScreenPoint`. The input tester and `CalibrationPanel` draw controller glyphs with Tessera's `InputIcon`: `CalibrationPanel` takes `family`, and `inputFamilyOf(vendorId)` picks Xbox, PlayStation, Switch or generic. The display settings tab lets its sections keep Tessera's spacing. Brock's root `tessera.config.json` sets `layer: renderer-shell` and an app tree for the panels Tessera handed over.

### Patch Changes

- Updated dependencies [0d9b68a]
  - @drizztdourden08/brock-react@0.6.0
  - @drizztdourden08/brock-core@0.6.0
  - @drizztdourden08/brock-electron@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [ff027d0]
- Updated dependencies [241d164]
  - @drizztdourden08/brock-core@0.5.0
  - @drizztdourden08/brock-electron@0.5.0
  - @drizztdourden08/brock-react@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: AboutPanel, ReleaseNotesPanel and CalibrationPanel are Brock compounds now, with ProfilesPanel replacing Tessera's ProfilePicker: brock-react exports `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel`, and `@drizztdourden08/brock-input/renderer` exports `CalibrationPanel`, each with its props types and a Tessera usage file. The About screen sits in Tessera's `InfoScreen`, the Profiles screen can rename a profile in its row (`useProfiles().rename`), the input tester shows the buttons held while it calibrates, and the updater dialog draws brock-react's `ReleaseNotesPanel`.

### Patch Changes

- Updated dependencies [f90c7ee]
- Updated dependencies [babbff5]
  - @drizztdourden08/brock-react@0.4.0
  - @drizztdourden08/brock-core@0.4.0
  - @drizztdourden08/brock-electron@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [dde5d7e]
  - @drizztdourden08/brock-react@0.3.0
  - @drizztdourden08/brock-core@0.3.0
  - @drizztdourden08/brock-electron@0.3.0

## 0.2.0

### Patch Changes

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies
- Updated dependencies [f818087]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-react@0.2.0
  - @drizztdourden08/brock-core@0.2.0
  - @drizztdourden08/brock-electron@0.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [db1a6be]
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-react@0.1.2
  - @drizztdourden08/brock-core@0.1.2
  - @drizztdourden08/brock-electron@0.1.2

## 0.1.1

### Patch Changes

- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- bfbecb8: An automation launch leaves SDL3 off, so it never takes a controller from a running session.
- 4a48945: The input module reads SDL3 controllers, keeps the mapping database and calibration, plays rumble, and adds a Controllers screen.
- c48024b: The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- Updated dependencies [0a52cd7]
- Updated dependencies [ade72f8]
- Updated dependencies [9a08468]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [38edbcc]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [7e039b6]
- Updated dependencies [9fdc2e1]
- Updated dependencies [d50bd75]
- Updated dependencies [23907ce]
- Updated dependencies [a8a87be]
- Updated dependencies [e2cf0ee]
  - @drizztdourden08/brock-core@0.1.1
  - @drizztdourden08/brock-electron@0.1.1
  - @drizztdourden08/brock-react@0.1.1

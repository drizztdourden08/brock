# @drizztdourden08/brock-display

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

### Minor Changes

- c5c4a48: A module settings tab now joins the app's settings group of the same name instead of drawing a second one. Before, an app whose settings bucket declared `{ id: 'app', label: 'App' }` showed two App groups once brock-display added its Display tab. `TabDef` takes `groupId`, a stable id for its group: a tab joins the nav group with that id, else the group whose label is its `group` (trimmed, any case). Inside the group the app's own pages come first, in their `meta.order`, then the tabs in the order the app's `settings.tabs` and the modules list them. A tab that matches no group starts one after the app's groups, and later tabs with the same id or label join it. The Display tab now has `groupId: 'app'`. The review's `buckets` step fails a hub whose nav shows two groups with the same label (`<bucket>-nav-groups`).

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

- c5fc205: The display settings defaults now depend on the host. `displayDefaultsFor(host)` merges `DEFAULT_DISPLAY_SETTINGS` with `HOST_DISPLAY_DEFAULTS`, which turns `syncedRateInFullscreen` on for Android, where the app is always full screen; the desktop and the web keep it off. `readDisplaySettings(settings, host?)` reads a missing key as the host default. Spread `displayDefaultsFor(detectHost())` into the app's defaults to store the same value.

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

- 5d02359: Display accepts koffi 3. The `koffi` peer range is now `^2.9.0 || ^3.0.0`, so an app already on koffi 3 keeps it. Nothing in the driver changed: it declares `DEVMODEW` and the C prototypes and calls them, which koffi 3 kept, and the macOS driver only passes its pointers back and checks them for null, which holds for koffi 3's BigInt pointers. A new test runs the Windows driver on koffi 3 and the same declarations on koffi 2: struct size, the current mode read in place, the rate list, and a `CDS_TEST` mode change.
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

- b5bae6b: A display module with refresh rate detection, a synced rate for fullscreen, window mode and screen switching, and a Display settings tab.
- bdde234: `brock add` installs the packages a module lists under `peers`, so the updater brings velopack and the display module brings koffi.
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

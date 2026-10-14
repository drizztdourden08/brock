---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

A Capacitor host. On Android or iOS brock-react fell back to the web factory: no file store, `formFactor: 'desktop'`, no title bar, and `ports.capacitor` of a module was never read. It now builds a `capacitor` platform over the app's Capacitor plugins (Filesystem, App, Haptics, KeepAwake, by name): the app's files persist in the app data folder, the device port drives the back button, pause and haptics, `formFactor` is `mobile`, and module ports for `capacitor` are merged in. A new capability, `titleBar`, draws the title bar with its menu on a phone, while `windowChrome` keeps the window buttons to Electron.

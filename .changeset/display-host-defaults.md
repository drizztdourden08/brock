---
'@drizztdourden08/brock-display': minor
---

The display settings defaults now depend on the host. `displayDefaultsFor(host)` merges `DEFAULT_DISPLAY_SETTINGS` with `HOST_DISPLAY_DEFAULTS`, which turns `syncedRateInFullscreen` on for Android, where the app is always full screen; the desktop and the web keep it off. `readDisplaySettings(settings, host?)` reads a missing key as the host default. Spread `displayDefaultsFor(detectHost())` into the app's defaults to store the same value.

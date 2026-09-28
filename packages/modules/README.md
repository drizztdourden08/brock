<!-- @layer docs @kind doc -->
# Brock modules

Optional modules live here, one package each. Each carries a `package.json#brock` manifest and is installed into an app with `brock add <id>`. The workspace glob `packages/modules/*` points here.

| Module | Holds |
|---|---|
| `secrets` | Encrypted secret store on Electron `safeStorage`, device-code sign-in. |
| `updater` | Velopack startup hooks, check, download and apply, a version picker and the update dialog. |
| `input` | SDL3 controllers, the mapping database, calibration, rumble and the Controllers screen. |
| `display` | Refresh rate, a synced rate in fullscreen, window mode and monitor switching. |
| `port-kit` | What a PC port of a game compiled to WebAssembly needs, with no game in it: core lifecycle, saves and SRAM, video, audio, live settings, ROM source, asset pipeline runner, ensure-wasm. |

`input` loads a native SDL3 addon at runtime. The addon is found on disk and never bundled, so a blank app carries no SDL3 at all.

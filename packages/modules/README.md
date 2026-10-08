<!-- @layer docs @kind doc -->
# Brock modules

Optional modules live here, one package each. Each carries a `package.json#brock` manifest and is installed into an app with `brock add <id>`. The workspace glob `packages/modules/*` points here.

| Module | Holds |
|---|---|
| `secrets` | Encrypted secret store on Electron `safeStorage`, device-code sign-in. |
| `updater` | Velopack startup hooks, check, download and apply, a version picker and the update dialog. |
| `input` | SDL3 controllers, the mapping database, calibration, rumble and the Controllers screen. |
| `display` | Refresh rate, a synced rate in fullscreen, window mode and monitor switching. |
| `tools` | External binaries the app declares (ffmpeg, for one): found in `Data/tools` or on `PATH`, downloaded and checksum-verified as a job, run with an argument array. |
| `catalog` | A content catalogue client: the app's catalogue API and schema, installs as Brock jobs with size and sha256 checks, uninstall, the installed record and guard, install links, `CatalogInstallBar`. |
| `port-kit` | What a PC port of a game compiled to WebAssembly needs, with no game in it: core lifecycle, saves and SRAM, video, audio, live settings, ROM source, asset pipeline runner, ensure-wasm. |

`input` carries the source of a native SDL3 addon in `input/native`. Its postinstall downloads the prebuild for the platform from the brock releases, and `brock dev` and `brock build` fetch it too when the install skipped that step. The builder config ships it through `extraResources` in an app that lists `input`, so a blank app carries no SDL3 at all.

A module manifest can declare these packaging fields, all paths relative to the module package:

| Field | Effect |
|---|---|
| `prepare` | A Node script `brock dev` and `brock build` run first. A failure is reported and the command goes on. |
| `extraResources` | `{ from, to }` entries added to the electron-builder `extraResources`. `${platform}` and `${arch}` expand. |
| `packExclude` | Globs inside the package kept out of `app.asar`. |

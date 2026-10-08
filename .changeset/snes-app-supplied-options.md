---
'@drizztdourden08/brock-plugin-snes': minor
---

The SNES plugin carries no game of its own. `snes.roms.sha1` is empty by default, so `snes rom check` knows no ROM until the workspace lists the hashes it accepts under `snes.roms.sha1` in `brock.workspace.mjs`. The core output defaults to port kit's `public/wasm` (the plugin now starts from port kit's `WASM_DEFAULTS`); a port whose core goes elsewhere sets `snes.wasm.output`. The flags `snes.saveStateOf` gives the app come from the new `snes.states.launchFlags`, `{ game: [...], save: [...] }` with `{state}` replaced by the save name or quick slot; the defaults are `--start-game` and `--load-state=<state>`, and an app whose main process reads other flags sets its own there. The plugin README documents the options with an example.

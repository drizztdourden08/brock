<!-- @layer docs @kind doc -->
# Brock modules

Optional modules live here, one package each: `updater`, `secrets`, `input`, `display`, `port-kit`. Each carries a `package.json#brock` manifest and is installed into an app with `brock add <id>`. `secrets` and `port-kit` are extracted; the others still wait. The workspace glob `packages/modules/*` points here.

| Module | Holds |
|---|---|
| `secrets` | Encrypted secret store on Electron `safeStorage`, device-code sign-in. |
| `port-kit` | What a PC port of a game compiled to WebAssembly needs, with no game in it: core lifecycle, saves and SRAM, video, audio, live settings, ROM source, asset pipeline runner, ensure-wasm. |

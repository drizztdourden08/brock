<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-plugin-snes

The SNES PC-port bundle for the Brock thread CLI: everything a port of a SNES game needs and nothing a plain app does.

```
<repo> snes wasm build [--force]     build the C core to WebAssembly with the pinned Emscripten SDK
<repo> snes rom check <file>         SHA-1 against the ROMs the workspace lists
<repo> snes vault sync | status      the private save-state fixture vault
<repo> snes vault force-push "<msg>" one-sided overwrite; asks
```

Provision steps a workspace places itself: `snes.copyAssetBlob()` (the ROM and its extracted asset blob into the worktree's user data), `snes.seedSaveStates()` (the fixture saves into the profile). Build step: `snes.wasmBuild()`. Launch hook: `snes.saveStateOf` turns a state name or a quick-slot number into the app's launch flags and refuses a state that does not exist.

The wasm stale check and the build run are port kit's (`@drizztdourden08/brock-port-kit/ensure-wasm`), a dependency of this plugin. The plugin starts from port kit's defaults (the core under `core/`, the output in `public/wasm`) and adds the pinned SDK install and the SDK folder of the main checkout, which every worktree builds with. The save-state fixtures the vault holds may be raw core states or port kit `PKSV` containers; port kit loads both.

## Options

The plugin reads the `snes` key of `brock.workspace.mjs`, one object per section (`wasm`, `roms`, `states`, `vault`). Each section is merged over the plugin's defaults one key deep, so a key the workspace sets replaces the default whole.

```js
import { defineWorkspace } from '@drizztdourden08/brock-thread';
import { plugin as snesPlugin } from '@drizztdourden08/brock-plugin-snes';

export default defineWorkspace({
  name: 'my-port',
  plugins: [snesPlugin],
  snes: {
    wasm: { output: 'apps/game/public/wasm' },
    roms: {
      sha1: {
        '0123456789ABCDEF0123456789ABCDEF01234567': 'us',
        '89ABCDEF0123456789ABCDEF0123456789ABCDEF': 'eu',
      },
    },
    states: { launchFlags: { game: ['--boot'], save: ['--boot', '--slot={state}'] } },
  },
});
```

- `roms.sha1` maps the upper-case SHA-1 of each ROM the game accepts to a label. It is empty by default, so `snes rom check` knows no ROM until the app lists its own. A copier-header (`.smc`) is stripped before the hash.
- `wasm` takes port kit's `WasmOptions` (`sourceDirs`, `output`, `buildScript`, `emsdkDir` and the rest) plus `emsdkRepo`. The plugin keeps `.c` and `.h` as the source extensions.
- `states.launchFlags` is the contract between `snes.saveStateOf` and the app: `game` is the flag list for the `game` state (boot straight into the game), `save` the flag list for a named manual save or a quick-slot number, with `{state}` replaced by it. The defaults are `['--start-game']` and `['--load-state={state}']`; an app whose main process reads other flags sets its own here. The `none` state passes no flag.

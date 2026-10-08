<!-- @layer docs @kind doc -->
# brock-port-kit

What a PC port of a game compiled to WebAssembly needs, with no game in it. The game brings its core, the names of its C exports, its ROM hashes and its asset extractors in one typed port definition. The kit runs the rest.

## Install

```sh
brock add port-kit
```

`brock sync` imports the module on all three sides. Main serves the core bytes to a renderer loaded over `file://`, and creates `Data/roms` and `Data/assets`. The preload adds `window.api.portKit.readCore(file)`.

## The port definition

```ts
import { definePort } from '@drizztdourden08/brock-port-kit';
import { ROM_SHA1 } from './rom-hashes.constants';
import { EXTRACTORS } from './extractors';
import type { GameSettings } from './settings.type';

const port = definePort<GameSettings>({
  id: 'my-port',
  core: {
    glue: './wasm/game.js',
    wasm: 'wasm/game.wasm',
    factory: 'GameCore',
    files: { assets: '/game_assets.dat', config: '/game.ini', sram: '/saves/sram.dat', state: '/saves/save{slot}.sav', scratchSlot: 98 },
    exports: {
      stop: 'WasmStop',
      pause: 'WasmSetPaused',
      initHeadless: 'WasmInitHeadless',
      saveSram: 'WasmSaveSram',
      saveState: 'WasmSaveState',
      loadState: 'WasmLoadState',
    },
  },
  rom: {
    extensions: ['.sfc', '.smc'],
    known: ROM_SHA1,
    normalize: (bytes) => ((bytes.length & 0xfffff) === 0x200 ? bytes.subarray(0x200) : bytes),
  },
  video: { mode: 'emscripten', context: 'webgl' },
  audio: { mode: 'emscripten-sdl' },
  saves: { quickSlots: 12, sramSyncMs: 5000 },
  settings: {
    apply: (settings, core) => {
      core.call('WasmSetFeatures', settings.features);
      if (core.has('WasmSetMasterVolume')) core.call('WasmSetMasterVolume', settings.volume);
    },
  },
  assets: { extension: '.dat', extractors: EXTRACTORS },
});
```

`known` maps an upper-case SHA-1 to `{ id, label }`. The id names the stored ROM (`roms/<id>.sfc`, the first of `extensions`) and its asset blob (`assets/<id>.dat`).

`rom.keepFileName: true` keeps the name the file was imported under instead: `Game (USA).smc` is stored as `roms/Game (USA).smc` and its blob as `assets/Game (USA).dat`, for a port whose ROM-to-asset naming or existing data already depends on the original name. The store then lists a ROM by hashing it rather than by its name, and skips files that are not a known dump. The name only loses its folder; one a disk would refuse (a reserved device name, `<>:"/\|?*`, a leading dot, a trailing dot or space) is refused. The default, `false`, is the id naming above. Either way the stored bytes are the `normalize`d dump, so a copier header is stripped. A core that renders to a framebuffer and hands out samples says so instead: `video: { mode: 'framebuffer', width, height, frame: 'WasmFramePtr' }` and `audio: { mode: 'samples', sampleRate, channels, samples: 'WasmAudioPtr', count: 'WasmAudioFrames' }`, with `exports.runFrame`; the kit then drives the frame loop itself.

## Running it

```tsx
const core = createGameCore(port);
const session = createPortSession({ core, canvas, files: getPlatform().files, romFile: 'us.sfc', profileId, settings });
await session.start();
session.settings.push(nextSettings);
await session.saves()?.save({ kind: 'quick', slot: 0 });
await session.stop();
```

`useCoreState(core)` gives `{ status, error }` to a component. `GameCanvas` and `RomPicker` are the two Tessera-built pieces of UI. Every part also stands alone: `createGameCore`, `createFramePresenter`, `createFrameLoop`, `createAudioAdapter`, `createLiveSettings`, `createSramSync`, `createSaveSlots`, `createRomStore`, `createAssetCache`, `runAssetPipeline`.

## Saves

| Path under `Data/profiles/<id>/saves/` | Holds |
|---|---|
| `sram.dat`, `sram.bak` | Battery save, flushed every `sramSyncMs` when it changed. The previous copy is kept. |
| `quick/save<N>.sav`, `quick/save<N>.png` | Quick slots and their screenshots. |
| `normal/`, `auto/` | Named saves, listed in `manifest.json`. |

A `.sav` is a container: a `PKSV` header, the metadata as JSON (`port`, `savedAt`, `rom`), then the core's state bytes. A save from another port is refused. Saving always writes the container.

Loading also takes a raw state: a file that does not start with `PKSV` is handed to the core as it is, so states and fixtures written before the kit (or by the core itself) still load. `decodeSaveSlot(bytes, port)` says which it read in `format` (`'pksv'` or `'raw'`); a raw state carries no metadata, so its `meta` is `{ port, savedAt: 0 }`. Pass `{ acceptRaw: false }` to refuse anything but a container (`reason: 'magic'`). An empty file is always refused.

## ensure-wasm

The app runs `port-kit-ensure-wasm` before `dev` and `build`. It rebuilds the core when an output is missing or a C source is newer than it. Options come from `package.json#portKit.wasm` and use the names of the SNES thread plugin: `sourceDirs`, `skipDirs`, `sourceExtensions`, `buildScript`, `output`, `outputExtensions`, `emsdkDir`. The build script runs with `$EMSDK` on the path when the SDK is found.

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

`rom.keepFileName: true` keeps the name the file was imported under instead: `Game (USA).smc` is stored as `roms/Game (USA).smc` and its blob as `assets/Game (USA).dat`, for a port whose ROM-to-asset naming or existing data already depends on the original name. The store then lists a ROM by its hash, not its name, and skips files that are not a known dump. The name only loses its folder; one a disk would refuse (a reserved device name, `<>:"/\|?*`, a leading dot, a trailing dot or space) is refused. The default, `false`, is the id naming above. Either way the stored bytes are the `normalize`d dump, so a copier header is stripped.

### Unknown dumps, zips and several kinds

`rom.acceptUnknown: true` stores a dump that is not in `known` instead of refusing it. Its identity id is its lower-case SHA-1, so with the id naming it is stored as `roms/<sha1>.sfc`; `importRom` and `read` flag it with `rom.unknown: true`, and `list` returns it with `unknown: true` and its `hash`. Its label is the stem of the file it was imported or stored under. `rom.maxBytes` refuses a larger dump (`reason: 'size'`).

`importRom` also takes a zip: a file whose name has none of `extensions` and whose bytes start a zip archive is opened (stored or deflated entries, through the platform's `DecompressionStream`) and the one entry with a ROM extension inside is imported under its own name: the single known dump inside, or, with `acceptUnknown`, the one ROM file of a zip that holds exactly one and no known dump. Every other zip (none, several and no single known one, an entry over `maxBytes`, one that cannot be read) is refused with `reason: 'archive'` and a `message` that lists what it held, each entry with a note (`known dump`, `unknown dump`, `too large`, `not a ROM file`). `readZipEntries(bytes)` is exported for an app that reads other archives.

`rom.kinds` declares more ROM kinds beside the port's own one, each with its own `extensions`, `known`, `normalize`, `keepFileName`, `acceptUnknown`, `maxBytes`, an optional `label` and a `dir` (default `roms`, so kinds told apart by extension can share it). `createRomStore(files, port)` is the store of the port's own kind (`main`, `MAIN_ROM_KIND`); `store.kinds()` lists every kind and `store.of(kind)` returns the store of one, with the same calls. Only the `main` kind has the asset blob.

`listNames()` lists the stored files of a kind by name only, sorted, with no read and no hash: `{ file, label, hasAssets }`, the label being the known dump's label for an id-named file, else the file name without its extension. It is for a quick listing (a picker that opens at once); `list` stays the call that checks every dump.

`remove(file)` deletes the ROM, its asset blob and every path `derived(file, files)` of its kind returns (files built from it, such as a second asset blob or a cache), and resolves the paths it removed.

A core that renders to a framebuffer and hands out samples says so instead: `video: { mode: 'framebuffer', width, height, frame: 'WasmFramePtr' }` and `audio: { mode: 'samples', sampleRate, channels, samples: 'WasmAudioPtr', count: 'WasmAudioFrames' }`, with `exports.runFrame`; the kit then drives the frame loop itself.

## Running it

```tsx
const core = createGameCore(port);
const session = createPortSession({ core, canvas, files: getPlatform().files, romFile: 'us.sfc', profileId, settings });
await session.start();
session.settings.push(nextSettings);
await session.saves()?.save({ kind: 'quick', slot: 0 });
await session.stop();
```

`createGameCore(port, options)` takes:

- `precompiled`: a `WebAssembly.Module`, or a function that resolves one (or `null`), instantiated instead of fetching and compiling the core at each start. `compileCore(port)` loads and compiles the core, so an app can warm it up at boot and hand the module over.
- `crashArmDelayMs`: a WebAssembly runtime error in the first milliseconds after a start is swallowed and does not stop the core (default 0). After it, the first one sets the core's state to `error`, later ones are swallowed.
- `onCrash({ message, error, event })`: called once for that crash, to log it or write a crash dump.
- `watchCrashFrom`: `'running'` (the default) arms the crash watch once the core runs; `'start'` arms it when `start` or `initHeadless` is called, before the glue script loads, so a WebAssembly runtime error while the core boots also sets the state to `error` and reaches `onCrash`, and the core is torn down instead of reported running. The arm delay counts from that moment. Each start arms a fresh watch.

`watchCoreCrash(onCrash, armDelayMs?)` is the watch itself, for an app that loads its core another way: it reports the first WebAssembly runtime error after the delay, swallows the others and returns the stop function.

`createPortSession({ ..., saveTransform })` and `createSaveSlots({ ..., transform })` take save transform hooks: `save(state, kind)` changes the core's state bytes before they go into the container (it may be async, to stamp the app version for example), and `load(state)` changes them back before the core loads them. `captureState` and SRAM are left as they are.

`createLiveSettings` and `createSramSync` also run without `createGameCore`, for an app that loads its core itself: `createLiveSettings({ calls, apply })` takes a `calls()` accessor and the apply function, and `createSramSync({ read, store, profileId })` a `read()` that returns the SRAM bytes or `null`. `createCoreCalls(module)` builds the `CoreCalls` of an Emscripten module.

`useCoreState(core)` gives `{ status, error }` to a component. `GameCanvas` and `RomPicker` are the two Tessera-built pieces of UI. Every part also stands alone: `createGameCore`, `createFramePresenter`, `createFrameLoop`, `createAudioAdapter`, `createLiveSettings`, `createSramSync`, `createSaveSlots`, `createRomStore`, `createAssetCache`, `runAssetPipeline`.

## Saves

| Path under `Data/profiles/<id>/saves/` | Holds |
|---|---|
| `sram.dat`, `sram.bak` | Battery save, flushed every `sramSyncMs` when it changed. The previous copy is kept. |
| `quick/save<N>.sav`, `quick/save<N>.png` | Quick slots and their screenshots. |
| `normal/`, `auto/` | Named saves, listed in `manifest.json`. |

A `.sav` is a container: a `PKSV` header, the metadata as JSON (`port`, `savedAt`, `rom`), then the core's state bytes. A save from another port is refused. Saving writes the container unless `createSaveSlots({ ..., format: 'raw' })` (or `createPortSession({ ..., saveFormat: 'raw' })`) asks for the bare state bytes, after the save transform: for a port whose states other tools read, or whose files existed before the kit. A raw state carries no metadata, so the screenshot and the named save manifest are all that describe it.

Named saves (`store.named`) are listed in each folder's `manifest.json`. Beside `create`, `list`, `find` and `remove`:

- `rename(profileId, kind, id, name)` changes the name and keeps the files; `overwrite(profileId, kind, id, { bytes, screenshot?, meta? })` writes new bytes under the same id and moves `savedAt`. Both resolve `null` for an unknown id, and an empty name is refused.
- `prune(profileId, kind, { keep?, maxAgeMs?, now? })` removes every save past the newest `keep` and every save older than `maxAgeMs`, and resolves the removed entries.
- `details(profileId, kind)` lists the entries newest first with `bytes` (the state and its screenshot), leaving out an entry whose state file is gone; `size(profileId, kind)` sums them.
- `create` and `overwrite` take an optional `meta` object, kept on the entry for the app (what made an auto save, for example).

`createSaveStore(files, { companions })` names files that belong to a slot (`companions(profileId, ref)` returns their paths): they are removed whenever that slot is written or removed, so a sidecar never outlives or misdescribes its save.

Loading also takes a raw state: a file that does not start with `PKSV` is handed to the core as it is, so states and fixtures written before the kit (or by the core itself) still load. `decodeSaveSlot(bytes, port)` says which it read in `format` (`'pksv'` or `'raw'`); a raw state carries no metadata, so its `meta` is `{ port, savedAt: 0 }`. Pass `{ acceptRaw: false }` to refuse anything but a container (`reason: 'magic'`). An empty file is always refused.

## Asset extraction in a worker thread

`runAssetWorkerJob(ctx, options)` from `@drizztdourden08/brock-port-kit/main` runs an app's extraction steps in a Node worker thread, as a `ctx.job` the job dialog shows:

```ts
import extractWorker from './extract.worker?modulePath';

const results = await runAssetWorkerJob(ctx, {
  id: `assets:${romFile}`,
  title: 'Building the game assets',
  worker: extractWorker,
  workerData: { romBytes },
  steps: [{ id: 'graphics', label: 'Graphics', weight: 3 }, { id: 'text', label: 'Text', input: { language: 'en' } }],
  onResult: (step, result) => writeAsset(step, result),
});
```

The worker module serves the steps by id with `serveAssetSteps` from `@drizztdourden08/brock-port-kit/worker`; each step gets its `input` and a report (`progress(fraction, line?)`, `line(text)`, `log(message, level?)`) that lands on the job:

```ts
import { workerData } from 'node:worker_threads';
import { serveAssetSteps } from '@drizztdourden08/brock-port-kit/worker';

serveAssetSteps({
  graphics: (_input, report) => { report.progress(0.5); return extractGraphics(workerData.romBytes); },
  text: (input) => extractText(workerData.romBytes, input),
});
```

The steps run one after another in one thread, each made the job's current step; the job resolves every step's result by id, and `onResult` sees each as it lands. Typed arrays in a result move to main without a copy. A step that throws, a step the worker lacks or a worker that exits fails the job with that reason, and cancelling the job (`cancellable`, true by default) ends the thread. electron-vite builds the worker as its own file from the `?modulePath` import; the managed main config names `electron/main.ts` as a build input rather than a library entry, since a library entry gave the worker bundle one output per format and stopped the build (Brock 0.43).

## ensure-wasm

The app runs `port-kit-ensure-wasm` before `dev` and `build`. It rebuilds the core when an output is missing or a C source is newer than it. Options come from `package.json#portKit.wasm` and use the names of the SNES thread plugin: `sourceDirs`, `skipDirs`, `sourceExtensions`, `buildScript`, `output`, `outputExtensions`, `emsdkDir`. The build script runs with `$EMSDK` on the path when the SDK is found. `emsdkDir` is relative to the app folder or absolute, and `$EMSDK` wins over it.

On Windows, when the SDK folder holds `emsdk_env.bat`, the build script runs after it in one `cmd` session, so the SDK's own Node, Python and paths are active; otherwise the SDK's `upstream/emscripten` goes on the path as before. In a linked git worktree with no SDK of its own at a relative `emsdkDir`, the same folder of the main checkout is used (found through the worktree's `.git` file, with no git call), so a worktree builds with the SDK installed once in the main checkout; `$EMSDK` and an absolute `emsdkDir` are taken as they are. `emsdkOf` then says `mainCheckout: true`, and `mainCheckoutOf(dir)` is exported.

`skipWithoutSdk: true` (or `port-kit-ensure-wasm --skip-without-sdk`) skips a stale build with a message, and resolves `'skipped'`, when no SDK is found: none at `$EMSDK` or `emsdkDir`, and no `emcc` on the path. A machine that only fetches a prebuilt core uses it. `emsdkOf(root, wasm)` tells what was found.

This is the only copy of the stale check. `@drizztdourden08/brock-plugin-snes` imports it from `@drizztdourden08/brock-port-kit/ensure-wasm`: its `wasmBuild()` step and `snes wasm build` ask `wasmStaleReason`, and build through `ensureWasm({ ..., force: true })` with the SDK of the main checkout. `force` builds even when the core is current.

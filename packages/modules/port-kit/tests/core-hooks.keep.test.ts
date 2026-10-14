/* @layer core @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CoreCalls } from '../src/port/port-definition.type';
import type { EmscriptenConfig, EmscriptenModule } from '../src/renderer/core/emscripten.type';
import type { CoreCrash } from '../src/renderer/core/game-core.type';
import { createGameCore } from '../src/renderer/core/create-game-core';
import { watchCoreCrash } from '../src/renderer/core/watch-core-crash';
import { createSaveSlots } from '../src/renderer/saves/create-save-slots';
import { createSramSync } from '../src/renderer/saves/create-sram-sync';
import { createLiveSettings } from '../src/renderer/settings/create-live-settings';
import { createSaveStore } from '../src/saves/create-save-store';
import { decodeSaveSlot } from '../src/saves/decode-save-slot';
import { fakeCore } from './fakes/fake-core';
import { memoryFiles } from './fakes/memory-files';
import { testPort } from './fakes/test-port';

const EMPTY_WASM = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
const crashEvent = (): ErrorEvent => new ErrorEvent('error', { error: new WebAssembly.RuntimeError('unreachable'), cancelable: true });
const fakeModule = (): EmscriptenModule => ({
  FS: { writeFile: () => undefined, readFile: () => new Uint8Array(0), mkdir: () => undefined, unlink: () => undefined, analyzePath: () => ({ exists: false }) },
  HEAPU8: new Uint8Array(0),
  ccall: () => 0,
});

const fakeFactory = (onModule: (module: WebAssembly.Module) => void) => (config: EmscriptenConfig): Promise<EmscriptenModule> =>
  new Promise((resolve) => {
    config.instantiateWasm({}, (_instance, module) => {
      onModule(module);
      resolve(fakeModule());
    });
  });

const calls = (log: string[]): CoreCalls => ({ call: (name, ...args) => { log.push(`${name}(${args.join(',')})`); }, number: () => 0, has: () => true, heap: () => new Uint8Array(0) });

afterEach(() => {
  vi.useRealTimers();
  Reflect.deleteProperty(globalThis, 'TestCore');
});

describe('watchCoreCrash', () => {
  it('ignores crashes before the arm delay and reports the first one after it', () => {
    vi.useFakeTimers();
    const seen: CoreCrash[] = [];
    const stop = watchCoreCrash((crash) => seen.push(crash), 1000);
    const early = crashEvent();
    window.dispatchEvent(early);
    expect(early.defaultPrevented).toBe(true);
    expect(seen).toHaveLength(0);
    vi.advanceTimersByTime(1000);
    window.dispatchEvent(crashEvent());
    window.dispatchEvent(crashEvent());
    expect(seen.map((crash) => crash.message)).toEqual(['The core crashed: unreachable']);
    stop();
  });
});

describe('createGameCore options', () => {
  it('boots from a precompiled module and hands a crash to onCrash', async () => {
    const compiled = await WebAssembly.compile(EMPTY_WASM);
    let given: WebAssembly.Module | null = null;
    Reflect.set(globalThis, 'TestCore', fakeFactory((module) => { given = module; }));
    const onCrash = vi.fn();
    const port = { ...testPort({ extensions: ['.sfc'], known: {} }), core: { ...testPort({ extensions: [], known: {} }).core, factory: 'TestCore' } };
    const core = createGameCore(port, { precompiled: () => compiled, onCrash });
    await core.initHeadless({ assets: new Uint8Array(0) });
    expect(core.state().status).toBe('running');
    expect(given).toBe(compiled);
    window.dispatchEvent(crashEvent());
    expect(core.state()).toEqual({ status: 'error', error: 'The core crashed: unreachable' });
    expect(onCrash).toHaveBeenCalledOnce();
    core.stop();
  });
});

describe('parts without createGameCore', () => {
  it('pushes live settings through plain calls', () => {
    const log: string[] = [];
    const settings = createLiveSettings<{ volume: number }>({ calls: () => calls(log), apply: (value, core) => core.call('SetVolume', value.volume) });
    expect(settings.push({ volume: 3 })).toBe(true);
    expect(settings.reassert()).toBe(true);
    expect(log).toEqual(['SetVolume(3)', 'SetVolume(3)']);
  });

  it('syncs SRAM from a reader', async () => {
    const { files, disk } = memoryFiles();
    let sram = new Uint8Array([1, 2]);
    const sync = createSramSync({ read: () => sram, store: createSaveStore(files).sram, profileId: 'p1' });
    expect(await sync.flush()).toBe(true);
    expect(await sync.flush()).toBe(false);
    sram = new Uint8Array([3]);
    expect(await sync.flush()).toBe(true);
    expect(Array.from(disk.get('profiles/p1/saves/sram.dat') ?? [])).toEqual([3]);
  });
});

describe('save transform hooks', () => {
  it('transforms the state on save and on load', async () => {
    const { core, loaded } = fakeCore(testPort({ extensions: ['.sfc'], known: {} }), new Uint8Array([5, 5]));
    const { files, disk } = memoryFiles();
    const kinds: string[] = [];
    const saves = createSaveSlots({
      core, store: createSaveStore(files), profileId: 'p1',
      transform: {
        save: (state, kind) => { kinds.push(kind); return Promise.resolve(new Uint8Array([...state, 9])); },
        load: (state) => state.subarray(0, state.length - 1),
      },
    });
    await saves.save({ kind: 'quick', slot: 1 });
    await saves.saveNamed('auto', 'Timer');
    const decoded = decodeSaveSlot(disk.get('profiles/p1/saves/quick/save1.sav') ?? new Uint8Array(0), 'demo');
    expect(decoded.ok && Array.from(decoded.record.state)).toEqual([5, 5, 9]);
    expect(kinds).toEqual(['quick', 'auto']);
    expect(await saves.load({ kind: 'quick', slot: 1 })).toBe(true);
    expect(Array.from(loaded[0] ?? [])).toEqual([5, 5]);
  });
});

/* @layer core @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CoreCalls } from '../src/port/port-definition.type';
import type { EmscriptenConfig, EmscriptenModule } from '../src/renderer/core/emscripten.type';
import type { CoreCrash, CoreState } from '../src/renderer/core/game-core.type';
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

describe('a crash watch armed at start', () => {
  const crashingFactory = (crashWhileBooting: boolean) => (): Promise<EmscriptenModule> => {
    if (crashWhileBooting) window.dispatchEvent(crashEvent());
    return Promise.resolve(fakeModule());
  };
  const portOf = () => ({ ...testPort({ extensions: ['.sfc'], known: {} }), core: { ...testPort({ extensions: [], known: {} }).core, factory: 'TestCore' } });

  it('catches a crash while the core boots and never reports it running', async () => {
    const compiled = await WebAssembly.compile(EMPTY_WASM);
    Reflect.set(globalThis, 'TestCore', crashingFactory(true));
    const onCrash = vi.fn();
    const core = createGameCore(portOf(), { precompiled: compiled, watchCrashFrom: 'start', onCrash });
    await core.initHeadless({ assets: new Uint8Array(0) });
    expect(core.state()).toEqual({ status: 'error', error: 'The core crashed: unreachable' });
    expect(core.module()).toBeNull();
    expect(onCrash).toHaveBeenCalledOnce();
    core.stop();
  });

  it('leaves a crash while booting to the default watch, which arms once the core runs', async () => {
    const compiled = await WebAssembly.compile(EMPTY_WASM);
    Reflect.set(globalThis, 'TestCore', crashingFactory(true));
    const onCrash = vi.fn();
    const core = createGameCore(portOf(), { precompiled: compiled, onCrash });
    await core.initHeadless({ assets: new Uint8Array(0) });
    expect(core.state().status).toBe('running');
    expect(onCrash).not.toHaveBeenCalled();
    window.dispatchEvent(crashEvent());
    expect(onCrash).toHaveBeenCalledOnce();
    core.stop();
  });

  it('arms again on the next start after a crash', async () => {
    const compiled = await WebAssembly.compile(EMPTY_WASM);
    Reflect.set(globalThis, 'TestCore', crashingFactory(false));
    const onCrash = vi.fn();
    const core = createGameCore(portOf(), { precompiled: compiled, watchCrashFrom: 'start', onCrash });
    await core.initHeadless({ assets: new Uint8Array(0) });
    window.dispatchEvent(crashEvent());
    await core.initHeadless({ assets: new Uint8Array(0) });
    expect(core.state().status).toBe('running');
    window.dispatchEvent(crashEvent());
    expect(onCrash).toHaveBeenCalledTimes(2);
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

  it('delivers settings pushed before the core runs once it runs, and again after each restart', () => {
    const log: string[] = [];
    const listeners: ((state: CoreState) => void)[] = [];
    let live: CoreCalls | null = null;
    const emit = (status: CoreState['status']): void => {
      live = status === 'running' || status === 'paused' ? calls(log) : null;
      for (const listener of listeners) listener({ status, error: null });
    };
    const settings = createLiveSettings<{ volume: number }>({
      calls: () => live,
      apply: (value, core) => core.call('SetVolume', value.volume),
      subscribe: (listener) => { listeners.push(listener); return () => { listeners.splice(listeners.indexOf(listener), 1); }; },
    });
    expect(settings.push({ volume: 2 })).toBe(false);
    emit('loading');
    emit('running');
    emit('paused');
    emit('running');
    expect(log).toEqual(['SetVolume(2)']);
    emit('idle');
    emit('running');
    expect(log).toEqual(['SetVolume(2)', 'SetVolume(2)']);
    settings.dispose();
    emit('idle');
    emit('running');
    expect(log).toHaveLength(2);
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

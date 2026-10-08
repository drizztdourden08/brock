/* @layer core @kind test */
import type { CoreCalls, PortDefinition } from '../../src/port/port-definition.type';
import type { EmscriptenFS } from '../../src/renderer/core/emscripten.type';
import type { GameCore } from '../../src/renderer/core/game-core.type';

const SCRATCH = '/saves/save98.sav';

const fakeCore = (definition: PortDefinition, saved: Uint8Array): { core: GameCore; loaded: Uint8Array[] } => {
  const disk = new Map<string, Uint8Array>();
  const loaded: Uint8Array[] = [];
  const fs: EmscriptenFS = {
    writeFile: (path, data) => void disk.set(path, typeof data === 'string' ? new TextEncoder().encode(data) : data),
    readFile: (path) => disk.get(path) ?? new Uint8Array(0),
    mkdir: () => undefined,
    unlink: (path) => void disk.delete(path),
    analyzePath: (path) => ({ exists: disk.has(path) }),
  };
  const call = (name: string): void => {
    if (name === definition.core.exports.saveState) disk.set(SCRATCH, saved);
    if (name === definition.core.exports.loadState) loaded.push(disk.get(SCRATCH) ?? new Uint8Array(0));
  };
  const calls: CoreCalls = { call, number: () => 0, has: () => true, heap: () => new Uint8Array(0) };
  const core: GameCore = {
    definition,
    start: () => Promise.resolve(),
    initHeadless: () => Promise.resolve(),
    stop: () => undefined,
    setPaused: () => undefined,
    reset: () => undefined,
    calls: () => calls,
    fs: () => fs,
    module: () => null,
    state: () => ({ status: 'running', error: null }),
    subscribe: () => () => undefined,
  };
  return { core, loaded };
};

export { fakeCore };

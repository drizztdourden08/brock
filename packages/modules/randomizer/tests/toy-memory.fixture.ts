/* @layer core @kind test */
import type { MemoryBridge } from '../src/memory/memory-bridge.type';
import type { MemoryView } from '../src/memory/memory-view.type';

type ToyMemory = {
  bridge: MemoryBridge;
  poke: (region: string, offset: number, value: number) => void;
  clear: () => void;
  loadState: () => void;
  stateLoadListeners: () => number;
};

const toyMemory = (): ToyMemory => {
  const regions = new Map<string, Map<number, number>>();
  const listeners = new Set<() => void>();
  const byte = (region: string, offset: number): number => regions.get(region)?.get(offset) ?? 0;
  const view: MemoryView = {
    byte,
    word: (region, offset) => byte(region, offset) | (byte(region, offset + 1) << 8),
  };
  return {
    bridge: {
      view: () => view,
      onStateLoaded: (cb) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
    },
    poke: (region, offset, value) => {
      const cells = regions.get(region) ?? new Map<number, number>();
      cells.set(offset, value);
      regions.set(region, cells);
    },
    clear: () => regions.clear(),
    loadState: () => listeners.forEach((cb) => cb()),
    stateLoadListeners: () => listeners.size,
  };
};

export { toyMemory };
export type { ToyMemory };

/* @layer electron-main @kind test */
import { afterEach, beforeEach, vi } from 'vitest';
import type { FakeWindow } from './fake-electron';
import { closeScene } from './scene';
import type { Rect } from './window-sim.type';

const HOUR_MS = 3_600_000;

const box = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });

const simLifecycle = (seed: number): { track: (opened: FakeWindow[]) => void } => {
  let windows: FakeWindow[] = [];
  let clock = seed;
  beforeEach(() => {
    clock += HOUR_MS;
    vi.useFakeTimers({ now: clock });
  });
  afterEach(() => {
    closeScene(windows);
    windows = [];
    vi.useRealTimers();
  });
  return {
    track: (opened) => {
      windows = opened;
    },
  };
};

export { box, simLifecycle };

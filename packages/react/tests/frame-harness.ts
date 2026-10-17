/* @layer renderer-shell @kind test */
import { vi } from 'vitest';

const frames: (() => void)[] = [];

const microtasks = async (): Promise<void> => {
  for (let i = 0; i < 10; i += 1) await Promise.resolve();
};

const runFrames = async (count: number): Promise<void> => {
  for (let i = 0; i < count; i += 1) {
    await microtasks();
    for (const fn of frames.splice(0)) fn();
    await microtasks();
  }
};

const stubFrames = (): void => {
  frames.length = 0;
  vi.stubGlobal('requestAnimationFrame', (fn: () => void) => { frames.push(fn); return frames.length; });
};

const frameHarness = { microtasks, runFrames, stubFrames };

export { frameHarness };

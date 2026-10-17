/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { lazyLoads } from '../src/lazy/lazy-loads';
import { holdScreenshot } from '../src/screenshot/hold-screenshot';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('holdScreenshot', () => {
  it('tells main how many holds are open, and a release counts once', () => {
    const sent: number[] = [];
    vi.stubGlobal('window', { api: { captureHolds: (count: number) => { sent.push(count); } } });
    const releaseCore = holdScreenshot();
    const releaseFrame = holdScreenshot();
    releaseFrame();
    releaseFrame();
    releaseCore();
    expect(sent).toEqual([1, 2, 1, 0]);
  });

  it('holds while a lazy load is pending, until the load settles and a frame has painted', async () => {
    const sent: number[] = [];
    const frames: (() => void)[] = [];
    vi.stubGlobal('window', { api: { captureHolds: (count: number) => { sent.push(count); } } });
    vi.stubGlobal('requestAnimationFrame', (fn: () => void) => { frames.push(fn); return frames.length; });
    let finish: () => void = () => undefined;
    void lazyLoads.track(new Promise<void>((resolve) => { finish = resolve; }));
    expect(sent).toEqual([1]);
    finish();
    await Promise.resolve();
    await Promise.resolve();
    expect(sent).toEqual([1]);
    for (let i = 0; i < 2; i += 1) {
      frames.shift()?.();
      await Promise.resolve();
      await Promise.resolve();
    }
    expect(sent).toEqual([1, 0]);
  });

  it('does nothing outside a host with window.api', () => {
    vi.stubGlobal('window', {});
    expect(() => { holdScreenshot()(); }).not.toThrow();
  });
});

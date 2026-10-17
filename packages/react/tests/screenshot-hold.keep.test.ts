/* @layer renderer-shell @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { frameHarness } from './frame-harness';

const host = { sent: [] as number[] };
const { runFrames } = frameHarness;

const fresh = async () => {
  vi.resetModules();
  const { holdScreenshot } = await import('../src/screenshot/hold-screenshot');
  const { lazyLoads } = await import('../src/lazy/lazy-loads');
  return { holdScreenshot, lazyLoads };
};

beforeEach(() => {
  host.sent.length = 0;
  vi.stubGlobal('window', { api: { captureHolds: (count: number) => { host.sent.push(count); } } });
  frameHarness.stubFrames();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('holdScreenshot', () => {
  it('tells main how many holds are open, a release counts once, and 0 goes out once two frames passed with no hold', async () => {
    const { holdScreenshot } = await fresh();
    const releaseCore = holdScreenshot();
    const releaseFrame = holdScreenshot();
    releaseFrame();
    releaseFrame();
    releaseCore();
    expect(host.sent).toEqual([1, 2, 1]);
    await runFrames(1);
    expect(host.sent).toEqual([1, 2, 1]);
    await runFrames(1);
    expect(host.sent).toEqual([1, 2, 1, 0]);
  });

  it('a hold that appears in the frame after the count hits 0 keeps main waiting until it is released too', async () => {
    const { holdScreenshot } = await fresh();
    holdScreenshot()();
    await runFrames(1);
    const late = holdScreenshot();
    await runFrames(4);
    expect(host.sent).toEqual([1, 1]);
    late();
    await runFrames(2);
    expect(host.sent).toEqual([1, 1, 0]);
  });

  it('holds while a lazy load is pending, until the load settles and frames have painted', async () => {
    const { lazyLoads } = await fresh();
    let finish: () => void = () => undefined;
    void lazyLoads.track(new Promise<void>((resolve) => { finish = resolve; }));
    expect(host.sent).toEqual([1]);
    await runFrames(3);
    expect(host.sent).toEqual([1]);
    finish();
    await runFrames(3);
    expect(host.sent).toEqual([1]);
    await runFrames(1);
    expect(host.sent).toEqual([1, 0]);
  });

  it('keeps holding while an image on the page is still loading, then reports 0', async () => {
    const img = Object.assign(new EventTarget(), { complete: false, loading: 'eager', getAnimations: () => [] });
    vi.stubGlobal('document', { querySelectorAll: () => [img] });
    const { holdScreenshot } = await fresh();
    holdScreenshot()();
    await runFrames(6);
    expect(host.sent).toEqual([1, 1]);
    img.complete = true;
    img.dispatchEvent(new Event('load'));
    await runFrames(6);
    expect(host.sent).toEqual([1, 1, 0]);
  });

  it('does nothing outside a host with window.api', async () => {
    vi.stubGlobal('window', {});
    const { holdScreenshot } = await fresh();
    holdScreenshot()();
    await runFrames(2);
    expect(host.sent).toEqual([]);
  });
});

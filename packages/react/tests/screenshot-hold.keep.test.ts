/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('does nothing outside a host with window.api', () => {
    vi.stubGlobal('window', {});
    expect(() => { holdScreenshot()(); }).not.toThrow();
  });
});

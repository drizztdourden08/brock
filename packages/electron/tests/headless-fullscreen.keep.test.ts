/* @layer electron-main @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { headlessFullscreen } from '../src/main/window/headless-fullscreen';
import { widgetRuntime } from '../src/main/widgets/widget-runtime';

vi.mock('electron', () => {
  const display = { bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };
  return { screen: { getPrimaryDisplay: () => display, getAllDisplays: () => [display] } };
});

const fakeWindow = () => {
  const state = { bounds: { x: 100, y: 80, width: 1280, height: 720 }, told: [] as boolean[] };
  const win = {
    getBounds: () => state.bounds,
    setBounds: (next: typeof state.bounds) => { state.bounds = next; },
  };
  const tell = (on: boolean): void => { state.told.push(on); };
  return { win, state, tell };
};

afterEach(() => {
  widgetRuntime.headless = false;
});

describe('full screen in a headless run', () => {
  it('fills the display size off screen, tells the renderer, and puts the window back', () => {
    widgetRuntime.headless = true;
    const { win, state, tell } = fakeWindow();
    expect(headlessFullscreen.applies()).toBe(true);
    headlessFullscreen.set(win, true, tell);
    expect(headlessFullscreen.is(win)).toBe(true);
    expect(state.bounds).toMatchObject({ width: 1920, height: 1080, x: 2320 });
    headlessFullscreen.set(win, true, tell);
    headlessFullscreen.set(win, false, tell);
    expect(state.bounds).toEqual({ x: 100, y: 80, width: 1280, height: 720 });
    expect(state.told).toEqual([true, false]);
  });

  it('does not apply to a visible run', () => {
    expect(headlessFullscreen.applies()).toBe(false);
  });
});

/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { pageKindOf } from '../src/testing/page-kind.mjs';
import { readDockLayout } from '../src/testing/read-dock-layout.mjs';
import { waitForAppPage } from '../src/testing/wait-for-app-page.mjs';
import { widgetWindows } from '../src/testing/widget-windows.mjs';

const page = (url) => ({ url: () => url });

const appWith = (frames) => {
  let call = 0;
  return { windows: () => frames[Math.min(call++, frames.length - 1)] };
};

const browserWindow = ({ url, bounds = { x: 0, y: 0, width: 300, height: 200 }, destroyed = false }) => ({
  isDestroyed: () => destroyed,
  webContents: { getURL: () => url },
  getBounds: () => bounds,
  isVisible: () => true,
  isFocused: () => false,
  isMinimized: () => false,
  isAlwaysOnTop: () => false,
});

describe('pageKindOf', () => {
  it('tells the splash, a widget window and the app window apart', () => {
    expect(pageKindOf('file:///C:/app/dist/renderer/splash.html?v=1.0.0')).toBe('splash');
    expect(pageKindOf('file:///C:/app/dist/renderer/index.html?widget=logs')).toBe('widget');
    expect(pageKindOf('file:///C:/app/dist/renderer/index.html')).toBe('app');
    expect(pageKindOf('http://localhost:20000/')).toBe('app');
  });

  it('has no kind for a window with no page yet', () => {
    expect(pageKindOf('about:blank')).toBeNull();
    expect(pageKindOf('')).toBeNull();
  });
});

describe('waitForAppPage', () => {
  it('skips the splash and waits until it closes', async () => {
    const splash = page('file:///a/renderer/splash.html');
    const index = page('file:///a/renderer/index.html');
    const app = appWith([[splash], [splash, index], [index]]);
    expect(await waitForAppPage(app, 5000)).toBe(index);
  });

  it('never returns a widget window', async () => {
    const widget = page('file:///a/renderer/index.html?widget=logs');
    const index = page('file:///a/renderer/index.html');
    expect(await waitForAppPage(appWith([[widget], [widget, index]]), 5000)).toBe(index);
  });

  it('says the boot never finished while the splash stays open', async () => {
    const app = appWith([[page('file:///a/renderer/splash.html'), page('file:///a/renderer/index.html')]]);
    await expect(waitForAppPage(app, 50)).rejects.toThrow(/splash is still open/);
  });
});

describe('widgetWindows', () => {
  it('lists the popped widget windows from main, sorted by id, and skips the app and splash', async () => {
    const windows = [
      browserWindow({ url: 'file:///a/renderer/index.html' }),
      browserWindow({ url: 'file:///a/renderer/index.html?widget=performance', bounds: { x: 10, y: 20, width: 320, height: 760 } }),
      browserWindow({ url: 'file:///a/renderer/splash.html' }),
      browserWindow({ url: 'file:///a/renderer/index.html?widget=logs' }),
      browserWindow({ url: 'file:///a/renderer/index.html?widget=gone', destroyed: true }),
    ];
    const app = { evaluate: async (fn, arg) => fn({ BrowserWindow: { getAllWindows: () => windows } }, arg) };
    const read = await widgetWindows(app);
    expect(read.map((entry) => entry.id)).toEqual(['logs', 'performance']);
    expect(read[1]).toEqual({ id: 'performance', bounds: { x: 10, y: 20, width: 320, height: 760 }, visible: true, focused: false, minimized: false, alwaysOnTop: false });
  });
});

describe('readDockLayout', () => {
  it('reads the layout through the reader the renderer exposes', async () => {
    const reading = { layout: { v: 2 }, docked: ['logs'], floating: [], popped: [], main: null, rects: {} };
    const fake = { waitForFunction: async () => undefined, evaluate: async () => reading };
    expect(await readDockLayout(fake)).toBe(reading);
  });

  it('explains a page with no reader', async () => {
    const fake = { waitForFunction: async () => { throw new Error('timeout'); }, evaluate: async () => null };
    await expect(readDockLayout(fake, { timeoutMs: 10 })).rejects.toThrow(/automation launch/);
  });
});

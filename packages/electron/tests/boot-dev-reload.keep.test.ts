/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachAppWindow } from '../src/main/boot/attach-app-window';
import { bootState } from '../src/main/boot/boot-state';
import { SILENT_RELOAD_MS } from '../src/main/boot/reveal.constants';
import { devServerUrl } from '../src/main/window/dev-server-url';
import { FakeWindow, resetSim } from './window-sim/fake-electron';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);
vi.mock('../src/main/crash-forensics/note', () => ({ note: (): void => undefined }));
vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: vi.fn() }));

const boot = (): FakeWindow => {
  const app = new FakeWindow({ title: 'app', show: false });
  Object.assign(bootState, {
    splash: null, main: null, renderer: null, mainDone: true, rendererReady: false, failure: null, revealing: false, revealed: false,
    watchdog: null, watchdogMs: 100_000, holds: [], shownFraction: 0, present: null,
  });
  attachAppWindow(app as never, () => app.show());
  return app;
};

const reloads = (app: FakeWindow): ReturnType<typeof vi.fn> => vi.spyOn(app.webContents, 'reload').mockImplementation(() => undefined);

beforeEach(() => {
  vi.useFakeTimers();
  vi.mocked(devServerUrl).mockReturnValue('http://localhost:5173');
});

afterEach(() => {
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  resetSim();
  vi.useRealTimers();
});

describe('K1 reload of a silent dev window', { tags: ['critical'] }, () => {
  it('reloads once in development when the page loaded and no boot progress came', async () => {
    const app = boot();
    const reload = reloads(app);
    app.webContents.emit('did-finish-load');
    await vi.advanceTimersByTimeAsync(SILENT_RELOAD_MS);
    expect(reload).toHaveBeenCalledTimes(1);
    app.webContents.emit('did-finish-load');
    await vi.advanceTimersByTimeAsync(SILENT_RELOAD_MS);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does not reload when boot progress arrived', async () => {
    const app = boot();
    const reload = reloads(app);
    app.webContents.emit('did-finish-load');
    bootState.renderer = { done: 1, total: 3, label: 'Loading', detail: null };
    await vi.advanceTimersByTimeAsync(SILENT_RELOAD_MS);
    expect(reload).not.toHaveBeenCalled();
  });

  it('does not reload a packaged app', async () => {
    vi.mocked(devServerUrl).mockReturnValue(null);
    const app = boot();
    const reload = reloads(app);
    app.webContents.emit('did-finish-load');
    await vi.advanceTimersByTimeAsync(SILENT_RELOAD_MS);
    expect(reload).not.toHaveBeenCalled();
  });
});

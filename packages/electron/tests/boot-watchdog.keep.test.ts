/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MainContext } from '../src/main/types/main-context.type';
import { attachAppWindow } from '../src/main/boot/attach-app-window';
import { bootEvents } from '../src/main/boot/boot-events';
import { bootState } from '../src/main/boot/boot-state';
import { bootHandlers } from '../src/main/boot/ipc-handlers';
import { DEV_WATCHDOG_MS, WATCHDOG_ENV, WATCHDOG_MS } from '../src/main/boot/reveal.constants';
import { watchdogMsOf } from '../src/main/boot/watchdog-ms';
import { SPLASH_CHANNELS } from '../src/splash-preload/splash-channels.constants';
import { FakeWindow, resetSim } from './window-sim/fake-electron';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);
vi.mock('../src/main/crash-forensics/note', () => ({ note: (): void => undefined }));

const WATCHDOG = 1000;

type Listener = (event: unknown, payload?: unknown) => void;

const handlers = new Map<string, Listener>();
const on = ((channel: string, listener: Listener) => { handlers.set(channel, listener); }) as MainContext['on'];
bootHandlers.register({ on } as Partial<MainContext> as MainContext);
const send = (channel: string, payload?: unknown): void => handlers.get(channel)?.({}, payload);

const splashChannels = (splash: FakeWindow): string[] => splash.webContents.sent.map((entry) => entry.channel);

const boot = (): { app: FakeWindow; splash: FakeWindow } => {
  const splash = new FakeWindow({ title: 'splash' });
  Object.assign(splash.webContents, { isLoading: () => false });
  const app = new FakeWindow({ title: 'app', show: false });
  Object.assign(bootState, {
    splash, main: null, renderer: null, mainDone: true, rendererReady: false, failure: null, revealing: false, revealed: false,
    watchdog: null, watchdogMs: WATCHDOG, holds: [], shownFraction: 0, present: null,
  });
  attachAppWindow(app as never, () => app.show());
  return { app, splash };
};

beforeEach(() => { vi.useFakeTimers(); });

afterEach(() => {
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  resetSim();
  vi.useRealTimers();
});

describe('the boot watchdog', () => {
  it('lets a late boot:ready clear its failure, hide the failure screen and reveal the app', async () => {
    const { app, splash } = boot();
    await vi.advanceTimersByTimeAsync(WATCHDOG);
    expect(bootState.failure).toMatchObject({ task: 'interface', timedOut: true, watchdog: true });
    expect(splashChannels(splash).at(-1)).toBe(SPLASH_CHANNELS.failure);

    send('boot:ready');
    expect(bootState.failure).toBeNull();
    expect(splashChannels(splash).at(-1)).toBe(SPLASH_CHANNELS.progress);
    await vi.advanceTimersByTimeAsync(1000);
    expect(bootState.revealed).toBe(true);
    expect(app.isVisible()).toBe(true);
    expect(splash.isDestroyed()).toBe(true);
  });

  it('announces boot activity for renderer progress and for the page loading, so the review start limit follows the boot', () => {
    const { app } = boot();
    const seen = vi.fn();
    bootEvents.on('activity', seen);
    send('boot:progress', { done: 1, total: 3, label: 'Loading settings', detail: null });
    const afterProgress = seen.mock.calls.length;
    expect(afterProgress).toBeGreaterThan(0);
    app.webContents.emit('did-finish-load');
    expect(seen.mock.calls.length).toBeGreaterThan(afterProgress);
    bootEvents.off('activity', seen);
  });

  it('takes boot progress after it fired as a sign of life and goes back to the progress', async () => {
    const { splash } = boot();
    await vi.advanceTimersByTimeAsync(WATCHDOG);
    send('boot:progress', { done: 1, total: 3, label: 'Loading settings', detail: null });
    expect(bootState.failure).toBeNull();
    expect(splashChannels(splash).at(-1)).toBe(SPLASH_CHANNELS.progress);
    await vi.advanceTimersByTimeAsync(WATCHDOG - 1);
    expect(bootState.failure).toBeNull();
  });

  it('counts did-finish-load and boot progress as heartbeats, so a slow but live interface is never declared dead', async () => {
    const { app } = boot();
    await vi.advanceTimersByTimeAsync(WATCHDOG - 100);
    app.webContents.emit('did-finish-load');
    await vi.advanceTimersByTimeAsync(WATCHDOG - 100);
    send('boot:progress', { done: 1, total: 2, label: 'Loading', detail: null });
    await vi.advanceTimersByTimeAsync(WATCHDOG - 100);
    expect(bootState.failure).toBeNull();
    await vi.advanceTimersByTimeAsync(100);
    expect(bootState.failure).toMatchObject({ watchdog: true });
  });

  it('keeps a real failure: a failed load is not cleared by a later heartbeat', async () => {
    const { app } = boot();
    app.webContents.emit('did-fail-load', {}, -105, 'NAME_NOT_RESOLVED', 'http://localhost:1/', true);
    app.webContents.emit('did-finish-load');
    send('boot:ready');
    await vi.advanceTimersByTimeAsync(1000);
    expect(bootState.failure?.message).toContain('did not load');
    expect(bootState.revealed).toBe(false);
  });
});

describe('a load error before the interface reports in', () => {
  const consoleError = (app: FakeWindow, message: string, level = 'error'): void => { app.webContents.emit('console-message', { level, message, sourceId: 'x', lineNumber: 1 }); };

  it('stops the boot at once and shows the error on the splash, without waiting for the watchdog', () => {
    const { app, splash } = boot();
    consoleError(app, "Uncaught SyntaxError: The requested module '/@fs/deps/tessera.js' does not provide an export named 'moveToolbarToSide'");
    expect(bootState.failure).toMatchObject({ task: 'interface', timedOut: false });
    expect(bootState.failure?.message).toBe("The interface failed to load: SyntaxError: The requested module '/@fs/deps/tessera.js' does not provide an export named 'moveToolbarToSide'");
    expect(splashChannels(splash).at(-1)).toBe(SPLASH_CHANNELS.failure);
    expect(bootState.watchdog).toBeNull();
  });

  it('counts an unhandled rejection and a failed dynamic import', () => {
    const first = boot();
    consoleError(first.app, 'Uncaught (in promise) TypeError: x is not a function');
    expect(bootState.failure?.message).toBe('The interface failed to load: TypeError: x is not a function');
    const second = boot();
    consoleError(second.app, 'Failed to fetch dynamically imported module: http://localhost:5173/src/screen.tsx');
    expect(bootState.failure?.message).toContain('Failed to fetch dynamically imported module');
  });

  it('keeps a failure that a later heartbeat cannot clear', () => {
    const { app } = boot();
    consoleError(app, 'Uncaught Error: boom');
    send('boot:progress', { done: 1, total: 2, label: 'Loading', detail: null });
    expect(bootState.failure).not.toBeNull();
  });

  it('ignores ordinary console errors, warnings and anything after the interface is ready', () => {
    const { app } = boot();
    consoleError(app, 'Failed to load resource: net::ERR_FAILED');
    consoleError(app, 'Uncaught Error: warned', 'warning');
    expect(bootState.failure).toBeNull();
    send('boot:ready');
    consoleError(app, 'Uncaught Error: late');
    expect(bootState.failure).toBeNull();
  });

  it('still lets the watchdog catch a true hang', async () => {
    boot();
    await vi.advanceTimersByTimeAsync(WATCHDOG);
    expect(bootState.failure).toMatchObject({ watchdog: true });
  });
});

describe('watchdogMsOf', () => {
  it('waits 120 s in development and 8 s packaged by default', () => {
    expect(DEV_WATCHDOG_MS).toBe(120_000);
    expect(watchdogMsOf(true, undefined, {})).toBe(DEV_WATCHDOG_MS);
    expect(watchdogMsOf(false, undefined, {})).toBe(WATCHDOG_MS);
  });

  it('takes product.boot from brock.config for each mode', () => {
    const boot = { devWatchdogMs: 300_000, watchdogMs: 15_000 };
    expect(watchdogMsOf(true, boot, {})).toBe(300_000);
    expect(watchdogMsOf(false, boot, {})).toBe(15_000);
    expect(watchdogMsOf(false, { devWatchdogMs: 300_000 }, {})).toBe(WATCHDOG_MS);
  });

  it('lets the environment override both, and ignores a value that is not a positive whole number', () => {
    expect(watchdogMsOf(true, { devWatchdogMs: 300_000 }, { [WATCHDOG_ENV]: '45000' })).toBe(45_000);
    expect(watchdogMsOf(false, undefined, { [WATCHDOG_ENV]: '45000' })).toBe(45_000);
    for (const bad of ['0', '-5', 'soon', '1.5', '']) expect(watchdogMsOf(true, undefined, { [WATCHDOG_ENV]: bad })).toBe(DEV_WATCHDOG_MS);
  });
});

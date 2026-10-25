/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { MainContext } from '../src/main/types/main-context.type';
import { backgroundMode } from '../src/main/background/background-mode';
import { enterBackground } from '../src/main/background/enter-background';
import { showMainWindow } from '../src/main/background/show-main-window';
import { skipsWindow } from '../src/main/background/skips-window';
import { windowOpener } from '../src/main/background/window-opener';
import { bootState } from '../src/main/boot/boot-state';
import { installAppLifecycle } from '../src/main/bootstrap/app-lifecycle';
import { installOpenSources } from '../src/main/open/install-open-sources';
import { mainWindowRef } from '../src/main/window/main-window-ref';
import { setMainWindow } from '../src/main/window/set-main-window';
import { FakeWindow, resetSim } from './window-sim/fake-electron';

const shared = vi.hoisted(() => ({
  handlers: new Map<string, (...args: unknown[]) => void>(),
  quit: vi.fn(),
  windows: [] as unknown[],
}));

vi.mock('electron', async () => ({
  ...(await import('./window-sim/fake-electron')).fakeElectron,
  app: {
    on: (name: string, handler: (...args: unknown[]) => void) => { shared.handlers.set(name, handler); },
    quit: shared.quit,
    requestSingleInstanceLock: () => true,
    isReady: () => true,
  },
  BrowserWindow: { getAllWindows: () => shared.windows },
}));
vi.mock('../src/main/crash-forensics/note', () => ({ note: (): void => undefined }));
vi.mock('../src/main/logs/append-main-log', () => ({ appendMainLog: (): void => undefined }));

const NO_TARGETS = { schemes: [], extensions: [] };
const flags = createAutomationFlags();
const context = (overrides: Partial<MainContext> = {}): MainContext => ({ flags, log: vi.fn(), tray: { clear: vi.fn() }, ...overrides }) as Partial<MainContext> as MainContext;

const fire = (name: string, ...args: unknown[]): void => shared.handlers.get(name)?.(...args);

const revealedWindow = (): FakeWindow => {
  const win = new FakeWindow({ title: 'app' });
  setMainWindow(win as never);
  Object.assign(bootState, { revealed: true, app: win });
  return win;
};

const opener = vi.fn(() => Promise.resolve());
const realPlatform = process.platform;

beforeEach(() => {
  shared.handlers.clear();
  shared.windows.length = 0;
  shared.quit.mockClear();
  opener.mockClear();
  windowOpener.current = opener;
  backgroundMode.active = false;
  mainWindowRef.current = null;
  Object.assign(bootState, { revealed: false, headless: false, splash: null, app: null });
  Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
});

afterEach(() => {
  Object.defineProperty(process, 'platform', { value: realPlatform, configurable: true });
  windowOpener.current = null;
  resetSim();
});

describe('deciding to skip the window', () => {
  it('skips on a --background launch and creates the window on a normal one', async () => {
    const options = {};
    const background = { ...context(), flags: { ...flags, isBackgroundLaunch: () => true } } as MainContext;
    expect(await skipsWindow(background, options)).toBe(true);
    expect(await skipsWindow(context(), options)).toBe(false);
  });

  it('lets the app hook choose either way, over the flag', async () => {
    const background = { ...context(), flags: { ...flags, isBackgroundLaunch: () => true } } as MainContext;
    expect(await skipsWindow(context(), { beforeWindow: () => 'skip' })).toBe(true);
    expect(await skipsWindow(background, { beforeWindow: () => 'show' })).toBe(false);
    expect(await skipsWindow(context(), { beforeWindow: () => Promise.resolve('skip') })).toBe(true);
  });

  it('skips the window of a named instance started with --background, and not of one started without it', async () => {
    const real = createAutomationFlags();
    const launched = (...argv: string[]): MainContext => ({
      ...context(),
      flags: { ...real, isAutomationLaunch: () => real.isAutomationLaunch(argv), isBackgroundLaunch: () => real.isBackgroundLaunch(argv) },
    });
    expect(await skipsWindow(launched('app', '--instance=mcp', '--background'), {})).toBe(true);
    expect(await skipsWindow(launched('app', '--instance=mcp'), { beforeWindow: () => 'skip' })).toBe(true);
    expect(await skipsWindow(launched('app', '--instance=mcp', '--no-focus'), { beforeWindow: () => 'skip' })).toBe(false);
    expect(await skipsWindow(launched('app', '--instance=mcp', '--background', '--no-focus'), {})).toBe(false);
  });

  it('runs the hook but never skips the window in an automation launch', async () => {
    const hook = vi.fn(() => 'skip' as const);
    const automation = { ...context(), flags: { ...flags, isAutomationLaunch: () => true, isBackgroundLaunch: () => false } } as MainContext;
    expect(await skipsWindow(automation, { beforeWindow: hook })).toBe(false);
    expect(hook).toHaveBeenCalledTimes(1);
    expect(createAutomationFlags().isBackgroundLaunch(['app', '--background', '--no-focus'])).toBe(false);
  });
});

describe('entering background mode', () => {
  it('turns the mode on and drops the splash without closing the app', () => {
    const splash = new FakeWindow({ title: 'splash' });
    splash.on('closed', () => { if (!backgroundMode.active) shared.quit(); });
    bootState.splash = splash as never;
    enterBackground();
    expect(backgroundMode.active).toBe(true);
    expect(splash.isDestroyed()).toBe(true);
    expect(bootState.splash).toBeNull();
    expect(shared.quit).not.toHaveBeenCalled();
  });
});

describe('showing the window on demand', () => {
  it('creates the window when there is none', async () => {
    await showMainWindow();
    expect(opener).toHaveBeenCalledTimes(1);
  });

  it('restores, shows and focuses a window that exists', async () => {
    const win = revealedWindow();
    win.minimize();
    win.hide();
    await showMainWindow();
    expect(win.isMinimized()).toBe(false);
    expect(win.isVisible()).toBe(true);
    expect(win.focusCalls).toBe(1);
    expect(opener).not.toHaveBeenCalled();
  });

  it('leaves a window that is still loading to the reveal', async () => {
    const win = new FakeWindow({ title: 'app', show: false });
    setMainWindow(win as never);
    await showMainWindow();
    expect(win.isVisible()).toBe(false);
    expect(win.focusCalls).toBe(0);
    expect(opener).not.toHaveBeenCalled();
  });
});

describe('the single instance lock', () => {
  const second = (...extra: string[]): void => fire('second-instance', {}, ['app.exe', ...extra], '/work');

  it('shows the window when a normal second launch arrives and there is none', () => {
    installOpenSources(NO_TARGETS, true, flags);
    backgroundMode.active = true;
    second();
    expect(opener).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the second launch is itself a --background launch', () => {
    installOpenSources(NO_TARGETS, true, flags);
    backgroundMode.active = true;
    second('--background');
    expect(opener).not.toHaveBeenCalled();
    const win = revealedWindow();
    second('--background');
    expect(win.focusCalls).toBe(0);
  });

  it('focuses the existing window, and does not create a second one', () => {
    installOpenSources(NO_TARGETS, true, flags);
    const win = revealedWindow();
    second();
    expect(win.focusCalls).toBe(1);
    expect(opener).not.toHaveBeenCalled();
  });

  it('ignores the second launch in a hidden automation run, as before', () => {
    installOpenSources(NO_TARGETS, true, flags);
    const win = revealedWindow();
    bootState.headless = true;
    second();
    expect(win.focusCalls).toBe(0);
    expect(opener).not.toHaveBeenCalled();
  });

  it('does nothing at all before the window exists in a normal launch', () => {
    installOpenSources(NO_TARGETS, true, flags);
    second();
    expect(opener).not.toHaveBeenCalled();
  });
});

describe('the app lifecycle', () => {
  const install = (ctx = context()): { recreate: ReturnType<typeof vi.fn>; ctx: MainContext } => {
    const recreate = vi.fn();
    installAppLifecycle({ ctx, modules: [], recreateWindow: recreate });
    return { recreate, ctx };
  };

  it('quits when the last window closes in a normal launch', () => {
    install();
    fire('window-all-closed');
    expect(shared.quit).toHaveBeenCalledTimes(1);
  });

  it('keeps running with zero windows in background mode', () => {
    install();
    backgroundMode.active = true;
    fire('window-all-closed');
    expect(shared.quit).not.toHaveBeenCalled();
  });

  it('shows the window on activate in background mode, and recreates it otherwise', () => {
    const { recreate } = install();
    backgroundMode.active = true;
    fire('activate');
    expect(opener).toHaveBeenCalledTimes(1);
    expect(recreate).not.toHaveBeenCalled();
    backgroundMode.active = false;
    fire('activate');
    expect(recreate).toHaveBeenCalledTimes(1);
  });

  it('removes the tray when the app quits', () => {
    const { ctx } = install();
    fire('will-quit');
    expect(ctx.tray.clear).toHaveBeenCalledTimes(1);
  });
});

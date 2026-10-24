/* @layer electron-main @kind test */
import { EventEmitter } from 'events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { windowOpener } from '../src/main/background/window-opener';
import { bootState } from '../src/main/boot/boot-state';
import { createWindowControl } from '../src/main/window/create-window-control';
import { keepOffScreen } from '../src/main/window/keep-off-screen';
import { mainWindowRef } from '../src/main/window/main-window-ref';
import { onScreenOverride } from '../src/main/window/on-screen-override';
import { placeHiddenWindow } from '../src/main/window/place-hidden-window';
import { planWindow } from '../src/main/window/plan-window';
import { setMainWindow } from '../src/main/window/set-main-window';
import type { WindowPlan } from '../src/main/window/create-window.type';
import type { WindowState } from '../src/main/window/window-state.type';

const shared = vi.hoisted(() => ({ saved: { width: 900, height: 600, isMaximized: false, isFullscreen: false } }));

const DISPLAY = { bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 } };

vi.mock('electron', () => ({
  screen: {
    getAllDisplays: () => [DISPLAY],
    getDisplayMatching: () => DISPLAY,
    getPrimaryDisplay: () => DISPLAY,
  },
}));
vi.mock('../src/main/window/load-window-state', () => ({ loadWindowState: () => shared.saved }));

class StubWindow extends EventEmitter {
  calls: string[] = [];
  destroyed = false;
  contentBounds = { x: 10, y: 10, width: 900, height: 600 };
  isDestroyed = (): boolean => this.destroyed;
  isVisible = (): boolean => false;
  isMinimized = (): boolean => false;
  isMaximized = (): boolean => false;
  isFullScreen = (): boolean => false;
  isMaximizable = (): boolean => true;
  isFullScreenable = (): boolean => true;
  getContentBounds = (): typeof this.contentBounds => this.contentBounds;
  getBounds = (): typeof this.contentBounds => this.contentBounds;
  setBounds = (): void => { this.calls.push('setBounds'); };
  setContentBounds = (): void => { this.calls.push('setContentBounds'); };
  setContentSize = (): void => { this.calls.push('setContentSize'); };
  center = (): void => { this.calls.push('center'); };
  show = (): void => { this.calls.push('show'); };
  showInactive = (): void => { this.calls.push('showInactive'); };
  maximize = (): void => { this.calls.push('maximize'); };
  setFullScreen = (): void => { this.calls.push('setFullScreen'); };
  destroy = (): void => {
    this.destroyed = true;
    this.emit('closed');
  };
}

const stub = (): StubWindow => new StubWindow();
const asWindow = (win: StubWindow): Parameters<typeof keepOffScreen>[0] => win as never;

const planOf = (headless: boolean, state: Partial<WindowState> = {}): WindowPlan => ({
  headless,
  startup: { windowSize: null, fresh: false },
  saved: { ...shared.saved, ...state },
  title: 'App',
});

const opener = vi.fn(() => Promise.resolve());

beforeEach(() => {
  opener.mockClear();
  windowOpener.current = opener;
  onScreenOverride.forced = false;
  mainWindowRef.current = null;
  Object.assign(bootState, { revealed: true, headless: true, app: null });
});

afterEach(() => {
  windowOpener.current = null;
  onScreenOverride.forced = false;
  mainWindowRef.current = null;
});

describe('an explicit ctx.window.show() on a hidden automation window', () => {
  it('opens a window that is on screen and closes the off screen one', async () => {
    const hidden = stub();
    keepOffScreen(asWindow(hidden));
    setMainWindow(asWindow(hidden));
    const seen: boolean[] = [];
    opener.mockImplementation(() => {
      seen.push(onScreenOverride.forced);
      return Promise.resolve();
    });
    await createWindowControl().show();
    expect(opener).toHaveBeenCalledTimes(1);
    expect(seen).toEqual([true]);
    expect(hidden.destroyed).toBe(true);
    expect(bootState.headless).toBe(false);
  });

  it('plans the new window as a real one, where an automation plan stays headless', () => {
    const headless = { ...createAutomationFlags(), isHeadlessLaunch: () => true };
    const input = { product: { name: 'App', window: { defaultSize: { width: 900, height: 600 } } }, flags: headless, instance: { name: null, profile: null } };
    expect(planWindow(input as never).headless).toBe(true);
    onScreenOverride.forced = true;
    expect(planWindow(input as never).headless).toBe(false);
  });

  it('puts the new window back at its saved bounds', () => {
    const win = stub();
    const present = placeHiddenWindow(asWindow(win), planOf(false, { x: 120, y: 80 }), false);
    expect(win.calls).toEqual(['setContentBounds']);
    present();
    expect(win.calls).toEqual(['setContentBounds', 'show']);
  });

  it('centres the new window on the primary work area when nothing was saved', () => {
    const win = stub();
    placeHiddenWindow(asWindow(win), planOf(false), false)();
    expect(win.calls).toEqual(['setContentSize', 'center', 'show']);
  });

  it('keeps the old window and the override when the new window fails to open', async () => {
    const hidden = stub();
    keepOffScreen(asWindow(hidden));
    setMainWindow(asWindow(hidden));
    opener.mockRejectedValueOnce(new Error('no window'));
    await expect(createWindowControl().show()).rejects.toThrow('no window');
    expect(hidden.destroyed).toBe(false);
    expect(onScreenOverride.forced).toBe(false);
    expect(bootState.headless).toBe(true);
  });
});

describe('automation launches that never call show()', () => {
  it('present a headless window without moving it or showing it natively', () => {
    const win = stub();
    placeHiddenWindow(asWindow(win), planOf(true), false)();
    expect(win.calls).toEqual(['setContentSize', 'showInactive']);
    expect(onScreenOverride.forced).toBe(false);
  });

  it('keep a window logically visible but off screen when internal code calls show()', () => {
    const hidden = stub();
    const kept = keepOffScreen(asWindow(hidden));
    kept.show();
    expect(kept.isVisible()).toBe(true);
    expect(hidden.calls).toEqual([]);
    expect(opener).not.toHaveBeenCalled();
  });

  it('leave a hidden window still loading alone when show() is called', async () => {
    const hidden = stub();
    keepOffScreen(asWindow(hidden));
    setMainWindow(asWindow(hidden));
    bootState.revealed = false;
    await createWindowControl().show();
    expect(opener).not.toHaveBeenCalled();
    expect(hidden.destroyed).toBe(false);
  });
});

describe('show() on a window that was never kept off screen', () => {
  it('takes the ordinary path and opens nothing', async () => {
    const visible = stub();
    Object.assign(visible, { isVisible: (): boolean => false, isMinimized: (): boolean => false, focus: (): void => { visible.calls.push('focus'); } });
    setMainWindow(asWindow(visible));
    await createWindowControl().show();
    expect(visible.calls).toEqual(['show', 'focus']);
    expect(opener).not.toHaveBeenCalled();
    expect(visible.destroyed).toBe(false);
  });
});

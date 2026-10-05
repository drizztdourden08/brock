/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clusterOf } from '../src/main/widgets/cluster-of';
import { modifierState } from '../src/main/widgets/modifier-state';
import { focusSim } from './window-sim/fake-electron';
import type { FakeWindow } from './window-sim/fake-electron';
import { line, moveDrag, resizeDrag } from './window-sim/os-drag';
import { linkOf, openMain, openWidget } from './window-sim/scene';
import { box, simLifecycle } from './window-sim/sim-lifecycle';
import type { Rect } from './window-sim/window-sim.type';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

const platform = Object.getOwnPropertyDescriptor(process, 'platform');

const MAIN = box(700, 150, 800, 600);
const NOTES = box(400, 550, 300, 200);
const LOGS = box(400, 150, 300, 400);

const shifted = (r: Rect, dx: number, dy: number): Rect => box(r.x + dx, r.y + dy, r.width, r.height);

const sim = simLifecycle(2_300_000_000_000);

const cluster = (): { main: FakeWindow; logs: FakeWindow; notes: FakeWindow } => {
  const main = openMain(MAIN);
  const logs = openWidget('logs', LOGS, { link: { to: 'main', edge: 'left' } });
  const notes = openWidget('notes', NOTES, { link: { to: 'logs', edge: 'bottom' } });
  sim.track([main, logs, notes]);
  return { main, logs, notes };
};

const pressCtrl = (win: FakeWindow): void => {
  win.webContents.emit('before-input-event', {}, { type: 'keyDown', key: 'Control', control: true });
};

beforeEach(() => {
  Object.defineProperty(process, 'platform', { value: 'win32' });
});

afterEach(() => {
  if (platform) Object.defineProperty(process, 'platform', platform);
});

describe('a Ctrl release main never sees', () => {
  it('does not leave snapping off once the Ctrl move ends, so the next plain drag moves the cluster', async () => {
    const s = cluster();
    pressCtrl(s.logs);
    expect(modifierState.ctrl).toBe(true);
    await moveDrag(s.logs, line({ dx: -150, dy: -100 }, 10));
    expect(linkOf('logs')).toBeNull();
    expect(modifierState.ctrl).toBe(false);
    await moveDrag(s.main, line({ dx: 40, dy: 20 }, 10));
    expect(s.main.bounds).toEqual(shifted(MAIN, 40, 20));
    expect(s.notes.bounds).toEqual(shifted(NOTES, 40, 20));
    expect(linkOf('notes')).toEqual({ to: 'main', edge: 'left' });
  });

  it('lets the window moved with Ctrl rejoin on its next plain drag', async () => {
    const s = cluster();
    pressCtrl(s.logs);
    await moveDrag(s.logs, line({ dx: -150, dy: -100 }, 10));
    expect(clusterOf('logs')).toEqual(['logs']);
    await moveDrag(s.logs, line({ dx: 145, dy: 0 }, 15));
    expect(s.logs.bounds.x + s.logs.bounds.width).toBe(MAIN.x);
    expect(linkOf('logs')).toEqual({ to: 'main', edge: 'left' });
    await moveDrag(s.main, line({ dx: 30, dy: 0 }, 5));
    expect(s.logs.bounds.x + s.logs.bounds.width).toBe(MAIN.x + 30);
  });

  it('turns snapping back on after a Ctrl resize ends', async () => {
    const s = cluster();
    pressCtrl(s.main);
    await resizeDrag(s.logs, 'left', line({ dx: -40, dy: 0 }, 10));
    expect(s.notes.bounds).toEqual(NOTES);
    expect(modifierState.ctrl).toBe(false);
    await resizeDrag(s.notes, 'left', line({ dx: -30, dy: 0 }, 10));
    expect(s.notes.bounds.x).toBe(s.logs.bounds.x);
  });

  it('forgets Ctrl when every Brock window loses the focus', async () => {
    const s = cluster();
    pressCtrl(s.main);
    focusSim(null);
    s.main.emit('blur');
    await vi.advanceTimersByTimeAsync(50);
    expect(modifierState.ctrl).toBe(false);
  });

  it('keeps Ctrl while the focus moves to another Brock window', async () => {
    const s = cluster();
    pressCtrl(s.main);
    focusSim(s.logs);
    s.main.emit('blur');
    await vi.advanceTimersByTimeAsync(50);
    expect(modifierState.ctrl).toBe(true);
  });

  it('still reads a Ctrl release that does arrive', () => {
    const s = cluster();
    pressCtrl(s.notes);
    s.notes.webContents.emit('input-event', {}, { type: 'mouseMove', modifiers: [] });
    expect(modifierState.ctrl).toBe(false);
  });
});

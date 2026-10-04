/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { clusterOf } from '../src/main/widgets/cluster-of';
import { mainClusterControl } from '../src/main/widgets/main-cluster-control';
import { modifierState } from '../src/main/widgets/modifier-state';
import { line, moveDrag, resizeDrag } from './window-sim/os-drag';
import { linkOf, openMain, openWidget } from './window-sim/scene';
import { box, simLifecycle } from './window-sim/sim-lifecycle';
import type { Rect } from './window-sim/window-sim.type';
import type { FakeWindow } from './window-sim/fake-electron';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

const by = (r: Rect, dx: number, dy: number): Rect => ({ ...r, x: r.x + dx, y: r.y + dy });

const MAIN = box(700, 150, 800, 600);
const LOGS = box(400, 150, 300, 400);
const NOTES = box(400, 550, 300, 200);

interface Scene {
  main: FakeWindow;
  logs: FakeWindow;
  notes: FakeWindow;
  free: FakeWindow;
}

const sim = simLifecycle(2_200_000_000_000);

const cluster = (free: Rect = box(100, 800, 300, 200)): Scene => {
  const main = openMain(MAIN);
  const logs = openWidget('logs', LOGS, { link: { to: 'main', edge: 'left' } });
  const notes = openWidget('notes', NOTES, { link: { to: 'logs', edge: 'bottom' } });
  const loose = openWidget('free', free);
  sim.track([main, logs, notes, loose]);
  return { main, logs, notes, free: loose };
};

const guidesTo = (win: FakeWindow): boolean[] =>
  win.webContents.sent.filter((message) => message.channel === 'widget:guide').map((message) => (message.args[0] as { open: boolean }).open);

describe('moving a snap cluster', () => {
  it('takes every window joined by snap links when one widget moves', async () => {
    const s = cluster();
    expect(clusterOf('notes').sort()).toEqual(['logs', 'main', 'notes']);
    await moveDrag(s.logs, line({ dx: 50, dy: 30 }, 10));
    expect(s.logs.bounds).toEqual(by(LOGS, 50, 30));
    expect(s.main.bounds).toEqual(by(MAIN, 50, 30));
    expect(s.notes.bounds).toEqual(by(NOTES, 50, 30));
    expect(s.free.bounds).toEqual(box(100, 800, 300, 200));
    expect(linkOf('logs')).toEqual({ to: 'main', edge: 'left' });
    expect(linkOf('notes')).toEqual({ to: 'logs', edge: 'bottom' });
  });

  it('takes the widgets with main when main moves', async () => {
    const s = cluster();
    await moveDrag(s.main, line({ dx: -60, dy: 20 }, 10));
    expect(s.main.bounds).toEqual(by(MAIN, -60, 20));
    expect(s.logs.bounds).toEqual(by(LOGS, -60, 20));
    expect(s.notes.bounds).toEqual(by(NOTES, -60, 20));
  });

  it('moves a window with no snap link alone', async () => {
    const s = cluster();
    await moveDrag(s.free, line({ dx: 40, dy: 40 }, 10));
    expect(s.free.bounds).toEqual(box(140, 840, 300, 200));
    expect(s.main.bounds).toEqual(MAIN);
    expect(s.logs.bounds).toEqual(LOGS);
  });

  it('never moves the cluster while a member resizes, only the edges lined up with the dragged one', async () => {
    const s = cluster();
    await resizeDrag(s.logs, 'left', line({ dx: -40, dy: 0 }, 10));
    expect(s.logs.bounds).toEqual(box(360, 150, 340, 400));
    expect(s.main.bounds).toEqual(MAIN);
    expect(s.notes.bounds).toEqual(box(360, 550, 340, 200));
  });
});

describe('Ctrl and joining', () => {
  it('moves one window alone with Ctrl, breaks its links and hands its dependants to a flush window', async () => {
    const s = cluster();
    modifierState.ctrl = true;
    await moveDrag(s.logs, line({ dx: -100, dy: -60 }, 10));
    expect(s.logs.bounds).toEqual(by(LOGS, -100, -60));
    expect(s.main.bounds).toEqual(MAIN);
    expect(s.notes.bounds).toEqual(NOTES);
    expect(linkOf('logs')).toBeNull();
    expect(linkOf('notes')).toEqual({ to: 'main', edge: 'left' });
    expect(clusterOf('logs')).toEqual(['logs']);
  });

  it('lets a window moved with Ctrl snap elsewhere and join that window', async () => {
    const s = cluster(box(20, 150, 300, 200));
    modifierState.ctrl = true;
    await moveDrag(s.logs, line({ dx: -75, dy: -100 }, 15));
    expect(s.logs.bounds).toEqual(box(320, 50, 300, 400));
    expect(s.main.bounds).toEqual(MAIN);
    expect(linkOf('logs')).toEqual({ to: 'free', edge: 'right' });
  });

  it('joins a loose window to the cluster when it is dropped snapped onto a member', async () => {
    const s = cluster();
    await moveDrag(s.free, line({ dx: -5, dy: -600 }, 20));
    expect(s.free.bounds).toEqual(box(100, 200, 300, 200));
    expect(linkOf('free')).toEqual({ to: 'logs', edge: 'left' });
    await moveDrag(s.main, line({ dx: 20, dy: 0 }, 5));
    expect(s.free.bounds).toEqual(box(120, 200, 300, 200));
  });

  it('snaps a moving cluster onto an outside window and takes it in', async () => {
    const s = cluster(box(20, 150, 300, 200));
    await moveDrag(s.logs, line({ dx: -75, dy: 0 }, 15));
    expect(s.logs.bounds).toEqual(box(320, 150, 300, 400));
    expect(s.main.bounds).toEqual(box(620, 150, 800, 600));
    expect(s.notes.bounds).toEqual(box(320, 550, 300, 200));
    expect(linkOf('free')).toEqual({ to: 'logs', edge: 'left' });
    expect(clusterOf('main').sort()).toEqual(['free', 'logs', 'main', 'notes']);
  });
});

describe('the cluster acts as one window', () => {
  it('maximizes every member into the work area and restores them', async () => {
    const s = cluster();
    s.main.emit('maximize');
    await vi.advanceTimersByTimeAsync(50);
    const all = [s.main.bounds, s.logs.bounds, s.notes.bounds];
    expect(Math.min(...all.map((b) => b.x))).toBe(0);
    expect(Math.max(...all.map((b) => b.x + b.width))).toBe(1920);
    expect(Math.max(...all.map((b) => b.y + b.height))).toBe(1040);
    expect(s.logs.bounds.x + s.logs.bounds.width).toBe(s.main.bounds.x);
    expect(s.free.bounds).toEqual(box(100, 800, 300, 200));
    s.main.emit('maximize');
    await vi.advanceTimersByTimeAsync(50);
    expect([s.main.bounds, s.logs.bounds, s.notes.bounds]).toEqual([MAIN, LOGS, NOTES]);
  });

  it('minimizes and restores the cluster with main', async () => {
    const s = cluster();
    expect(mainClusterControl.minimize()).toBe(true);
    expect(s.main.isMinimized()).toBe(true);
    expect([s.logs.isVisible(), s.notes.isVisible(), s.free.isVisible()]).toEqual([false, false, false]);
    s.main.restore();
    await vi.advanceTimersByTimeAsync(50);
    expect([s.logs.isVisible(), s.notes.isVisible()]).toEqual([true, true]);
  });
});

describe('the window guide', () => {
  it('opens in the widget being moved, not in main, and closes there when the move ends', async () => {
    const s = cluster();
    await moveDrag(s.logs, line({ dx: 30, dy: 0 }, 5), { onStep: () => expect(guidesTo(s.logs).at(-1)).toBe(true) });
    expect(guidesTo(s.logs).at(-1)).toBe(false);
    expect(guidesTo(s.main)).toEqual([]);
  });

  it('opens in main when main moves', async () => {
    const s = cluster();
    await moveDrag(s.main, line({ dx: 30, dy: 0 }, 5), { onStep: () => expect(guidesTo(s.main).at(-1)).toBe(true) });
    expect(guidesTo(s.main).at(-1)).toBe(false);
    expect(guidesTo(s.logs)).toEqual([]);
  });
});

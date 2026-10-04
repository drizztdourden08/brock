/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { clusterOf } from '../src/main/widgets/cluster-of';
import { modifierState } from '../src/main/widgets/modifier-state';
import { line, moveDrag, resizeDrag } from './window-sim/os-drag';
import { openMain, openWidget } from './window-sim/scene';
import { box, simLifecycle } from './window-sim/sim-lifecycle';
import type { FakeWindow } from './window-sim/fake-electron';
import type { DragEdge, DragStep, Rect } from './window-sim/window-sim.type';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

const MAIN = box(700, 150, 800, 600);
const NOTES = box(400, 150, 300, 300);
const LOGS = box(400, 450, 300, 300);

const by = (r: Rect, dx: number, dy: number): Rect => ({ ...r, x: r.x + dx, y: r.y + dy });

interface Owner {
  main: FakeWindow;
  notes: FakeWindow;
  logs: FakeWindow;
}

const sim = simLifecycle(2_300_000_000_000);

const owner = (links: Partial<Record<'notes' | 'logs', WidgetWindowOpen>> = {}, extra: Record<string, Rect> = {}): Owner & Record<string, FakeWindow> => {
  const main = openMain(MAIN);
  const notes = openWidget('notes', NOTES, links.notes);
  const logs = openWidget('logs', LOGS, links.logs);
  const more = Object.fromEntries(Object.entries(extra).map(([id, bounds]) => [id, openWidget(id, bounds)]));
  sim.track([main, notes, logs, ...Object.values(more)]);
  return { ...more, main, notes, logs };
};

const pick = (s: Record<string, FakeWindow>, id: string): FakeWindow => {
  const win = s[id];
  if (!win) throw new Error(`no window ${id}`);
  return win;
};

const where = (s: Owner): Rect[] => [s.main.bounds, s.notes.bounds, s.logs.bounds];

interface LockCase {
  name: string;
  drag: keyof Owner;
  edge: DragEdge;
  to: DragStep;
  main: Rect;
  notes: Rect;
  logs: Rect;
}

const LOCKED: LockCase[] = [
  { name: "Logs' left edge takes Notes' left edge", drag: 'logs', edge: 'left', to: { dx: -40, dy: 0 }, main: MAIN, notes: box(360, 150, 340, 300), logs: box(360, 450, 340, 300) },
  { name: "Notes' left edge takes Logs' left edge", drag: 'notes', edge: 'left', to: { dx: 30, dy: 0 }, main: MAIN, notes: box(430, 150, 270, 300), logs: box(430, 450, 270, 300) },
  { name: 'the Notes/Logs seam from Notes resizes both', drag: 'notes', edge: 'bottom', to: { dx: 0, dy: 30 }, main: MAIN, notes: box(400, 150, 300, 330), logs: box(400, 480, 300, 270) },
  { name: 'the Notes/Logs seam from Logs resizes both', drag: 'logs', edge: 'top', to: { dx: 0, dy: -30 }, main: MAIN, notes: box(400, 150, 300, 270), logs: box(400, 420, 300, 330) },
  { name: "Notes' right edge takes main's left edge and Logs' right edge", drag: 'notes', edge: 'right', to: { dx: 40, dy: 0 }, main: box(740, 150, 760, 600), notes: box(400, 150, 340, 300), logs: box(400, 450, 340, 300) },
  { name: "Logs' right edge takes main's left edge and Notes' right edge", drag: 'logs', edge: 'right', to: { dx: -40, dy: 0 }, main: box(660, 150, 840, 600), notes: box(400, 150, 260, 300), logs: box(400, 450, 260, 300) },
  { name: "main's left edge takes both right edges", drag: 'main', edge: 'left', to: { dx: -40, dy: 0 }, main: box(660, 150, 840, 600), notes: box(400, 150, 260, 300), logs: box(400, 450, 260, 300) },
  { name: "Logs' bottom edge takes main's lined-up bottom edge", drag: 'logs', edge: 'bottom', to: { dx: 0, dy: 40 }, main: box(700, 150, 800, 640), notes: NOTES, logs: box(400, 450, 300, 340) },
  { name: "main's bottom edge takes Logs' lined-up bottom edge", drag: 'main', edge: 'bottom', to: { dx: 0, dy: -40 }, main: box(700, 150, 800, 560), notes: NOTES, logs: box(400, 450, 300, 260) },
  { name: "Notes' top edge takes main's lined-up top edge", drag: 'notes', edge: 'top', to: { dx: 0, dy: -40 }, main: box(700, 110, 800, 640), notes: box(400, 110, 300, 340), logs: LOGS },
];

const START = { main: MAIN, notes: NOTES, logs: LOGS };

const alone = (c: LockCase): Rect[] => (['main', 'notes', 'logs'] as const).map((id) => (id === c.drag ? c[id] : START[id]));

describe("the owner's stack: Notes over Logs, both snapped to main's left edge", () => {
  for (const c of LOCKED) {
    it(`locks the lined-up edges: ${c.name}`, async () => {
      const s = owner();
      await resizeDrag(s[c.drag], c.edge, line(c.to, 20));
      expect(where(s)).toEqual([c.main, c.notes, c.logs]);
    });

    it(`resizes only the dragged window with Ctrl: ${c.name}`, async () => {
      const s = owner();
      modifierState.ctrl = true;
      await resizeDrag(s[c.drag], c.edge, line(c.to, 20));
      expect(where(s)).toEqual(alone(c));
    });
  }

  it('unlocks an edge once Ctrl has moved it off the line', async () => {
    const s = owner();
    modifierState.ctrl = true;
    await resizeDrag(s.logs, 'left', line({ dx: -40, dy: 0 }, 20));
    modifierState.ctrl = false;
    await resizeDrag(s.notes, 'left', line({ dx: -20, dy: 0 }, 10));
    expect(s.notes.bounds).toEqual(box(380, 150, 320, 300));
    expect(s.logs.bounds).toEqual(box(360, 450, 340, 300));
  });

  it('stops the whole line where one window reaches its minimum size', async () => {
    const s = owner();
    s.notes.min = { width: 280, height: 160 };
    await resizeDrag(s.logs, 'left', line({ dx: 60, dy: 0 }, 20));
    expect(s.notes.bounds).toEqual(box(420, 150, 280, 300));
    expect(s.logs.bounds).toEqual(box(420, 450, 280, 300));
  });
});

describe("moving the owner's stack", () => {
  for (const drag of ['main', 'notes', 'logs'] as const) {
    it(`moves all three when ${drag} is dragged`, async () => {
      const s = owner();
      await moveDrag(s[drag], line({ dx: 50, dy: 30 }, 10));
      expect(where(s)).toEqual([by(MAIN, 50, 30), by(NOTES, 50, 30), by(LOGS, 50, 30)]);
    });
  }

  it('moves Logs alone with Ctrl, and afterwards Notes moves with main but without Logs', async () => {
    const s = owner({ notes: { link: { to: 'main', edge: 'left' } }, logs: { link: { to: 'notes', edge: 'bottom' } } });
    modifierState.ctrl = true;
    await moveDrag(s.logs, line({ dx: -200, dy: 150 }, 10));
    modifierState.ctrl = false;
    expect(where(s)).toEqual([MAIN, NOTES, by(LOGS, -200, 150)]);
    await moveDrag(s.notes, line({ dx: 30, dy: 20 }, 10));
    expect(where(s)).toEqual([by(MAIN, 30, 20), by(NOTES, 30, 20), by(LOGS, -200, 150)]);
  });

  it('drops a window out of the cluster when Ctrl is pressed during the drag', async () => {
    const s = owner();
    await moveDrag(s.logs, line({ dx: -200, dy: 150 }, 10), {
      onStep: (index) => {
        if (index === 0) modifierState.ctrl = true;
      },
    });
    modifierState.ctrl = false;
    expect(where(s)).toEqual([MAIN, NOTES, by(LOGS, -200, 150)]);
  });

  it('takes a window snapped corner to corner', async () => {
    const s = owner({}, { corner: box(1500, -10, 300, 160) });
    expect(clusterOf('notes').sort()).toEqual(['corner', 'logs', 'main', 'notes']);
    await moveDrag(s.notes, line({ dx: 20, dy: 40 }, 10));
    expect(pick(s, 'corner').bounds).toEqual(box(1520, 30, 300, 160));
  });

  it('takes a window that touches two others, though a single link cannot name both', async () => {
    const s = owner({ notes: { link: { to: 'main', edge: 'left' } }, logs: { link: { to: 'notes', edge: 'bottom' } } }, { under: box(700, 750, 400, 200) });
    expect(clusterOf('main').sort()).toEqual(['logs', 'main', 'notes', 'under']);
    await moveDrag(s.main, line({ dx: -30, dy: -20 }, 10));
    expect(where(s)).toEqual([by(MAIN, -30, -20), by(NOTES, -30, -20), by(LOGS, -30, -20)]);
    expect(pick(s, 'under').bounds).toEqual(box(670, 730, 400, 200));
  });

  it('takes in a window dropped corner to corner against a member', async () => {
    const s = owner({}, { loose: box(100, 790, 300, 160) });
    await moveDrag(pick(s, 'loose'), line({ dx: 0, dy: -35 }, 10));
    expect(pick(s, 'loose').bounds).toEqual(box(100, 750, 300, 160));
    expect(clusterOf('main').sort()).toEqual(['logs', 'loose', 'main', 'notes']);
    await moveDrag(s.main, line({ dx: 20, dy: 0 }, 5));
    expect(pick(s, 'loose').bounds).toEqual(box(120, 750, 300, 160));
  });
});

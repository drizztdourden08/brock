/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { modifierState } from '../src/main/widgets/modifier-state';
import { line, resizeDrag } from './window-sim/os-drag';
import { closeScene, linkOf, openMain, openWidget } from './window-sim/scene';
import type { FakeWindow } from './window-sim/fake-electron';
import type { DragEdge, DragStep, Rect } from './window-sim/window-sim.type';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

interface DragCase {
  name: string;
  drag: 'logs' | 'main';
  edge: DragEdge;
  to: DragStep;
  logs: Rect;
  main: Rect;
}

const MAIN: Rect = { x: 700, y: 150, width: 800, height: 600 };
const LOGS: Rect = { x: 400, y: 350, width: 300, height: 400 };
const box = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });

const ALONE: DragCase[] = [
  { name: "logs' bottom edge down", drag: 'logs', edge: 'bottom', to: { dx: 0, dy: 40 }, logs: box(400, 350, 300, 440), main: MAIN },
  { name: "logs' bottom edge up", drag: 'logs', edge: 'bottom', to: { dx: 0, dy: -40 }, logs: box(400, 350, 300, 360), main: MAIN },
  { name: "logs' left edge out", drag: 'logs', edge: 'left', to: { dx: -40, dy: 0 }, logs: box(360, 350, 340, 400), main: MAIN },
  { name: "logs' top-left corner", drag: 'logs', edge: 'top-left', to: { dx: -40, dy: -40 }, logs: box(360, 310, 340, 440), main: MAIN },
  { name: "logs' bottom-left corner", drag: 'logs', edge: 'bottom-left', to: { dx: -40, dy: 40 }, logs: box(360, 350, 340, 440), main: MAIN },
  { name: "main's right edge", drag: 'main', edge: 'right', to: { dx: 40, dy: 0 }, logs: LOGS, main: box(700, 150, 840, 600) },
  { name: "main's top edge", drag: 'main', edge: 'top', to: { dx: 0, dy: -40 }, logs: LOGS, main: box(700, 110, 800, 640) },
  { name: "main's bottom edge", drag: 'main', edge: 'bottom', to: { dx: 0, dy: 40 }, logs: LOGS, main: box(700, 150, 800, 640) },
  { name: "main's top-right corner", drag: 'main', edge: 'top-right', to: { dx: 40, dy: -40 }, logs: LOGS, main: box(700, 110, 840, 640) },
  { name: "main's bottom-right corner", drag: 'main', edge: 'bottom-right', to: { dx: 40, dy: 40 }, logs: LOGS, main: box(700, 150, 840, 640) },
];

const SHARED: DragCase[] = [
  { name: "logs' right edge out", drag: 'logs', edge: 'right', to: { dx: 40, dy: 0 }, logs: box(400, 350, 340, 400), main: box(740, 150, 760, 600) },
  { name: "logs' right edge in", drag: 'logs', edge: 'right', to: { dx: -40, dy: 0 }, logs: box(400, 350, 260, 400), main: box(660, 150, 840, 600) },
  { name: "logs' top-right corner", drag: 'logs', edge: 'top-right', to: { dx: 40, dy: -40 }, logs: box(400, 310, 340, 440), main: box(740, 150, 760, 600) },
  { name: "logs' bottom-right corner", drag: 'logs', edge: 'bottom-right', to: { dx: 40, dy: 40 }, logs: box(400, 350, 340, 440), main: box(740, 150, 760, 600) },
  { name: "main's left edge out", drag: 'main', edge: 'left', to: { dx: -40, dy: 0 }, logs: box(400, 350, 260, 400), main: box(660, 150, 840, 600) },
  { name: "main's left edge in", drag: 'main', edge: 'left', to: { dx: 40, dy: 0 }, logs: box(400, 350, 340, 400), main: box(740, 150, 760, 600) },
  { name: "main's top-left corner", drag: 'main', edge: 'top-left', to: { dx: -40, dy: -40 }, logs: box(400, 350, 260, 400), main: box(660, 110, 840, 640) },
  { name: "main's bottom-left corner", drag: 'main', edge: 'bottom-left', to: { dx: -40, dy: 40 }, logs: box(400, 350, 260, 400), main: box(660, 150, 840, 640) },
];

let windows: FakeWindow[] = [];
let clock = 2_000_000_000_000;

const snappedPair = (): { main: FakeWindow; logs: FakeWindow } => {
  const main = openMain(MAIN);
  const logs = openWidget('logs', LOGS, { link: { to: 'main', edge: 'left' } });
  windows = [main, logs];
  return { main, logs };
};

const touching = (pair: { main: FakeWindow; logs: FakeWindow }): boolean => pair.logs.bounds.x + pair.logs.bounds.width === pair.main.bounds.x;

beforeEach(() => {
  clock += 3_600_000;
  vi.useFakeTimers({ now: clock });
});

afterEach(() => {
  closeScene(windows);
  windows = [];
  vi.useRealTimers();
});

describe("a top-edge drag of the logs widget snapped left of main (symptoms 1 and 2)", () => {
  it('keeps touching the main window from the first step', async () => {
    const pair = snappedPair();
    await resizeDrag(pair.logs, 'top', line({ dx: 0, dy: -10 }, 5), {
      onStep: () => {
        expect(touching(pair)).toBe(true);
        expect(pair.main.bounds).toEqual(MAIN);
      },
    });
    expect(pair.logs.bounds).toEqual(box(400, 340, 300, 410));
    expect(pair.main.bounds).toEqual(MAIN);
  });

  it('goes past the top of the main window, snapping on the way, without touching anything else', async () => {
    const { main, logs } = snappedPair();
    let snapped = false;
    await resizeDrag(logs, 'top', line({ dx: 0, dy: -250 }, 125), {
      onStep: () => {
        expect(main.bounds).toEqual(MAIN);
        expect({ x: logs.bounds.x, width: logs.bounds.width, bottom: logs.bounds.y + logs.bounds.height }).toEqual({ x: 400, width: 300, bottom: 750 });
        snapped ||= logs.bounds.y === MAIN.y;
      },
    });
    expect(snapped).toBe(true);
    expect(logs.bounds).toEqual(box(400, 100, 300, 650));
    expect(main.bounds).toEqual(MAIN);
    expect(linkOf('logs')).toEqual({ to: 'main', edge: 'left' });
  });
});

describe('every other edge and corner of the snapped pair (symptom 3), outer edges', () => {
  for (const c of ALONE) {
    it(`resizes only the dragged window: ${c.name}`, async () => {
      const pair = snappedPair();
      const other = c.drag === 'logs' ? pair.main : pair.logs;
      const before = other.getBounds();
      await resizeDrag(pair[c.drag], c.edge, line(c.to, 20), { onStep: () => expect(other.bounds).toEqual(before) });
      expect(pair.logs.bounds).toEqual(c.logs);
      expect(pair.main.bounds).toEqual(c.main);
    });
  }
});

describe('every other edge and corner of the snapped pair (symptom 3), the shared edge', () => {
  for (const c of SHARED) {
    it(`moves the shared edge of both windows together: ${c.name}`, async () => {
      const pair = snappedPair();
      await resizeDrag(pair[c.drag], c.edge, line(c.to, 20), { onStep: () => expect(touching(pair)).toBe(true) });
      expect(pair.logs.bounds).toEqual(c.logs);
      expect(pair.main.bounds).toEqual(c.main);
      expect(linkOf('logs')).toEqual({ to: 'main', edge: 'left' });
    });
  }

  it('stops the shared edge where the dragged window reaches its minimum size', async () => {
    const { main, logs } = snappedPair();
    await resizeDrag(logs, 'right', line({ dx: -100, dy: 0 }, 25));
    expect(logs.bounds).toEqual(box(400, 350, 240, 400));
    expect(main.bounds).toEqual(box(640, 150, 860, 600));
  });
});

describe('Ctrl, release and a third window', () => {
  it('resizes alone, without snapping, while Ctrl is held', async () => {
    const { main, logs } = snappedPair();
    modifierState.ctrl = true;
    await resizeDrag(logs, 'right', line({ dx: 40, dy: 0 }, 20), { onStep: () => expect(main.bounds).toEqual(MAIN) });
    expect(logs.bounds).toEqual(box(400, 350, 340, 400));
    expect(main.bounds).toEqual(MAIN);
    expect(linkOf('logs')).toBeNull();
  });

  it('puts the shared edge back on both windows when Esc cancels the drag', async () => {
    const { main, logs } = snappedPair();
    await resizeDrag(logs, 'right', line({ dx: 40, dy: 0 }, 20), { cancel: true });
    expect(logs.bounds).toEqual(LOGS);
    expect(main.bounds).toEqual(MAIN);
  });

  it('keeps every window where the drag left it once the mouse is released', async () => {
    const { main, logs } = snappedPair();
    await resizeDrag(logs, 'top', line({ dx: 0, dy: -60 }, 30), { stepMs: 50 });
    await resizeDrag(main, 'right', line({ dx: 60, dy: 0 }, 30), { stepMs: 50 });
    expect(logs.bounds).toEqual(box(400, 290, 300, 460));
    expect(main.bounds).toEqual(box(700, 150, 860, 600));
  });

  it('never pulls in a window whose edge only meets the dragged edge mid-drag', async () => {
    const { main, logs } = snappedPair();
    const above = openWidget('above', box(400, 40, 300, 250));
    windows = [main, logs, above];
    await resizeDrag(logs, 'top', line({ dx: 0, dy: -70 }, 35));
    expect(above.bounds).toEqual(box(400, 40, 300, 250));
    expect(logs.bounds).toEqual(box(400, 290, 300, 460));
    expect(main.bounds).toEqual(MAIN);
  });

  it('moves the window stacked under the dragged edge with it', async () => {
    const { main, logs } = snappedPair();
    const below = openWidget('below', box(400, 750, 300, 200), { link: { to: 'logs', edge: 'bottom' } });
    windows = [main, logs, below];
    await resizeDrag(logs, 'bottom', line({ dx: 0, dy: 30 }, 15));
    expect(logs.bounds).toEqual(box(400, 350, 300, 430));
    expect(below.bounds).toEqual(box(400, 780, 300, 170));
    expect(main.bounds).toEqual(MAIN);
  });
});

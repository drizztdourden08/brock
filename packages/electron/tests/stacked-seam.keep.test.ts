/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { line, resizeDrag } from './window-sim/os-drag';
import { openMain, openWidget } from './window-sim/scene';
import { box, simLifecycle } from './window-sim/sim-lifecycle';
import type { FakeWindow } from './window-sim/fake-electron';
import type { Rect } from './window-sim/window-sim.type';

vi.mock('electron', async () => (await import('./window-sim/fake-electron')).fakeElectron);

const MAIN = box(700, 150, 800, 600);
const sim = simLifecycle(2_100_000_000_000);

const open = <K extends string>(scene: Record<K, Rect>): Record<K | 'main', FakeWindow> => {
  const main = openMain(MAIN);
  const opened = Object.fromEntries(Object.entries<Rect>(scene).map(([id, bounds]) => [id, openWidget(id, bounds)])) as Record<K, FakeWindow>;
  sim.track([main, ...Object.values<FakeWindow>(opened)]);
  return { ...opened, main };
};

describe('two widgets stacked against the left edge of main', () => {
  const STACK = { top: box(400, 150, 300, 300), bottom: box(400, 450, 300, 300) };

  it("moves main's left edge and the other widget's right edge when the top widget's right edge moves", async () => {
    const w = open(STACK);
    await resizeDrag(w.top, 'right', line({ dx: 40, dy: 0 }, 20));
    expect(w.top.bounds).toEqual(box(400, 150, 340, 300));
    expect(w.bottom.bounds).toEqual(box(400, 450, 340, 300));
    expect(w.main.bounds).toEqual(box(740, 150, 760, 600));
  });

  it("moves main's left edge and the other widget's right edge when the bottom widget's right edge moves", async () => {
    const w = open(STACK);
    await resizeDrag(w.bottom, 'right', line({ dx: -40, dy: 0 }, 20));
    expect(w.bottom.bounds).toEqual(box(400, 450, 260, 300));
    expect(w.top.bounds).toEqual(box(400, 150, 260, 300));
    expect(w.main.bounds).toEqual(box(660, 150, 840, 600));
  });

  it("moves both widgets when main's left edge moves", async () => {
    const w = open(STACK);
    await resizeDrag(w.main, 'left', line({ dx: -40, dy: 0 }, 20));
    expect(w.main.bounds).toEqual(box(660, 150, 840, 600));
    expect(w.top.bounds).toEqual(box(400, 150, 260, 300));
    expect(w.bottom.bounds).toEqual(box(400, 450, 260, 300));
  });

  it("moves a widget stacked below main's bottom corner with the widget above it when main's left edge moves", async () => {
    const w = open({ top: box(400, 450, 300, 300), bottom: box(400, 750, 300, 250) });
    await resizeDrag(w.main, 'left', line({ dx: -40, dy: 0 }, 20));
    expect(w.main.bounds).toEqual(box(660, 150, 840, 600));
    expect(w.top.bounds).toEqual(box(400, 450, 260, 300));
    expect(w.bottom.bounds).toEqual(box(400, 750, 260, 250));
  });

  it('moves the lined-up outer left edge of the other widget with the dragged one', async () => {
    const w = open(STACK);
    await resizeDrag(w.top, 'left', line({ dx: -40, dy: 0 }, 20));
    expect(w.top.bounds).toEqual(box(360, 150, 340, 300));
    expect(w.bottom.bounds).toEqual(box(360, 450, 340, 300));
    expect(w.main.bounds).toEqual(MAIN);
  });
});

describe('the horizontal seam between two stacked windows', () => {
  const GRID = { a: box(100, 150, 300, 300), c: box(400, 150, 300, 300), b: box(100, 450, 300, 300), d: box(400, 450, 300, 300) };

  it('resizes both stacked windows when they are the only pair on the seam', async () => {
    const w = open({ top: box(400, 150, 300, 300), bottom: box(400, 450, 300, 300) });
    await resizeDrag(w.top, 'bottom', line({ dx: 0, dy: 30 }, 15));
    expect(w.top.bounds).toEqual(box(400, 150, 300, 330));
    expect(w.bottom.bounds).toEqual(box(400, 480, 300, 270));
    expect(w.main.bounds).toEqual(MAIN);
  });

  it('moves every window on the seam of a two by two grid flush with main when the top-right bottom edge moves', async () => {
    const w = open(GRID);
    await resizeDrag(w.c, 'bottom', line({ dx: 0, dy: 30 }, 15));
    expect(w.c.bounds).toEqual(box(400, 150, 300, 330));
    expect(w.d.bounds).toEqual(box(400, 480, 300, 270));
    expect(w.b.bounds).toEqual(box(100, 480, 300, 270));
    expect(w.a.bounds).toEqual(box(100, 150, 300, 330));
    expect(w.main.bounds).toEqual(MAIN);
  });

  it('moves every window on the seam of the grid when the bottom-left top edge moves', async () => {
    const w = open(GRID);
    await resizeDrag(w.b, 'top', line({ dx: 0, dy: -30 }, 15));
    expect(w.b.bounds).toEqual(box(100, 420, 300, 330));
    expect(w.a.bounds).toEqual(box(100, 150, 300, 270));
    expect(w.c.bounds).toEqual(box(400, 150, 300, 270));
    expect(w.d.bounds).toEqual(box(400, 420, 300, 330));
  });
});

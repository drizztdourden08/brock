/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { clampToArea } from '../src/main/widgets/clamp-to-area';
import { dragWanted } from '../src/main/widgets/drag-wanted';
import { pointInApp } from '../src/main/widgets/point-in-app';
import { shiftBounds } from '../src/main/widgets/shift-bounds';
import { snapTo } from '../src/main/widgets/snap-to';

const APP = { x: 100, y: 100, width: 800, height: 600 };
const box = (x: number, y: number, width = 200, height = 300) => ({ x, y, width, height });

describe('snapTo', () => {
  it('lands flush on the right edge of the app within reach', () => {
    const hit = snapTo(box(910, 150), [{ to: 'main', bounds: APP }]);
    expect(hit?.bounds).toEqual(box(900, 150));
    expect(hit?.link).toEqual({ to: 'main', edge: 'right' });
  });

  it('lands flush on the left, top and bottom edges', () => {
    expect(snapTo(box(-110, 150), [{ to: 'main', bounds: APP }])?.link.edge).toBe('left');
    expect(snapTo(box(-110, 150), [{ to: 'main', bounds: APP }])?.bounds.x).toBe(-100);
    expect(snapTo(box(300, 705), [{ to: 'main', bounds: APP }])?.bounds).toEqual(box(300, 700));
    expect(snapTo(box(300, -195), [{ to: 'main', bounds: APP }])?.link.edge).toBe('top');
  });

  it('keeps a window that is out of reach where it is', () => {
    expect(snapTo(box(930, 150), [{ to: 'main', bounds: APP }])).toBeNull();
  });

  it('needs the two windows to share some span along the edge', () => {
    expect(snapTo(box(905, 800), [{ to: 'main', bounds: APP }])).toBeNull();
  });

  it('picks the nearest edge among several targets', () => {
    const other = { to: 'logs', bounds: box(1110, 150) };
    const hit = snapTo(box(904, 150), [{ to: 'main', bounds: APP }, other]);
    expect(hit?.link).toEqual({ to: 'main', edge: 'right' });
    const closer = snapTo(box(1318, 150), [{ to: 'main', bounds: APP }, other]);
    expect(closer?.link).toEqual({ to: 'logs', edge: 'right' });
    expect(closer?.bounds.x).toBe(1310);
  });

  it('respects a custom reach', () => {
    expect(snapTo(box(905, 150), [{ to: 'main', bounds: APP }], 4)).toBeNull();
  });
});

describe('dragWanted', () => {
  it('follows the cursor at the window size, whatever the event bounds say', () => {
    expect(dragWanted({ x: 500, y: 400 }, { x: 20, y: 10 }, box(0, 0, 360, 480))).toEqual({ x: 480, y: 390, width: 360, height: 480 });
  });
});

describe('pointInApp', () => {
  const dragged = box(850, 120, 300, 200);

  it('gives the point inside the app content when the cursor is on the dragged window over the app', () => {
    expect(pointInApp({ x: 860, y: 130 }, dragged, APP)).toEqual({ x: 760, y: 30 });
  });

  it('is null when the cursor is over the app but not on the dragged window', () => {
    expect(pointInApp({ x: 200, y: 200 }, dragged, APP)).toBeNull();
  });

  it('is null when the cursor is on the dragged window outside the app', () => {
    expect(pointInApp({ x: 1000, y: 130 }, dragged, APP)).toBeNull();
  });

  it('treats the far edges as outside', () => {
    expect(pointInApp({ x: 900, y: 130 }, dragged, APP)).toBeNull();
  });
});

describe('window bounds', () => {
  const area = { x: 0, y: 0, width: 1920, height: 1040 };

  it('clamps a remembered window into the work area', () => {
    expect(clampToArea(box(1800, 900, 360, 480), area)).toEqual({ x: 1560, y: 560, width: 360, height: 480 });
    expect(clampToArea(box(-50, -20, 360, 480), area)).toEqual({ x: 0, y: 0, width: 360, height: 480 });
  });

  it('shrinks a window larger than the area', () => {
    expect(clampToArea(box(0, 0, 2500, 1200), area)).toEqual(area);
  });

  it('shifts bounds by a delta', () => {
    expect(shiftBounds(box(10, 20), 5, -5)).toEqual(box(15, 15));
  });
});

/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { clampToArea } from '../src/main/widgets/clamp-to-area';
import { coversPoint } from '../src/main/widgets/covers-point';
import { dragWanted } from '../src/main/widgets/drag-wanted';
import { isFlush } from '../src/main/widgets/is-flush';
import { oppositeEdge } from '../src/main/widgets/opposite-edge';
import { placeAtCursor } from '../src/main/widgets/place-at-cursor';
import { pointInApp } from '../src/main/widgets/point-in-app';
import { rescueBounds } from '../src/main/widgets/rescue-bounds';
import { shouldIntervene } from '../src/main/widgets/should-intervene';
import { snapTo } from '../src/main/widgets/snap-to';
import { towedBounds } from '../src/main/widgets/towed-bounds';

const APP = { x: 100, y: 100, width: 800, height: 600 };
const box = (x: number, y: number, width = 200, height = 300) => ({ x, y, width, height });

describe('snapTo', () => {
  it('lands flush on the right edge of the app within reach', () => {
    const hit = snapTo(box(910, 150), [{ to: 'main', bounds: APP }]);
    expect(hit?.bounds).toEqual(box(900, 150));
    expect(hit?.link).toEqual({ to: 'main', edge: 'right' });
  });

  it('lands flush on the left, top and bottom edges', () => {
    expect(snapTo(box(-110, 150), [{ to: 'main', bounds: APP }])?.link?.edge).toBe('left');
    expect(snapTo(box(-110, 150), [{ to: 'main', bounds: APP }])?.bounds.x).toBe(-100);
    expect(snapTo(box(300, 705), [{ to: 'main', bounds: APP }])?.bounds).toEqual(box(300, 700));
    expect(snapTo(box(300, -195), [{ to: 'main', bounds: APP }])?.link?.edge).toBe('top');
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
});

describe('towedBounds', () => {
  const right = box(900, 150);

  it('keeps a window on the right edge flush when the app shrinks from the right', () => {
    expect(towedBounds(right, 'right', APP, { ...APP, width: 700 })).toEqual(box(800, 150));
  });

  it('leaves a window on the right edge alone when the app is resized from the left', () => {
    expect(towedBounds(right, 'right', APP, { ...APP, x: 200, width: 700 })).toEqual(right);
  });

  it('follows a plain move on both axes', () => {
    expect(towedBounds(right, 'right', APP, { ...APP, x: 150, y: 120 })).toEqual(box(950, 170));
  });

  it('keeps its place along the edge when the app is resized from the top', () => {
    expect(towedBounds(right, 'right', APP, { ...APP, y: 300, height: 400 })).toEqual(right);
  });

  it('slides along the edge just enough to stay touching the app', () => {
    expect(towedBounds(right, 'right', APP, { ...APP, y: 500, height: 200 })).toEqual(box(900, 224));
  });

  it('tows a window on the left edge with that edge', () => {
    expect(towedBounds(box(-100, 150), 'left', APP, { ...APP, x: 200, width: 700 })).toEqual(box(0, 150));
    expect(towedBounds(box(-100, 150), 'left', APP, { ...APP, width: 700 })).toEqual(box(-100, 150));
  });

  it('tows windows above and below the app by their edge', () => {
    expect(towedBounds(box(300, 700, 200, 100), 'bottom', APP, { ...APP, height: 500 })).toEqual(box(300, 600, 200, 100));
    expect(towedBounds(box(300, -100, 200, 200), 'top', APP, { ...APP, y: 150 })).toEqual(box(300, -50, 200, 200));
  });

  it('snaps a window back onto its edge when the anchor did not move', () => {
    expect(towedBounds(box(907, 150), 'right', APP, APP)).toEqual(right);
  });
});

describe('isFlush', () => {
  it('holds while the window sits on the linked edge and shares some span', () => {
    expect(isFlush(box(900, 150), 'right', APP)).toBe(true);
    expect(isFlush(box(901, 150), 'right', APP)).toBe(true);
    expect(isFlush(box(300, 700), 'bottom', APP)).toBe(true);
  });

  it('breaks when the window left the edge or no longer shares a span', () => {
    expect(isFlush(box(905, 150), 'right', APP)).toBe(false);
    expect(isFlush(box(900, 800), 'right', APP)).toBe(false);
  });
});

describe('rescueBounds', () => {
  const areas = [{ x: 0, y: 0, width: 1920, height: 1040 }, { x: 1920, y: 0, width: 1280, height: 1000 }];

  it('leaves a reachable window where it is, even across two displays', () => {
    expect(rescueBounds(box(100, 100), areas)).toBeNull();
    expect(rescueBounds(box(1880, 100), areas)).toBeNull();
  });

  it('brings a lost window into the nearest work area', () => {
    expect(rescueBounds(box(-5000, 100), areas)).toEqual(box(0, 100));
    expect(rescueBounds(box(4000, 200), areas)).toEqual(box(3000, 200));
  });

  it('rescues a window whose title strip is out of reach', () => {
    expect(rescueBounds(box(500, -200), areas)).toEqual(box(500, 0));
    expect(rescueBounds(box(-160, 100), areas)).toEqual(box(0, 100));
  });

  it('does nothing without any area', () => {
    expect(rescueBounds(box(-5000, 100), [])).toBeNull();
  });
});

describe('placeAtCursor', () => {
  it('puts the title bar under the cursor', () => {
    expect(placeAtCursor({ x: 500, y: 400 }, { width: 360, height: 480 })).toEqual({ x: 420, y: 384, width: 360, height: 480 });
    expect(placeAtCursor({ x: 500, y: 400 }, { width: 100, height: 200 })).toEqual({ x: 450, y: 384, width: 100, height: 200 });
  });
});

describe('coversPoint', () => {
  const main = { onTop: false, stamp: 5 };
  const point = { x: 150, y: 150 };

  it('counts a window above the app at the point', () => {
    expect(coversPoint(point, [{ bounds: box(100, 100), onTop: false, stamp: 7 }], main)).toBe(true);
    expect(coversPoint(point, [{ bounds: box(100, 100), onTop: true, stamp: 1 }], main)).toBe(true);
  });

  it('ignores windows below the app or away from the point', () => {
    expect(coversPoint(point, [{ bounds: box(100, 100), onTop: false, stamp: 3 }], main)).toBe(false);
    expect(coversPoint(point, [{ bounds: box(100, 100), onTop: false, stamp: 9 }], { onTop: true, stamp: 5 })).toBe(false);
    expect(coversPoint({ x: 600, y: 600 }, [{ bounds: box(100, 100), onTop: true, stamp: 9 }], main)).toBe(false);
  });
});

describe('shouldIntervene', () => {
  const proposed = box(10, 10);

  it('leaves a plain drag to the OS', () => {
    expect(shouldIntervene(proposed, proposed, false, false)).toBe(false);
    expect(shouldIntervene(proposed, box(30, 10), false, false)).toBe(false);
  });

  it('steps in for a snap or a grown window', () => {
    expect(shouldIntervene(proposed, box(14, 10), true, false)).toBe(true);
    expect(shouldIntervene({ ...proposed, width: 250 }, proposed, false, false)).toBe(true);
  });

  it('never fights the OS on the tick a window crosses into another scale', () => {
    expect(shouldIntervene(proposed, box(14, 10), true, true)).toBe(false);
  });
});

describe('oppositeEdge', () => {
  it('mirrors each edge', () => {
    expect([oppositeEdge('left'), oppositeEdge('right'), oppositeEdge('top'), oppositeEdge('bottom')]).toEqual(['right', 'left', 'bottom', 'top']);
  });
});

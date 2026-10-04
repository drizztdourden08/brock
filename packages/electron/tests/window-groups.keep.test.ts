/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { boundsUnion } from '../src/main/widgets/bounds-union';
import { ctrlFromInput } from '../src/main/widgets/ctrl-from-input';
import { largestOverlap } from '../src/main/widgets/largest-overlap';
import { manipulationRules } from '../src/main/widgets/manipulation-rules';
import { mapIntoArea } from '../src/main/widgets/map-into-area';
import { resizeEdges } from '../src/main/widgets/resize-edges';
import { resizeSnap } from '../src/main/widgets/resize-snap';
import { sharedEdgeResize } from '../src/main/widgets/shared-edge-resize';
import { snapTo } from '../src/main/widgets/snap-to';

const APP = { x: 100, y: 100, width: 800, height: 600 };
const MIN = { width: 240, height: 160 };
const box = (x: number, y: number, width = 200, height = 300) => ({ x, y, width, height });
const edgeWindow = (id: string, bounds: ReturnType<typeof box>) => ({ id, bounds, min: MIN });
const ALL_EDGES = { left: false, right: false, top: false, bottom: false };

describe('snapTo corners', () => {
  it('lines the top corners up when the window lands beside another', () => {
    const hit = snapTo(box(905, 108), [{ to: 'main', bounds: APP }]);
    expect(hit?.bounds).toEqual(box(900, 100));
    expect(hit?.link).toEqual({ to: 'main', edge: 'right' });
  });

  it('lines the bottom corners up too', () => {
    expect(snapTo(box(905, 395), [{ to: 'main', bounds: APP }])?.bounds).toEqual(box(900, 400));
  });

  it('lines the left corners up when stacked below', () => {
    expect(snapTo(box(110, 708), [{ to: 'main', bounds: APP }])?.bounds).toEqual(box(100, 700));
  });

  it('snaps corner to corner diagonally without a tow link', () => {
    const hit = snapTo(box(906, 706), [{ to: 'main', bounds: APP }]);
    expect(hit?.bounds).toEqual(box(900, 700));
    expect(hit?.link).toBeNull();
  });

  it('lines up with a third window across the gap', () => {
    const other = { to: 'logs', bounds: box(1200, 150) };
    expect(snapTo(box(905, 157), [{ to: 'main', bounds: APP }, other])?.bounds).toEqual(box(900, 150));
  });

  it('leaves a window that only nears a far corner alone', () => {
    expect(snapTo(box(906, 740), [{ to: 'main', bounds: APP }])).toBeNull();
  });
});

describe('resizeEdges', () => {
  it('reads the edge Electron reports', () => {
    expect(resizeEdges(APP, APP, 'top-left')).toEqual({ left: true, right: false, top: true, bottom: false });
    expect(resizeEdges(APP, APP, 'bottom')).toEqual({ ...ALL_EDGES, bottom: true });
  });

  it('falls back to the sides that moved', () => {
    expect(resizeEdges(APP, { ...APP, width: 820 })).toEqual({ ...ALL_EDGES, right: true });
    expect(resizeEdges(APP, { ...APP, y: 90, height: 610 })).toEqual({ ...ALL_EDGES, top: true });
  });
});

describe('resizeSnap', () => {
  const beside = box(900, 100, 300, 500);

  it('snaps a moving bottom edge to the neighbour bottom edge', () => {
    const snapped = resizeSnap({ ...beside, height: 594 }, { ...ALL_EDGES, bottom: true }, [APP], MIN);
    expect(snapped).toEqual({ ...beside, height: 600 });
  });

  it('snaps a moving top edge to the neighbour top edge', () => {
    const snapped = resizeSnap({ ...beside, y: 110, height: 490 }, { ...ALL_EDGES, top: true }, [APP], MIN);
    expect(snapped.y).toBe(100);
    expect(snapped.y + snapped.height).toBe(600);
  });

  it('snaps left and right edges to the left and right edges of windows above or below', () => {
    const below = box(105, 700, 500, 200);
    expect(resizeSnap(below, { ...ALL_EDGES, left: true }, [APP], MIN).x).toBe(100);
    expect(resizeSnap({ ...below, width: 790 }, { ...ALL_EDGES, right: true }, [APP], MIN)).toEqual({ ...below, width: 795 });
  });

  it('only moves the edges being dragged', () => {
    const snapped = resizeSnap({ ...beside, y: 105, height: 590 }, { ...ALL_EDGES, bottom: true }, [APP], MIN);
    expect(snapped.y).toBe(105);
    expect(snapped.y + snapped.height).toBe(700);
  });

  it('ignores windows out of reach and edges further than the snap distance', () => {
    expect(resizeSnap({ ...beside, height: 580 }, { ...ALL_EDGES, bottom: true }, [APP], MIN).height).toBe(580);
    expect(resizeSnap(box(2000, 100, 300, 494), { ...ALL_EDGES, bottom: true }, [APP], MIN).height).toBe(494);
  });

  it('never goes below the minimum size', () => {
    const snapped = resizeSnap(box(900, 590, 300, 165), { ...ALL_EDGES, top: true }, [APP, box(900, 600, 300, 10)], { width: 240, height: 160 });
    expect(snapped.height).toBeGreaterThanOrEqual(160);
  });
});

describe('group layout maths', () => {
  const left = box(0, 0, 400, 300);
  const right = box(400, 0, 200, 300);

  it('takes the bounding box of the members', () => {
    expect(boundsUnion([left, right, box(100, 300, 100, 100)])).toEqual(box(0, 0, 600, 400));
    expect(boundsUnion([])).toBeNull();
  });

  it('scales every member proportionally into the area and keeps shared edges flush', () => {
    const group = boundsUnion([left, right]);
    if (!group) throw new Error('no box');
    const area = box(1000, 50, 1200, 900);
    const a = mapIntoArea(left, group, area);
    const b = mapIntoArea(right, group, area);
    expect(a).toEqual(box(1000, 50, 800, 900));
    expect(b).toEqual(box(1800, 50, 400, 900));
    expect(a.x + a.width).toBe(b.x);
  });

  it('maps back onto the original bounds, so a restore puts members back', () => {
    const members = [box(13, 7, 333, 211), box(346, 7, 120, 211), box(13, 218, 453, 99)];
    const group = boundsUnion(members);
    if (!group) throw new Error('no box');
    const area = box(0, 0, 1920, 1040);
    const there = members.map((member) => mapIntoArea(member, group, area));
    const fitted = boundsUnion(there);
    expect(fitted).toEqual(area);
    const back = there.map((member) => (fitted ? mapIntoArea(member, fitted, group) : member));
    back.forEach((member, index) => {
      const before = members[index];
      expect(Math.abs(member.x - (before?.x ?? 0))).toBeLessThanOrEqual(1);
      expect(Math.abs(member.width - (before?.width ?? 0))).toBeLessThanOrEqual(1);
    });
  });

  it('picks the display the group is mostly on', () => {
    const displays = [box(0, 0, 1920, 1080), box(1920, 0, 1920, 1080)];
    expect(largestOverlap([box(1800, 100, 400, 300)], displays)).toBe(1);
    expect(largestOverlap([box(100, 100, 400, 300), box(1900, 100, 40, 40)], displays)).toBe(0);
  });
});

describe('sharedEdgeResize', () => {
  const top = box(500, 100, 300, 200);
  const bottom = box(500, 300, 300, 200);
  const leftOf = box(200, 100, 300, 400);

  it('leaves the matching edge of a window stacked below alone, since it does not face the dragged edge', () => {
    const result = sharedEdgeResize(top, { ...top, x: 460, width: 340 }, [edgeWindow('bottom', bottom)]);
    expect(result).toEqual({ bounds: { ...top, x: 460, width: 340 }, moves: [] });
  });

  it('drags only the facing edge of the neighbour across the seam', () => {
    const result = sharedEdgeResize(top, { ...top, x: 460, width: 340 }, [edgeWindow('bottom', bottom), edgeWindow('left', leftOf)]);
    expect(result.moves).toEqual([{ id: 'left', bounds: { ...leftOf, width: 260 } }]);
  });

  it('leaves windows that are not on the edge alone', () => {
    const far = box(500, 800, 300, 200);
    expect(sharedEdgeResize(top, { ...top, x: 460, width: 340 }, [edgeWindow('far', far)]).moves).toEqual([]);
  });

  it('never stretches a window beside it when an outer edge moves', () => {
    const beside = box(800, 100, 300, 200);
    const result = sharedEdgeResize(top, { ...top, height: 260 }, [edgeWindow('beside', beside)]);
    expect(result.moves).toEqual([]);
  });

  it('moves the facing edge across the seam when the bottom edge is shared', () => {
    const result = sharedEdgeResize(top, { ...top, height: 240 }, [edgeWindow('bottom', bottom)]);
    expect(result.moves).toEqual([{ id: 'bottom', bounds: { ...bottom, y: 340, height: 160 } }]);
  });

  it('stops at the minimum size of every window it moves', () => {
    const result = sharedEdgeResize(top, { ...top, x: 260, width: 540 }, [edgeWindow('left', leftOf)]);
    expect(result.bounds.x).toBe(440);
    expect(result.moves).toEqual([{ id: 'left', bounds: { ...leftOf, width: 240 } }]);
  });
});

describe('Ctrl bypass', () => {
  it('turns snapping and the shared-edge resize off while Ctrl is held', () => {
    expect(manipulationRules(true, true)).toEqual({ snap: false, shared: false });
    expect(manipulationRules(false, true)).toEqual({ snap: true, shared: true });
    expect(manipulationRules(false, false)).toEqual({ snap: false, shared: true });
  });

  it('reads Ctrl from key and mouse input events', () => {
    expect(ctrlFromInput({ type: 'keyDown', key: 'Control', control: true })).toBe(true);
    expect(ctrlFromInput({ type: 'rawKeyDown', keyCode: 'Control', modifiers: ['control'] })).toBe(true);
    expect(ctrlFromInput({ type: 'keyUp', key: 'Control', control: true })).toBe(false);
    expect(ctrlFromInput({ type: 'mouseMove', modifiers: ['control', 'leftbuttondown'] })).toBe(true);
    expect(ctrlFromInput({ type: 'mouseMove', modifiers: [] })).toBe(false);
    expect(ctrlFromInput({ type: 'keyDown', key: 'a', control: false })).toBe(false);
    expect(ctrlFromInput({})).toBeNull();
  });
});

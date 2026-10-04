/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { fitIntoArea } from '../src/main/widgets/fit-into-area';

const MIN = { width: 240, height: 160 };
const CI_AREA = { x: 1424, y: 0, width: 1024, height: 720 };
const box = (x: number, y: number, width: number, height: number): WidgetWindowBounds => ({ x, y, width, height });
const right = (b: WidgetWindowBounds): number => b.x + b.width;
const bottom = (b: WidgetWindowBounds): number => b.y + b.height;
const inside = (b: WidgetWindowBounds, area: WidgetWindowBounds): boolean => b.x >= area.x && b.y >= area.y && right(b) <= right(area) && bottom(b) <= bottom(area);

const fit = (members: WidgetWindowBounds[], mins: { width: number; height: number }[], area: WidgetWindowBounds): WidgetWindowBounds[] => {
  const fitted = fitIntoArea(members, mins, area);
  expect(fitted).toHaveLength(members.length);
  for (const b of fitted) expect(inside(b, area)).toBe(true);
  return fitted;
};

const pick = (list: WidgetWindowBounds[], index: number): WidgetWindowBounds => {
  const found = list[index];
  if (!found) throw new Error(`no window ${index}`);
  return found;
};

describe('fitIntoArea', () => {
  it('scales in proportion when no minimum gets in the way', () => {
    expect(fit([box(0, 0, 400, 300), box(400, 0, 200, 300)], [MIN, MIN], box(0, 0, 1200, 900))).toEqual([box(0, 0, 800, 900), box(800, 0, 400, 900)]);
  });

  it('keeps a group with a gap inside a 1024x720 area at an offset when minimums stop the scale', () => {
    const fitted = fit([box(1424, 0, 1280, 720), box(2904, 0, 360, 240)], [{ width: 640, height: 480 }, MIN], CI_AREA);
    const [main, logs] = [pick(fitted, 0), pick(fitted, 1)];
    expect(main.width).toBeGreaterThanOrEqual(640);
    expect(logs.width).toBeGreaterThanOrEqual(MIN.width);
    expect(main.x).toBe(CI_AREA.x);
    expect(right(logs)).toBe(right(CI_AREA));
    expect(right(main)).toBeLessThanOrEqual(logs.x);
  });

  it('keeps snapped edges flush and the order of a row when it squeezes', () => {
    const mins = [{ width: 500, height: 480 }, MIN, MIN, MIN];
    const fitted = fit([box(0, 0, 1600, 900), box(1600, 0, 300, 450), box(1600, 450, 300, 450), box(1900, 0, 300, 900)], mins, box(100, 50, 1024, 720));
    const [main, top, under, last] = [pick(fitted, 0), pick(fitted, 1), pick(fitted, 2), pick(fitted, 3)];
    expect(right(main)).toBe(top.x);
    expect(top.x).toBe(under.x);
    expect(bottom(top)).toBe(under.y);
    expect(right(top)).toBe(last.x);
    expect(fitted.every((b, i) => b.width >= (mins[i]?.width ?? 0))).toBe(true);
  });

  it('squeezes the height of a stack to the minimums in a short area', () => {
    const fitted = fit([box(0, 0, 400, 600), box(0, 600, 400, 600)], [MIN, { width: 240, height: 500 }], box(0, 0, 1024, 720));
    expect(pick(fitted, 1).height).toBe(500);
    expect(pick(fitted, 0).height).toBe(220);
    expect(bottom(pick(fitted, 0))).toBe(pick(fitted, 1).y);
  });

  it('still keeps every window inside when the minimums cannot all fit', () => {
    const fitted = fit([box(0, 0, 1600, 900), box(1600, 0, 600, 900)], [{ width: 900, height: 480 }, MIN], CI_AREA);
    expect(fitted.map((b) => b.width)).toEqual([900, 240]);
  });
});

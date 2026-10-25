/* @layer renderer-components @kind logic */
import type { Point } from '../PadOverlay.type';

const cross = (a: Point, b: Point): number => a.x * b.y - a.y * b.x;

const crossingAt = (a: Point, b: Point, c: Point, d: Point): number | null => {
  const along = { x: b.x - a.x, y: b.y - a.y };
  const edge = { x: d.x - c.x, y: d.y - c.y };
  const gap = { x: c.x - a.x, y: c.y - a.y };
  const denominator = cross(along, edge);
  if (denominator === 0) return null;
  const t = cross(gap, edge) / denominator;
  const u = cross(gap, along) / denominator;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? t : null;
};

export { crossingAt };

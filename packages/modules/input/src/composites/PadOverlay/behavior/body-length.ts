/* @layer renderer-components @kind logic */
import { pointInPolygon } from './point-in-polygon';
import { crossingAt } from './segment-crossings';
import type { Body, Segment } from './placement.type';

const insideLength = ([a, b]: Segment, body: Body): number => {
  const cuts = body.outlineEdges.flatMap(([c, d]) => {
    const t = crossingAt(a, b, c, d);
    return t === null ? [] : [t];
  });
  const marks = [0, ...cuts.sort((x, y) => x - y), 1];
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  return marks.slice(1).reduce((sum, mark, index) => {
    const from = marks[index] ?? 0;
    const mid = (from + mark) / 2;
    const inside = pointInPolygon({ x: a.x + (b.x - a.x) * mid, y: a.y + (b.y - a.y) * mid }, body.outline);
    return inside ? sum + (mark - from) * length : sum;
  }, 0);
};

const bodyLength = (segments: readonly Segment[], body: Body): number =>
  segments.reduce((sum, segment) => sum + insideLength(segment, body), 0);

export { bodyLength };

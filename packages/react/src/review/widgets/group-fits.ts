/* @layer renderer-shell @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const inside = (b: WidgetWindowBounds, area: WidgetWindowBounds): boolean =>
  b.x >= area.x && b.y >= area.y && b.x + b.width <= area.x + area.width && b.y + b.height <= area.y + area.height;

const sameOrder = (after: readonly WidgetWindowBounds[], before: readonly WidgetWindowBounds[]): boolean =>
  before.every((a, i) => before.every((b, j) => {
    const [x, y] = [after[i], after[j]];
    if (!x || !y) return false;
    return (a.x < b.x ? x.x <= y.x : true) && (a.y < b.y ? x.y <= y.y : true);
  }));

const groupFits = (after: readonly WidgetWindowBounds[], before: readonly WidgetWindowBounds[], area: WidgetWindowBounds): boolean => {
  const left = Math.min(...after.map((b) => b.x));
  const right = Math.max(...after.map((b) => b.x + b.width));
  const top = Math.min(...after.map((b) => b.y));
  const bottom = Math.max(...after.map((b) => b.y + b.height));
  const filled = left === area.x && right === area.x + area.width && top === area.y && bottom === area.y + area.height;
  return after.length === before.length && after.every((b) => inside(b, area)) && filled && sameOrder(after, before);
};

export { groupFits };

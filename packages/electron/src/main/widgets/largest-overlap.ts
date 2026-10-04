/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const overlapArea = (a: WidgetWindowBounds, b: WidgetWindowBounds): number => {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return width > 0 && height > 0 ? width * height : 0;
};

const largestOverlap = (members: readonly WidgetWindowBounds[], areas: readonly WidgetWindowBounds[]): number => {
  let best = 0;
  let most = -1;
  areas.forEach((area, index) => {
    const covered = members.reduce((sum, member) => sum + overlapArea(member, area), 0);
    if (covered > most) {
      best = index;
      most = covered;
    }
  });
  return best;
};

export { largestOverlap };

/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { isAcross } from './is-across';
import { resizeSides } from './resize-sides';
import { ACROSS_SIDES, VERTICAL_SIDES } from './widget-windows.constants';
import type { ResizeSession } from './widget-windows.type';

const lineOnly = (bounds: WidgetWindowBounds, edge: WidgetEdge): WidgetWindowBounds => {
  const at = resizeSides.lineOf(bounds, edge);
  return isAcross(edge) ? { ...bounds, x: at, width: 0 } : { ...bounds, y: at, height: 0 };
};

const resizeTargets = (session: ResizeSession, across: boolean): WidgetWindowBounds[] =>
  session.around.flatMap(({ id, bounds }) => {
    const moving = session.followers.filter((f) => f.id === id && session.sides[f.side] && isAcross(f.side) === across).map((f) => f.edge);
    const kept = (across ? ACROSS_SIDES : VERTICAL_SIDES).filter((edge) => !moving.includes(edge));
    return kept.length === 2 ? [bounds] : kept.map((edge) => lineOnly(bounds, edge));
  });

export { resizeTargets };

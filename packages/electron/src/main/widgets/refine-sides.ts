/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { resizeEdges } from './resize-edges';
import { resizeSides } from './resize-sides';
import type { ResizeSession } from './widget-windows.type';

const refineSides = (session: ResizeSession, proposed: WidgetWindowBounds): void => {
  if (session.known) return;
  session.sides = resizeSides.union(session.sides, resizeEdges(session.first, proposed));
  session.edge = resizeSides.nameOf(session.sides);
};

export { refineSides };

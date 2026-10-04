/* @layer electron-main @kind logic */
import type { WidgetEdge, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { ACROSS_SIDES, VERTICAL_SIDES } from './widget-windows.constants';
import type { ResizeEdges } from './widget-windows.type';

const lineOf = (b: WidgetWindowBounds, side: WidgetEdge): number => {
  if (side === 'left') return b.x;
  if (side === 'right') return b.x + b.width;
  if (side === 'top') return b.y;
  return b.y + b.height;
};

const withLine = (b: WidgetWindowBounds, side: WidgetEdge, line: number): WidgetWindowBounds => {
  if (side === 'left') return { ...b, x: line, width: b.x + b.width - line };
  if (side === 'right') return { ...b, width: line - b.x };
  if (side === 'top') return { ...b, y: line, height: b.y + b.height - line };
  return { ...b, height: line - b.y };
};

const nameOf = (sides: ResizeEdges): string =>
  [VERTICAL_SIDES.find((side) => sides[side]), ACROSS_SIDES.find((side) => sides[side])].filter((side) => side !== undefined).join('-');

const union = (a: ResizeEdges, b: ResizeEdges): ResizeEdges =>
  ({ left: a.left || b.left, right: a.right || b.right, top: a.top || b.top, bottom: a.bottom || b.bottom });

const resizeSides = { lineOf, withLine, nameOf, union };

export { resizeSides };

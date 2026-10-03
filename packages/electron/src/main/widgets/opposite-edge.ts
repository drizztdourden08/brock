/* @layer electron-main @kind logic */
import type { WidgetEdge } from '@drizztdourden08/brock-core';

const oppositeEdge = (edge: WidgetEdge): WidgetEdge => {
  if (edge === 'left') return 'right';
  if (edge === 'right') return 'left';
  return edge === 'top' ? 'bottom' : 'top';
};

export { oppositeEdge };

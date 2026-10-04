/* @layer electron-main @kind logic */
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import type { ResizeEdges } from './widget-windows.type';

const fromDetail = (edge: string): ResizeEdges =>
  ({ left: edge.includes('left'), right: edge.includes('right'), top: edge.includes('top'), bottom: edge.includes('bottom') });

const fromChange = (current: WidgetWindowBounds, proposed: WidgetWindowBounds): ResizeEdges => ({
  left: proposed.x !== current.x,
  right: proposed.x + proposed.width !== current.x + current.width,
  top: proposed.y !== current.y,
  bottom: proposed.y + proposed.height !== current.y + current.height,
});

const resizeEdges = (current: WidgetWindowBounds, proposed: WidgetWindowBounds, edge?: string): ResizeEdges =>
  (edge ? fromDetail(edge) : fromChange(current, proposed));

export { resizeEdges };

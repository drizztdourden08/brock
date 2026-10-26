/* @layer renderer-shell @kind logic */
import { anchorPoint } from './anchor-point';
import type { ContextMenuEvent, ContextMenuPoint } from './context-menu.type';
import { openContextMenu } from './open-context-menu';

const pointOf = (event: ContextMenuEvent): ContextMenuPoint | null =>
  'clientX' in event && (event.clientX !== 0 || event.clientY !== 0) ? { x: event.clientX, y: event.clientY } : null;

const contextMenuHandler = (zone: string, data?: unknown) => (event: ContextMenuEvent): void => {
  event.preventDefault();
  const point = pointOf(event);
  openContextMenu(zone, data, { point: point ?? anchorPoint(event.currentTarget), trigger: point === null ? 'keyboard' : 'pointer' });
};

export { contextMenuHandler };

/* @layer renderer-shell @kind logic */
import type { ContextMenuPoint } from './context-menu.type';

const anchorPoint = (element: Element): ContextMenuPoint => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.bottom };
};

export { anchorPoint };

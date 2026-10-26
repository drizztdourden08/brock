/* @layer renderer-shell @kind logic */
import type { ContextMenuConfig, ContextMenuSource } from './context-menu.type';

const normalizeSource = (source: ContextMenuSource): ContextMenuConfig =>
  (Array.isArray(source) || typeof source === 'function' ? { entries: source } : (source as ContextMenuConfig));

export { normalizeSource };

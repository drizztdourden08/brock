/* @layer renderer-shell @kind logic */
import type { OpenOptions } from './context-menu.type';
import { findZoneElement } from './find-zone-element';
import { openAtTarget } from './open-at-target';

const openContextMenu = (zone: string, data?: unknown, options: OpenOptions = {}): boolean => {
  const target = findZoneElement(zone);
  if (target === null) return false;
  return openAtTarget({ target, point: options.point ?? null, trigger: options.trigger ?? 'keyboard', data, ...(options.selection === undefined ? {} : { selection: options.selection }) }) === 'opened';
};

export { openContextMenu };

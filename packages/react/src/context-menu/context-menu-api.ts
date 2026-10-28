/* @layer renderer-shell @kind logic */
import { closeContextMenu } from './close-context-menu';
import type { OpenOptions } from './context-menu.type';
import { openAtTarget } from './open-at-target';
import { openContextMenu } from './open-context-menu';

const contextMenu = {
  open: openContextMenu,
  openAt: (element: Element, data?: unknown, options: OpenOptions = {}): boolean =>
    openAtTarget({
      target: element,
      point: options.point ?? null,
      trigger: options.trigger ?? 'keyboard',
      data,
      ...(options.selection === undefined ? {} : { selection: options.selection }),
    }) === 'opened',
  close: closeContextMenu,
};

export { contextMenu };

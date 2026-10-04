/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../menu/menu.type';
import { barAnchor } from './bar-anchor';
import { useTitleBarMenuStore } from './useTitleBarMenuStore';

const titleBarMenu = {
  open: (id: string, items: readonly MenuEntry[]): void => {
    requestAnimationFrame(() => useTitleBarMenuStore.getState().show({ id, items, anchor: barAnchor(id) }));
  },
  close: (): void => useTitleBarMenuStore.getState().hide(),
};

export { titleBarMenu };

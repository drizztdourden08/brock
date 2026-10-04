/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import type { ScreenMeta } from './screens-config.type';

const screenMetaFields = (meta: ScreenMeta | undefined): Pick<ScreenDef, 'devOnly' | 'requiresProfile' | 'shortcut' | 'menu' | 'order' | 'menuOrder'> => ({
  devOnly: meta?.devOnly ?? false,
  requiresProfile: meta?.requiresProfile ?? true,
  shortcut: meta?.shortcut,
  menu: meta?.menu,
  order: meta?.order,
  menuOrder: meta?.menuOrder,
});

export { screenMetaFields };

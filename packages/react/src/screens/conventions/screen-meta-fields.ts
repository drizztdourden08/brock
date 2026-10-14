/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../screen.type';
import { showRuleOf } from '../show/show-rule-of';
import type { ScreenMeta } from './screens-config.type';

const screenMetaFields = (meta: ScreenMeta | undefined): Pick<ScreenDef, 'devOnly' | 'requiresProfile' | 'shortcut' | 'menu' | 'order' | 'menuOrder' | 'show' | 'keepMounted'> => ({
  devOnly: meta?.devOnly ?? false,
  requiresProfile: meta?.requiresProfile ?? true,
  shortcut: meta?.shortcut,
  menu: meta?.menu,
  order: meta?.order,
  menuOrder: meta?.menuOrder,
  show: showRuleOf(meta),
  keepMounted: meta?.keepMounted,
});

export { screenMetaFields };

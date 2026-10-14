/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub/hub.type';
import { showRuleOf } from '../show/show-rule-of';
import { hubHeader } from './hub-header';
import type { ScreenMeta } from './screens-config.type';

const pageMetaFields = (meta: ScreenMeta | undefined): Pick<HubPage, 'devOnly' | 'shortcut' | 'header' | 'menu' | 'order' | 'menuOrder' | 'fill' | 'show' | 'keepMounted'> => ({
  devOnly: meta?.devOnly,
  shortcut: meta?.shortcut,
  header: hubHeader(meta?.header),
  menu: meta?.menu,
  order: meta?.order,
  menuOrder: meta?.menuOrder,
  fill: meta?.fill,
  show: showRuleOf(meta),
  keepMounted: meta?.keepMounted,
});

export { pageMetaFields };

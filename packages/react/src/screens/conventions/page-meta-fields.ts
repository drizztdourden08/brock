/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub/hub.type';
import { showRuleOf } from '../show/show-rule-of';
import { hubHeader } from './hub-header';
import { pageFrameFields } from './page-frame-fields';
import type { ScreenMeta } from './screens-config.type';

const pageMetaFields = (meta: ScreenMeta | undefined): Pick<HubPage, 'devOnly' | 'keywords' | 'shortcut' | 'header' | 'menu' | 'order' | 'menuOrder' | 'fill' | 'bare' | 'showHeader' | 'show' | 'keepMounted' | 'backdrop'> => ({
  devOnly: meta?.devOnly,
  keywords: meta?.keywords,
  shortcut: meta?.shortcut,
  header: hubHeader(meta?.header),
  menu: meta?.menu,
  order: meta?.order,
  menuOrder: meta?.menuOrder,
  show: showRuleOf(meta),
  ...pageFrameFields(meta),
});

export { pageMetaFields };

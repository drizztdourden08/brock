/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub/hub.type';
import type { ScreenMeta } from './screens-config.type';

const pageFrameFields = (meta: ScreenMeta | undefined): Pick<HubPage, 'fill' | 'bare' | 'showHeader' | 'keepMounted' | 'backdrop'> => ({
  fill: meta?.fill,
  bare: meta?.bare,
  showHeader: meta?.showHeader,
  keepMounted: meta?.keepMounted,
  backdrop: meta?.backdrop,
});

export { pageFrameFields };

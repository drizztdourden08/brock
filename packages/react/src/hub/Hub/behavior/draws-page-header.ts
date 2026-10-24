/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage } from '../../hub.type';
import { isBarePage } from './is-bare-page';
import { showsPageHeader } from './shows-page-header';

const drawsPageHeader = (hub: Pick<HubDef, 'pages'>, page: HubPage): boolean =>
  page.fullBleed !== true
  && !isBarePage(hub, page)
  && (page.settingsTab !== undefined || (page.tabs?.length ?? 0) > 0 || showsPageHeader(page));

export { drawsPageHeader };

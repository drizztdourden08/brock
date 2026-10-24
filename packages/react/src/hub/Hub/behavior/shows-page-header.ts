/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub.type';

const showsPageHeader = (page: HubPage): boolean => page.showHeader ?? page.header !== undefined;

export { showsPageHeader };

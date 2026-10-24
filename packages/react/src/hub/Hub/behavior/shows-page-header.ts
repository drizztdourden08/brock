/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub.type';

const showsPageHeader = (page: HubPage): boolean => (page.showHeader === undefined ? page.header !== undefined : page.showHeader !== false);

export { showsPageHeader };

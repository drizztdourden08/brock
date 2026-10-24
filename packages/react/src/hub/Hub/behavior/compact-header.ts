/* @layer renderer-shell @kind logic */
import type { HubPage } from '../../hub.type';

const compactHeader = (page: HubPage): true | undefined => (page.showHeader === 'compact' ? true : undefined);

export { compactHeader };

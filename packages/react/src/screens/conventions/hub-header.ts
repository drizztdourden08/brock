/* @layer renderer-shell @kind logic */
import type { HubPageHeader } from '../../hub/hub.type';
import { iconNode } from './icon-node';
import type { PageHeaderMeta } from './screens-config.type';

const hubHeader = (meta: PageHeaderMeta | undefined): HubPageHeader | undefined => {
  if (meta === undefined) return undefined;
  const { primary, search } = meta;
  return {
    search,
    primary: primary && { label: primary.label, open: primary.open, icon: primary.icon === undefined ? undefined : iconNode(primary.icon) },
  };
};

export { hubHeader };

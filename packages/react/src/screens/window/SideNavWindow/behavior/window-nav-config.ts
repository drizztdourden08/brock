/* @layer renderer-shell @kind logic */
import type { SideNavConfig } from '@drizztdourden08/tessera/composites';
import { iconNode } from '../../../conventions/icon-node';
import { groupsOf } from '../../groups-of';
import type { WindowDef } from '../../window.type';

const windowNavConfig = (def: WindowDef): SideNavConfig => ({
  groups: groupsOf(def).map((group) => ({
    id: group.id,
    label: group.label,
    items: group.items.map((item) => ({ id: item.id, label: item.label, icon: iconNode(item.icon), disabled: item.disabled })),
  })),
});

export { windowNavConfig };

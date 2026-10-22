/* @layer renderer-shell @kind types */
import type { SideNavConfig } from '@drizztdourden08/tessera/composites';
import type { WindowItem } from '../../window.type';

interface WindowNav {
  config: SideNavConfig;
  item: WindowItem;
  select: (id: string) => void;
}

export type { WindowNav };

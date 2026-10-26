/* @layer renderer-shell @kind types */
import type { HubGroup, HubPage } from '../../hub.type';

interface TopSplit {
  top: HubPage[];
  groups: HubGroup[];
}

export type { TopSplit };

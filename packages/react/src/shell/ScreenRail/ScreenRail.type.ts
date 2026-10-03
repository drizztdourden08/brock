/* @layer renderer-shell @kind types */
import type { SideNavConfig } from '@drizztdourden08/tessera/composites';

interface ScreenRailGroup {
  id: string;
  label: string;
}

interface UseRailEntriesResult {
  config: SideNavConfig;
  activeId: string;
  select: (id: string) => void;
}

export type { ScreenRailGroup, UseRailEntriesResult };

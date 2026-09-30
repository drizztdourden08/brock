/* @layer renderer-shell @kind types */
import type { SectionNavConfig } from '@drizztdourden08/tessera/composites';

interface ScreenRailGroup {
  id: string;
  label: string;
}

interface UseRailEntriesResult {
  config: SectionNavConfig;
  activeId: string;
  select: (id: string) => void;
}

export type { ScreenRailGroup, UseRailEntriesResult };

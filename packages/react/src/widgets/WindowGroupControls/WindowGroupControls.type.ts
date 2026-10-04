/* @layer renderer-shell @kind types */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import type { WindowGroupOption } from '../widget.type';

interface WindowGroupControlsProps {
  sync: boolean;
  onSyncChange: (sync: boolean) => void;
  windowGroup: WidgetWindowGroup | null;
  windowGroups: readonly WindowGroupOption[];
  onWindowGroupChange: (group: WidgetWindowGroup | null) => void;
}

export type { WindowGroupControlsProps };

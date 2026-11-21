/* @layer renderer-components @kind types */
import type { ResolvedControlsLabels, NarrowTabId } from '../ControlsSettings.type';

interface ControlsNarrowTabsProps {
  labels: ResolvedControlsLabels;
  active: NarrowTabId;
  onChange: (tab: NarrowTabId) => void;
}

export type { ControlsNarrowTabsProps };

/* @layer renderer-components @kind types */
import type { ControlsLabels, NarrowTabId } from '../ControlsSettings.type';

interface ControlsNarrowTabsProps {
  labels: ControlsLabels;
  active: NarrowTabId;
  onChange: (tab: NarrowTabId) => void;
}

export type { ControlsNarrowTabsProps };

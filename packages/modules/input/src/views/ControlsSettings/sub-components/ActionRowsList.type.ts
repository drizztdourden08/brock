/* @layer renderer-components @kind types */
import type { ActionGroupRow } from '../behavior/controls-behavior.type';
import type { ActionsTabDef, ControlsCtrl } from './ControlsMain.type';

interface ActionRowsListProps {
  tab: ActionsTabDef;
  rows: ActionGroupRow[];
  columns: number;
  labels: ControlsCtrl['labels'];
  onRebind: (actionId: string, slot: number) => void;
  onClear: (actionId: string, mappingIndex: number) => void;
}

export type { ActionRowsListProps };

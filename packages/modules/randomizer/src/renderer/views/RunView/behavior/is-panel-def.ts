/* @layer renderer-shell @kind logic */
import type { ComponentType } from 'react';
import type { RunPanelDef } from '../../../../contract/randomizer-views.type';

const isPanelDef = (panel: ComponentType | RunPanelDef): panel is RunPanelDef =>
  typeof panel === 'object' && 'Body' in panel;

export { isPanelDef };

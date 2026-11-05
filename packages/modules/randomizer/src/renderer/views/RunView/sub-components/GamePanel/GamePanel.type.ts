/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { RunPanelDef, RunPanelProps } from '../../../../../contract/randomizer-views.type';

interface GamePanelProps extends RunPanelProps {
  panel: ComponentType | RunPanelDef;
}

export type { GamePanelProps };

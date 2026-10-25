/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarDef, ToolbarPlacement } from '../../../../toolbars/toolbar.type';

interface AppStageProps {
  toolbars?: readonly ToolbarDef[];
  placement?: ToolbarPlacement;
  railed: boolean;
  children: ReactNode;
}

export type { AppStageProps };

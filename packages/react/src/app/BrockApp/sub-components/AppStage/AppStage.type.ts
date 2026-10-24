/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarDef } from '../../../../toolbars/toolbar.type';

interface AppStageProps {
  toolbars?: readonly ToolbarDef[];
  railed: boolean;
  children: ReactNode;
}

export type { AppStageProps };

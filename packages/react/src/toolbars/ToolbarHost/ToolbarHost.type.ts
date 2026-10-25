/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarDef } from '../toolbar.type';

interface ToolbarHostProps {
  toolbars?: readonly ToolbarDef[];
  children: ReactNode;
}

export type { ToolbarHostProps };

/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetDef } from '../widget.type';

interface WidgetHostProps {
  widgets?: readonly WidgetDef[];
  main?: ReactNode;
  mainLabel?: string;
}

export type { WidgetHostProps };

/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetFileDrop } from '../widget-drop/widget-drop.type';

interface WidgetBodyProps {
  id: string;
  label: string;
  drop?: WidgetFileDrop;
  children?: ReactNode;
}

export type { WidgetBodyProps };

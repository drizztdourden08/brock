/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetFileDrop } from '../../../widget-drop/widget-drop.type';

interface WidgetDropZoneProps {
  drop: WidgetFileDrop;
  children?: ReactNode;
}

export type { WidgetDropZoneProps };

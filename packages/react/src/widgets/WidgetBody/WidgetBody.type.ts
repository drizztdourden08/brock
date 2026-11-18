/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WidgetFileDrop } from '../widget-drop/widget-drop.type';

interface WidgetBodyProps {
  id: string;
  label: Text;
  drop?: WidgetFileDrop;
  children?: ReactNode;
}

export type { WidgetBodyProps };

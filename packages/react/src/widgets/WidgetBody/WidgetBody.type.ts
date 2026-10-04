/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface WidgetBodyProps {
  id: string;
  label: string;
  children?: ReactNode;
}

export type { WidgetBodyProps };

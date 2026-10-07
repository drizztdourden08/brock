/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { LayoutPreset } from '../layout-preset.type';
import type { WidgetDef } from '../widget.type';

type WidgetContextSource = () => boolean;

interface WidgetHostProps {
  widgets?: readonly WidgetDef[];
  main?: ReactNode;
  mainLabel?: string;
  widgetContext?: WidgetContextSource;
  layout?: LayoutPreset;
  keepFocusWithApp?: boolean;
}

export type { WidgetContextSource, WidgetHostProps };

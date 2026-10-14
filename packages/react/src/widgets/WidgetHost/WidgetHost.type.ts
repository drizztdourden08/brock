/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import type { LayoutPreset } from '../layout-preset.type';
import type { WidgetDef } from '../widget.type';

type WidgetContextSource = () => boolean;

type WidgetDisabledOf = (id: string) => WidgetDisabledState | null;

type WidgetDisabledHook = () => WidgetDisabledOf;

interface WidgetHostProps {
  widgets?: readonly WidgetDef[];
  main?: ReactNode;
  mainLabel?: string;
  widgetContext?: WidgetContextSource;
  layout?: LayoutPreset;
  keepFocusWithApp?: boolean;
  widgetDisabled?: WidgetDisabledHook;
}

export type { WidgetContextSource, WidgetDisabledHook, WidgetDisabledOf, WidgetHostProps };

/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetDefinition, WidgetLayout, WidgetState } from '@drizztdourden08/tessera/composites';
import type { WidgetPrefs } from '../stores/widget-pref.type';

interface WidgetDef extends WidgetDefinition {
  icon?: string;
  render: () => ReactNode;
  settings?: () => ReactNode;
}

type WidgetInput = Pick<WidgetDef, 'id' | 'label' | 'render'> & Partial<Omit<WidgetDef, 'id' | 'label' | 'render'>>;

interface WidgetLayoutState {
  definitions: readonly WidgetDef[];
  layout: WidgetLayout;
  setDefinitions: (definitions: readonly WidgetDef[]) => void;
  replace: (layout: WidgetLayout) => void;
  update: (id: string, patch: Partial<WidgetState>) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
}

interface WidgetRegistryState {
  registered: WidgetDef[];
  add: (definitions: readonly WidgetDef[]) => () => void;
}

interface ProfileViews {
  widgetLayout?: WidgetLayout;
  widgetPrefs?: WidgetPrefs;
}

export type { ProfileViews, WidgetDef, WidgetInput, WidgetLayoutState, WidgetRegistryState };

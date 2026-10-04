/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ExternalDrag, WidgetDefinition, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetPrefs } from '../stores/widget-pref.type';

interface WidgetDef extends WidgetDefinition {
  icon?: string;
  render: () => ReactNode;
  settings?: () => ReactNode;
  taskbar?: boolean;
}

type WidgetInput = Pick<WidgetDef, 'id' | 'label' | 'render'> & Partial<Omit<WidgetDef, 'id' | 'label' | 'render'>>;

interface WidgetLayoutState {
  definitions: readonly WidgetDef[];
  layout: WidgetLayout;
  externalDrag: ExternalDrag | null;
  setDefinitions: (definitions: readonly WidgetDef[]) => void;
  replace: (stored: unknown) => void;
  setLayout: (layout: WidgetLayout) => void;
  change: (fn: (layout: WidgetLayout) => WidgetLayout) => void;
  setExternalDrag: (drag: ExternalDrag | null) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  toggle: (id: string) => void;
  popOut: (id: string) => void;
}

interface WidgetRegistryState {
  registered: WidgetDef[];
  add: (definitions: readonly WidgetDef[]) => () => void;
}

interface WidgetRelayState {
  slices: Record<string, unknown>;
  receive: (kind: string, data: unknown) => void;
  append: (kind: string, items: readonly unknown[], limit: number) => void;
}

interface SettingsSlice {
  profile: Profile | null;
  settings: Record<string, unknown>;
}

interface ProfileViews {
  widgetLayout?: unknown;
  widgetPrefs?: WidgetPrefs;
}

export type {
  ProfileViews, SettingsSlice, WidgetDef, WidgetInput, WidgetLayoutState, WidgetRegistryState, WidgetRelayState,
};

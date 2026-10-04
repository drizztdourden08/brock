/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ExternalDrag, WidgetDefinition, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetPrefs } from '../stores/widget-pref.type';
import type { LayoutPreset } from './layout-preset.type';

interface WidgetDef extends WidgetDefinition {
  icon?: string;
  render: () => ReactNode;
  settings?: () => ReactNode;
  taskbar?: boolean;
  order?: number;
  defaultOpen?: boolean;
}

type WidgetInput = Pick<WidgetDef, 'id' | 'label' | 'render'> & Partial<Omit<WidgetDef, 'id' | 'label' | 'render'>>;

type WidgetMeta = Partial<Omit<WidgetDef, 'id' | 'render' | 'settings'>> & { settings?: ComponentType };

interface WidgetFile {
  id: string;
  component: ComponentType;
  meta?: WidgetMeta;
}

interface WidgetLayoutState {
  definitions: readonly WidgetDef[];
  preset: LayoutPreset | null;
  layout: WidgetLayout;
  externalDrag: ExternalDrag | null;
  setDefinitions: (definitions: readonly WidgetDef[]) => void;
  setPreset: (preset: LayoutPreset | null) => void;
  reset: () => void;
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

interface WidgetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetLayoutReading {
  layout: WidgetLayout;
  docked: string[];
  floating: string[];
  popped: string[];
  main: WidgetRect | null;
  rects: Record<string, WidgetRect>;
}

interface ProfileViews {
  widgetLayout?: unknown;
  widgetPrefs?: WidgetPrefs;
}

interface SharedStore<S> {
  getState: () => S;
  subscribe: (listener: (state: S, prev: S) => void) => () => void;
}

interface ShareOptions<S, T> {
  kind: string;
  pick: (state: S) => T;
  delay?: number;
}

type WindowKind = { kind: 'main' } | { kind: 'widget'; id: string };

interface DockOrigin {
  pane: string;
  index: number;
}

export type {
  DockOrigin, ProfileViews, SettingsSlice, ShareOptions, SharedStore, WidgetDef, WidgetFile, WidgetInput, WidgetMeta, WidgetLayoutReading, WidgetLayoutState, WidgetRegistryState, WidgetRelayState, WindowKind,
};

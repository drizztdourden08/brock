/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { Profile, ProductMenuGroup, WidgetWindowOpen } from '@drizztdourden08/brock-core';
import type { ExternalDrag, ScreenPoint, WidgetDefinition, WidgetGates, WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { ScreenViews } from '../stores/screen-state.type';
import type { WidgetPrefs } from '../stores/widget-pref.type';
import type { LayoutPreset } from './layout-preset.type';

interface WidgetMenuPlacement {
  parent?: string;
  group?: ProductMenuGroup;
  order?: number;
  developer?: boolean;
}

interface WidgetDef extends WidgetDefinition {
  icon?: string;
  render: () => ReactNode;
  settings?: () => ReactNode;
  taskbar?: boolean;
  order?: number;
  defaultOpen?: boolean;
  context?: string;
  kit?: string;
  tools?: () => ReactNode;
  menu?: WidgetMenuPlacement;
}

type WidgetInput = Pick<WidgetDef, 'id' | 'label' | 'render'> & Partial<Omit<WidgetDef, 'id' | 'label' | 'render'>>;

type WidgetMeta = Partial<Omit<WidgetDef, 'id' | 'render' | 'settings' | 'tools'>> & { settings?: ComponentType; tools?: ComponentType };

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

interface ForcedWidgetState {
  ids: string[];
  pending: string[];
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
  widgetKits?: unknown;
  toolbarLayout?: unknown;
  screens?: ScreenViews;
  volume?: unknown;
}

interface ProfileViewsTake {
  found: boolean;
  taken: unknown[];
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

interface PopOutRequest {
  layout: WidgetLayout;
  gates: WidgetGates<WidgetDef>;
  id: string;
  extra: Partial<WidgetWindowOpen>;
  point?: ScreenPoint;
}

interface LayoutHolder {
  layout: WidgetLayout;
  definitions: readonly WidgetDef[];
  change: (fn: (layout: WidgetLayout) => WidgetLayout) => void;
}

export type {
  DockOrigin, ForcedWidgetState, LayoutHolder, PopOutRequest, ProfileViews, ProfileViewsTake, SettingsSlice, ShareOptions, SharedStore, WidgetDef, WidgetFile, WidgetInput, WidgetMenuPlacement, WidgetMeta, WidgetLayoutReading, WidgetLayoutState, WidgetRegistryState, WidgetRelayState, WindowKind,
};

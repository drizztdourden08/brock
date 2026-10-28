/* @layer renderer-shell @kind types */
import type { ComponentType, ReactNode } from 'react';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import type { ShowRule } from '../../screens/show/show.type';
import type { LayoutPreset } from '../layout-preset.type';
import type { WidgetDef, WidgetMenuPlacement } from '../widget.type';

interface KitRequirement {
  context: string;
  reason: string;
}

interface KitOverlayDef {
  id: string;
  label: string;
  order?: number;
  render: () => ReactNode;
}

interface WidgetKitDef {
  id: string;
  label: string;
  icon?: string;
  order?: number;
  devOnly?: boolean;
  requires?: KitRequirement;
  when?: ShowRule;
  layout?: LayoutPreset;
  overlays?: readonly KitOverlayDef[];
  menu?: WidgetMenuPlacement;
}

type WidgetKitMeta = Partial<Omit<WidgetKitDef, 'id' | 'overlays'>>;

interface KitOverlayMeta {
  kit: string;
  label?: string;
  order?: number;
}

interface WidgetKitFile {
  id: string;
  meta?: WidgetKitMeta;
}

interface KitOverlayFile {
  id: string;
  component: ComponentType;
  meta: KitOverlayMeta;
}

interface WidgetKitFiles {
  kits: readonly WidgetKitFile[];
  overlays?: readonly KitOverlayFile[];
}

interface KitView {
  layout: WidgetLayout;
  hidden: string[];
}

interface KitViewSource {
  kits: readonly WidgetKitDef[];
  members: readonly WidgetDef[];
  views: Record<string, KitView>;
}

interface KitStatus {
  shown: boolean;
  reason: string | null;
}

interface WidgetKitState {
  kits: readonly WidgetKitDef[];
  members: readonly WidgetDef[];
  active: string | null;
  views: Record<string, KitView>;
  setKits: (kits: readonly WidgetKitDef[], members: readonly WidgetDef[]) => void;
  open: (id: string) => void;
  close: () => void;
  toggle: (id: string) => void;
  setLayout: (layout: WidgetLayout) => void;
  change: (fn: (layout: WidgetLayout) => WidgetLayout) => void;
  openMember: (id: string) => void;
  toggleMember: (id: string) => void;
  closeMember: (id: string) => void;
  popOutMember: (id: string) => void;
  toggleOverlay: (id: string) => void;
  reset: (id: string) => void;
  replace: (stored: unknown) => void;
}

type KitViews = Pick<WidgetKitState, 'views'>;

type KitSource = Pick<WidgetKitState, 'kits' | 'members' | 'views'>;

type KitLayoutChange = (layout: WidgetLayout) => WidgetLayout;

type KitMemberAction = keyof Pick<WidgetKitState, 'openMember' | 'closeMember' | 'toggleMember' | 'popOutMember'>;

type KitMenuState = Pick<WidgetKitState, 'kits' | 'members' | 'active' | 'views' | 'toggle' | 'toggleMember' | 'toggleOverlay' | 'reset'>;

interface KitRegistryState {
  registered: WidgetKitDef[];
  add: (kits: readonly WidgetKitDef[]) => () => void;
}

export type {
  KitLayoutChange, KitMemberAction, KitMenuState, KitOverlayDef, KitSource, KitOverlayFile, KitOverlayMeta, KitRegistryState, KitRequirement, KitStatus, KitView, KitViews, KitViewSource, WidgetKitDef, WidgetKitFile,
  WidgetKitFiles,
  WidgetKitMeta, WidgetKitState,
};

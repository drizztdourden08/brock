/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface SettingItem {
  key: string;
  label: string;
  description: string;
  keywords?: string;
  link?: string;
}

interface SubSection {
  id: string;
  title: string;
  items: SettingItem[];
}

interface Section {
  id: string;
  title: string;
  items?: SettingItem[];
  subsections?: SubSection[];
}

type SettingLockCause = string;

type SettingsPatch<S> = (patch: Partial<S>) => void;

type RenderControl<S> = (key: string, settings: S, onChange: SettingsPatch<S>) => ReactNode | null;

interface LockOverlayProps {
  cause: SettingLockCause;
  children: ReactNode;
}

interface SettingsControlProps<S extends object> {
  settings: S;
  defaults?: S;
  onChange: SettingsPatch<S>;
  renderControl?: RenderControl<S>;
  isDisabled?: (key: string, settings: S) => boolean;
  lockCauseOf?: (key: string, settings: S) => SettingLockCause | null;
  lockOverlay?: (props: LockOverlayProps) => ReactNode;
}

interface SettingsLayoutProps<S extends object> extends SettingsControlProps<S> {
  sections: Section[];
  emptyMessage?: string;
}

interface TabRenderContext<S extends object> extends SettingsControlProps<S> {
  tab: TabDef<S>;
}

interface TabDef<S extends object> {
  id: string;
  label: string;
  navIcon: ReactNode;
  icon?: string;
  group: string;
  sections?: (settings: S) => Section[];
  render?: (ctx: TabRenderContext<S>) => ReactNode;
  mobileOnly?: boolean;
}

export type {
  LockOverlayProps, RenderControl, Section, SettingItem, SettingLockCause, SettingsControlProps,
  SettingsLayoutProps, SettingsPatch, SubSection, TabDef, TabRenderContext,
};

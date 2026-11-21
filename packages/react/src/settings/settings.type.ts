/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingsDescription, PathKind } from '@drizztdourden08/tessera/composites';
import type { ButtonVariant, IconName } from '@drizztdourden08/tessera/primitives';
import type { ConfirmActionOptions } from '../stores/dialog.type';

interface SettingChoice {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean | string;
}

type SettingLayout = 'inline' | 'wide';

type SettingChoiceLook = 'segmented' | 'select' | 'radio';

type SettingJsonShape = 'object' | 'array' | 'any';

type SettingControl =
  | { kind: 'choice'; options: SettingChoice[]; look?: SettingChoiceLook }
  | { kind: 'select'; options: SettingChoice[]; searchable?: boolean }
  | { kind: 'radio'; options: SettingChoice[] }
  | { kind: 'range'; min: number; max: number; step?: number; format?: (value: number) => string }
  | { kind: 'number'; min?: number; max?: number; step?: number; unit?: string }
  | { kind: 'text'; placeholder?: string }
  | { kind: 'password'; placeholder?: string }
  | { kind: 'tags'; suggestions?: readonly string[]; placeholder?: string }
  | { kind: 'path'; pick?: PathKind; accept?: readonly string[]; placeholder?: string }
  | { kind: 'json'; shape?: SettingJsonShape }
  | { kind: 'color' }
  | { kind: 'multi'; options: SettingChoice[] };

type SettingChoiceDef = Omit<SettingChoice, 'label' | 'hint'> & { label: Text; hint?: Text };

type SettingControlDef =
  | Exclude<SettingControl, { options: SettingChoice[] }>
  | { kind: 'choice'; options: SettingChoiceDef[]; look?: SettingChoiceLook }
  | { kind: 'select'; options: SettingChoiceDef[]; searchable?: boolean }
  | { kind: 'radio'; options: SettingChoiceDef[] }
  | { kind: 'multi'; options: SettingChoiceDef[] };

type SettingControlKind = SettingControl['kind'];

type SettingValues = Readonly<Record<string, unknown>>;

interface SettingAction {
  id?: string;
  label: string;
  icon?: IconName;
  tone?: ButtonVariant;
  variant?: ButtonVariant;
  disabled?: boolean | ((settings: SettingValues) => boolean);
  confirm?: string | ConfirmActionOptions;
  onSelect: (settings: SettingValues) => void | Promise<void>;
}

type SettingActionDef = Omit<SettingAction, 'label'> & { label: Text };

interface RunSettingActionOptions {
  settings?: SettingValues;
  inline?: boolean;
  onStart?: () => void;
}

type SettingDescription = SettingsDescription;

type SettingVisibleWhen = { key: string; equals: unknown } | { key: string; notEquals: unknown };

interface SettingItemFields {
  key: string;
  label: string;
  hint?: string;
  keywords?: string;
  link?: string;
  control?: SettingControl;
  layout?: SettingLayout;
  chrome?: boolean;
  actions?: readonly SettingAction[];
  visible?: (settings: SettingValues) => boolean;
  visibleWhen?: SettingVisibleWhen;
}

type SettingItem = SettingItemFields & SettingDescription;

type SettingDescriptionDef = { description: Text; noDescription?: never } | { noDescription: true; description?: never };

type SettingItemDef = Omit<SettingItemFields, 'label' | 'hint' | 'keywords' | 'control' | 'actions'> & {
  label: Text;
  hint?: Text;
  keywords?: Text;
  control?: SettingControlDef;
  actions?: readonly SettingActionDef[];
} & SettingDescriptionDef;

interface SettingsValueSource {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void | Promise<void>;
  subscribe?: (listener: () => void) => () => void;
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
  source?: SettingsValueSource;
}

interface SubSectionDef {
  id: string;
  title: Text;
  items: SettingItemDef[];
}

interface SectionDef {
  id: string;
  title: Text;
  items?: SettingItemDef[];
  subsections?: SubSectionDef[];
  source?: SettingsValueSource;
}

type SettingLockCause = string;

type SettingsPreviewPlacement = 'start' | 'end';

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
  isDisabled?: (key: string, settings: S, lock: SettingLockCause | null) => boolean;
  lockCauseOf?: (key: string, settings: S) => SettingLockCause | null;
  lockOverlay?: (props: LockOverlayProps) => ReactNode;
}

interface SettingsLayoutProps<S extends object> extends SettingsControlProps<S> {
  sections: SectionDef[];
  emptyMessage?: Text;
  preview?: ReactNode;
  previewPlacement?: SettingsPreviewPlacement;
  previewLabel?: Text;
}

interface TabRenderContext<S extends object> extends SettingsControlProps<S> {
  tab: TabDef<S>;
}

interface TabDef<S extends object> {
  id: string;
  label: Text;
  navIcon: ReactNode;
  icon?: string;
  group: Text;
  groupId?: string;
  sections?: (settings: S) => SectionDef[];
  source?: SettingsValueSource;
  preview?: (settings: S) => ReactNode;
  previewPlacement?: SettingsPreviewPlacement;
  previewLabel?: Text;
  render?: (ctx: TabRenderContext<S>) => ReactNode;
  mobileOnly?: boolean;
  moduleId?: string;
}

export type {
  LockOverlayProps, RenderControl, RunSettingActionOptions, Section, SectionDef, SettingAction, SettingActionDef, SettingChoice, SettingChoiceDef, SettingChoiceLook, SettingControl, SettingControlDef, SettingControlKind, SettingDescription, SettingDescriptionDef, SettingItem, SettingItemDef, SettingItemFields, SettingJsonShape, SettingLayout, SettingLockCause, SettingValues,
  SettingsControlProps, SettingsLayoutProps, SettingsPatch, SettingsPreviewPlacement, SettingsValueSource, SettingVisibleWhen, SubSection, SubSectionDef, TabDef, TabRenderContext,
};

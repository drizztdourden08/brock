/* @layer renderer-components @kind types */
import type { ReactNode } from 'react';
import type { ActionBinding, BindingSlot } from '../../bindings/bindings.type';
import type { DetectedDevice } from '../../bindings/detected/detected.type';
import type { InputProfile } from '../../bindings/input-profile.type';
import type { VerbDef } from '../../bindings/verbs/verbs.type';
import type { ResolvedControl } from '../../family/family.type';
import type { BindingCapture } from './sub-components/BindingListener.type';

interface ActionDef {
  id: string;
  label: string;
  middleLabel?: string;
  glyph?: string;
}

interface ReservedRow {
  label: string;
  bindingLabel: string;
  glyph?: string;
}

interface TabGate {
  active: boolean;
  message: string;
  onOpenSettings?: () => void;
}

interface VerbGroupDef {
  id: string;
  title: string;
  hint?: string;
  verbs: readonly string[];
}

type ListenTarget =
  | { type: 'action'; scope: 'profile' | 'global'; id: string }
  | { type: 'verb'; id: string }
  | { type: 'slot'; slot: BindingSlot };

interface ListenerExtraContext {
  target: ListenTarget;
  capture: (capture: BindingCapture) => void;
  close: () => void;
}

type NarrowTabId = 'profiles' | 'bindings' | 'devices';

interface ControlsContext {
  profile: InputProfile | null;
  devices: readonly DetectedDevice[];
  controls: readonly ResolvedControl[];
  updateProfile: (profile: InputProfile) => void;
}

interface SlotsConfig {
  assignmentLabel?: (index: number) => string;
  onRenumber?: (renumber: ReadonlyMap<number, number>) => void;
  keyboardSlots?: () => BindingSlot[];
  footer?: (ctx: ControlsContext) => ReactNode;
}

interface TabBase {
  id: string;
  label: string;
  disabledReason?: string | null;
}

type ControlsTabDef = TabBase & (
  | {
    kind: 'actions';
    scope: 'profile' | 'global';
    actions: readonly ActionDef[];
    title?: string;
    middleLabel?: string;
    reserved?: readonly ReservedRow[];
    gate?: TabGate;
    acceptsDeviceDrop?: boolean;
  }
  | { kind: 'verbs'; groups: readonly VerbGroupDef[]; slots?: SlotsConfig }
  | { kind: 'options'; haptics?: { enabled: boolean; onChange: (on: boolean) => void } }
  | { kind: 'custom'; render: (ctx: ControlsContext) => ReactNode }
);

interface PresetDevice {
  sdlType: string;
  deviceName: string;
  vid: string;
  pid: string;
}

interface ControlsLabels {
  profilesTitle: string;
  tabProfiles: string;
  tabBindings: string;
  tabDevices: string;
  profileList: string;
  newProfile: string;
  noProfiles: string;
  profileName: string;
  renameProfile: string;
  deleteProfile: string;
  devicesTitle: string;
  connectedDevices: string;
  noDevices: string;
  keyboard: string;
  controller: string;
  bindingHeader: string;
  actionHeader: string;
  slotHeader: string;
  assignmentHeader: string;
  slotsTitle: string;
  slotsHint: string;
  verbsHeader: string;
  groupHeader: string;
  noSlots: string;
  addSlot: string;
  emptySlotsHint: string;
  clearBinding: string;
  reservedHint: string;
  rebindHint: (name: string) => string;
  removeSlot: (name: string) => string;
  listenerPrompt: string;
  listenerHint: string;
  presetTitle: string;
  presetMessage: (deviceName: string) => string;
  presetConfirm: string;
  deleteTitle: string;
  deleteMessage: (profileName: string) => string;
  deleteConfirm: string;
  cancel: string;
  hapticsTitle: string;
  hapticsDescription: string;
  requiredInputsTitle: string;
  inputConnected: (name: string) => string;
  inputNotConnected: (name: string) => string;
  statusConnected: string;
  statusNotConnected: string;
}

interface ControlsGame {
  tabs: readonly ControlsTabDef[];
  verbs?: readonly VerbDef[];
  keyboardDefaults: readonly ActionBinding[];
  defaultBindings: (device: PresetDevice) => ActionBinding[];
  decoratePreset?: (
    profile: InputProfile,
    ctx: { device: PresetDevice; controls: readonly ResolvedControl[] },
  ) => InputProfile;
  onListeningChange?: (listening: boolean) => void;
  listenerExtra?: (ctx: ListenerExtraContext) => ReactNode;
  listenerFullscreen?: (target: ListenTarget) => boolean;
  labels?: Partial<ControlsLabels>;
}

interface InputProfileStore {
  load: () => Promise<InputProfile[]>;
  save: (profiles: readonly InputProfile[]) => Promise<void>;
  activeId: string | null;
  activate: (profile: InputProfile) => void;
  onActiveChange?: (listener: (profile: InputProfile) => void) => () => void;
}

interface GlobalBindingsStore {
  mappings: readonly ActionBinding[] | undefined;
  defaults: readonly ActionBinding[];
  onChange: (next: ActionBinding[]) => void;
}

interface ControlsSettingsProps {
  game: ControlsGame;
  profiles: InputProfileStore;
  globalBindings?: GlobalBindingsStore;
  initialTab?: string;
}

interface RequiredInput {
  type: 'keyboard' | 'gamepad';
  label: string;
  iconSrc: string;
  connected: boolean;
}

interface RequiredInputsParams {
  profile: InputProfile | null;
  devices: readonly DetectedDevice[];
  labels: ControlsLabels;
}

interface UseProfileStateArgs {
  store: InputProfileStore;
  keyboardDefaults: readonly ActionBinding[];
}

interface UseProfileLoaderArgs extends UseProfileStateArgs {
  setProfiles: (profiles: InputProfile[]) => void;
  setActiveProfile: (profile: InputProfile | null) => void;
}

interface UseControlsTabsArgs {
  tabs: readonly ControlsTabDef[];
  initialTab?: string;
}

interface StoredFold {
  collapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

interface DeviceIconIds {
  sdlType?: string | null;
  family?: string | null;
}

export type {
  ActionDef, ControlsContext, ControlsGame, ControlsLabels, ControlsSettingsProps, ControlsTabDef,
  DeviceIconIds, GlobalBindingsStore, InputProfileStore, ListenerExtraContext, ListenTarget, NarrowTabId, PresetDevice, RequiredInput, RequiredInputsParams,
  ReservedRow, SlotsConfig, StoredFold, TabGate, UseControlsTabsArgs, UseProfileLoaderArgs,
  UseProfileStateArgs, VerbGroupDef,
};
export type { VerbDef };

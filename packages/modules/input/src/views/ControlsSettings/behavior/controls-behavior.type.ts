/* @layer renderer-components @kind types */
import type { ActionBinding, BindingSlot, ButtonIcon, InputBinding, VerbBindings } from '../../../bindings';
import type { DetectedDevice } from '../../../bindings/detected/detected.type';
import type { InputProfile } from '../../../bindings/input-profile.type';
import type { DeviceEntry } from '../../../device.type';
import type { ResolvedControl } from '../../../family/family.type';
import type { ActionDef, ControlsGame, ControlsLabels, GlobalBindingsStore, PresetDevice } from '../ControlsSettings.type';

type ActionScope = 'profile' | 'global';

type ListeningTarget =
  | { type: 'action'; scope: ActionScope; id: string }
  | { type: 'verb'; id: string }
  | { type: 'slot'; slot: BindingSlot };

interface ActionRow {
  action: ActionDef;
  mappingIndex: number;
  binding: InputBinding;
  icon: ButtonIcon | null;
  deviceIconUrl: string | null;
}

interface ActionRowParams {
  action: ActionDef;
  mapping: ActionBinding | undefined;
  mappingIndex: number;
  multiController: boolean;
  devices: readonly DetectedDevice[];
}

interface BuildActionRowsParams {
  actions: readonly ActionDef[];
  mappings: readonly ActionBinding[];
  multiController: boolean;
  devices: readonly DetectedDevice[];
}

interface ActionCapture {
  scope: ActionScope;
  id: string;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface UseVerbSchemeArgs {
  game: ControlsGame;
  activeProfile: InputProfile | null;
  updateActiveProfile: (profile: InputProfile) => void;
  controls: readonly ResolvedControl[];
}

interface UseBindingStateArgs {
  globalBindings?: GlobalBindingsStore;
  activeProfile: InputProfile | null;
  updateActiveProfile: (profile: InputProfile) => void;
  applyVerbBinding: (verbId: string, binding: InputBinding) => void;
  applySlotBinding: (slot: BindingSlot, binding: InputBinding) => void;
}

interface UseRebindTargetArgs {
  setListeningFor: (target: ListeningTarget | null) => void;
}

interface UseVerbIconsArgs {
  activeProfile: InputProfile | null;
  devices: readonly DetectedDevice[];
  verbBindings: VerbBindings;
}

interface UseDragDropArgs {
  entries: readonly DeviceEntry[];
  game: ControlsGame;
  activeProfile: InputProfile | null;
  updateActiveProfile: (profile: InputProfile) => void;
}

interface UseProfileRowsArgs {
  activeProfile: InputProfile | null;
  devices: readonly DetectedDevice[];
  labels: ControlsLabels;
}

interface UseGlobalRowsArgs {
  mappings: readonly ActionBinding[];
  multiController: boolean;
  devices: readonly DetectedDevice[];
}

interface BuildPresetProfileParams {
  preset: PresetDevice;
  profile: InputProfile;
  game: ControlsGame;
  entries: readonly DeviceEntry[];
}

interface ReadDroppedPresetParams {
  transfer: DataTransfer;
}

interface ListeningLabelParams {
  target: ListeningTarget;
  game: ControlsGame;
}


export type {
  ActionCapture, ActionRow, ActionRowParams, ActionScope, BuildActionRowsParams, BuildPresetProfileParams,
  ListeningLabelParams, ListeningTarget, ReadDroppedPresetParams, UseBindingStateArgs,
  UseDragDropArgs, UseGlobalRowsArgs, UseProfileRowsArgs, UseRebindTargetArgs, UseVerbIconsArgs, UseVerbSchemeArgs,
};

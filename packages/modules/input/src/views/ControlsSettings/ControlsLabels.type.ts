/* @layer renderer-components @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface ControlsLabels {
  profilesTitle: Text;
  tabBindings: Text;
  profileList: Text;
  newProfile: Text;
  noProfiles: Text;
  profileName: Text;
  renameProfile: Text;
  deleteProfile: Text;
  devicesTitle: Text;
  connectedDevices: Text;
  noDevices: Text;
  keyboard: Text;
  controller: Text;
  bindingHeader: Text;
  actionHeader: Text;
  slotHeader: Text;
  assignmentHeader: Text;
  slotsTitle: Text;
  slotsHint: Text;
  verbsHeader: Text;
  groupHeader: Text;
  noSlots: Text;
  addSlot: Text;
  emptySlotsHint: Text;
  clearBinding: Text;
  reservedHint: Text;
  rebindHint: (name: string) => Text;
  removeSlot: (name: string) => Text;
  listenerPrompt: Text;
  listenerHint: Text;
  presetTitle: Text;
  presetMessage: (deviceName: string) => Text;
  presetConfirm: Text;
  deleteTitle: Text;
  deleteMessage: (profileName: string) => Text;
  deleteConfirm: Text;
  cancel: Text;
  hapticsTitle: Text;
  hapticsDescription: Text;
  requiredInputsTitle: Text;
  inputConnected: (name: string) => Text;
  inputNotConnected: (name: string) => Text;
  statusConnected: Text;
  statusNotConnected: Text;
}

type ResolvedControlsLabels = {
  [K in keyof ControlsLabels]: ControlsLabels[K] extends (...args: infer A) => Text ? (...args: A) => string : string;
};

export type { ControlsLabels, ResolvedControlsLabels };

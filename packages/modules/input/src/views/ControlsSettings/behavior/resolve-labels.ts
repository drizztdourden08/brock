/* @layer renderer-components @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ControlsLabels, ResolvedControlsLabels } from '../ControlsSettings.type';

type Resolve = (value: Text) => string;
type PlainLabels = { [K in keyof ResolvedControlsLabels as ResolvedControlsLabels[K] extends string ? K : never]: string };
type NamedLabels = Omit<ResolvedControlsLabels, keyof PlainLabels>;

const plainLabels = (labels: ControlsLabels, text: Resolve): PlainLabels => ({
  profilesTitle: text(labels.profilesTitle),
  tabBindings: text(labels.tabBindings),
  profileList: text(labels.profileList),
  newProfile: text(labels.newProfile),
  noProfiles: text(labels.noProfiles),
  profileName: text(labels.profileName),
  renameProfile: text(labels.renameProfile),
  deleteProfile: text(labels.deleteProfile),
  devicesTitle: text(labels.devicesTitle),
  connectedDevices: text(labels.connectedDevices),
  noDevices: text(labels.noDevices),
  keyboard: text(labels.keyboard),
  controller: text(labels.controller),
  bindingHeader: text(labels.bindingHeader),
  actionHeader: text(labels.actionHeader),
  slotHeader: text(labels.slotHeader),
  assignmentHeader: text(labels.assignmentHeader),
  slotsTitle: text(labels.slotsTitle),
  slotsHint: text(labels.slotsHint),
  verbsHeader: text(labels.verbsHeader),
  groupHeader: text(labels.groupHeader),
  noSlots: text(labels.noSlots),
  addSlot: text(labels.addSlot),
  emptySlotsHint: text(labels.emptySlotsHint),
  clearBinding: text(labels.clearBinding),
  reservedHint: text(labels.reservedHint),
  listenerPrompt: text(labels.listenerPrompt),
  listenerHint: text(labels.listenerHint),
  presetTitle: text(labels.presetTitle),
  presetConfirm: text(labels.presetConfirm),
  deleteTitle: text(labels.deleteTitle),
  deleteConfirm: text(labels.deleteConfirm),
  cancel: text(labels.cancel),
  hapticsTitle: text(labels.hapticsTitle),
  hapticsDescription: text(labels.hapticsDescription),
  requiredInputsTitle: text(labels.requiredInputsTitle),
  statusConnected: text(labels.statusConnected),
  statusNotConnected: text(labels.statusNotConnected),
});

const namedLabels = (labels: ControlsLabels, text: Resolve): NamedLabels => ({
  rebindHint: (name: string) => text(labels.rebindHint(name)),
  removeSlot: (name: string) => text(labels.removeSlot(name)),
  presetMessage: (name: string) => text(labels.presetMessage(name)),
  deleteMessage: (name: string) => text(labels.deleteMessage(name)),
  inputConnected: (name: string) => text(labels.inputConnected(name)),
  inputNotConnected: (name: string) => text(labels.inputNotConnected(name)),
});

const resolveLabels = (labels: ControlsLabels, text: Resolve): ResolvedControlsLabels => ({
  ...plainLabels(labels, text),
  ...namedLabels(labels, text),
});

export { resolveLabels };

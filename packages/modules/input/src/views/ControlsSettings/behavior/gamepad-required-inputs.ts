/* @layer renderer-components @kind logic */
import { splitDeviceKey } from '../../../bindings/device-keys/split-device-key';
import type { DetectedDevice } from '../../../bindings/detected/detected.type';
import { findLiveDevice } from '../../../bindings/detected/find-live-device';
import type { InputProfile } from '../../../bindings/input-profile.type';
import { recallControllerName } from '../../../runtime/controller-name-cache/recall-controller-name';
import type { ControlsLabels, RequiredInput } from '../ControlsSettings.type';
import { deviceIconUrl } from './device-icon-url';
import { liveDeviceIcon } from './live-device-icon';

const assignedGamepadInput = (key: string, devices: readonly DetectedDevice[], labels: ControlsLabels): RequiredInput => {
  const [vid, pid] = splitDeviceKey(key);
  const live = findLiveDevice(vid, pid, devices);
  const displayName = recallControllerName({ vendorId: parseInt(vid, 16), productId: parseInt(pid, 16) })
    ?? live?.displayName ?? labels.controller;
  return {
    type: 'gamepad',
    label: `${displayName} (${vid}:${pid})`,
    iconSrc: liveDeviceIcon(vid, pid, devices) ?? '',
    connected: Boolean(live),
  };
};

const gamepadRequiredInputs = (
  profile: InputProfile,
  usedDeviceKeys: ReadonlySet<string>,
  devices: readonly DetectedDevice[],
  labels: ControlsLabels,
): RequiredInput[] => {
  if (usedDeviceKeys.size > 0) return [...usedDeviceKeys].map((key) => assignedGamepadInput(key, devices, labels));
  return [{
    type: 'gamepad',
    label: profile.name,
    iconSrc: deviceIconUrl({ family: profile.deviceFamily }) ?? '',
    connected: devices.some((d) => d.type === 'gamepad' && d.connected),
  }];
};

export { gamepadRequiredInputs };

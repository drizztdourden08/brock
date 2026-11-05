/* @layer renderer-components @kind logic */
import { allowedDevices } from '../../../bindings/device-keys/allowed-devices';
import type { RequiredInput, RequiredInputsParams } from '../ControlsSettings.type';
import { gamepadRequiredInputs } from './gamepad-required-inputs';
import { keyboardRequiredInput } from './keyboard-required-input';

const buildRequiredInputs = ({ profile, devices, labels }: RequiredInputsParams): RequiredInput[] => {
  if (!profile) return [];
  const { keyboard: hasKeyboard, gamepadKeys } = allowedDevices(profile);
  const hasGamepad = profile.mappings.some((m) => m.binding.type !== 'keyboard');
  return [
    ...(hasKeyboard ? [keyboardRequiredInput(devices, labels)] : []),
    ...(hasGamepad ? gamepadRequiredInputs(profile, gamepadKeys, devices, labels) : []),
  ];
};

export { buildRequiredInputs };

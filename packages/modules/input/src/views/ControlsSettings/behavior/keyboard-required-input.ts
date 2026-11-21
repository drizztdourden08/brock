/* @layer renderer-components @kind logic */
import type { DetectedDevice } from '../../../bindings/detected/detected.type';
import { KEYBOARD_ICON_FAMILY } from '../ControlsSettings.constants';
import type { ResolvedControlsLabels, RequiredInput } from '../ControlsSettings.type';
import { deviceIconUrl } from './device-icon-url';

const keyboardRequiredInput = (devices: readonly DetectedDevice[], labels: ResolvedControlsLabels): RequiredInput => ({
  type: 'keyboard',
  label: labels.keyboard,
  iconSrc: deviceIconUrl({ family: KEYBOARD_ICON_FAMILY }) ?? '',
  connected: devices.some((d) => d.type === 'keyboard' && d.connected),
});

export { keyboardRequiredInput };

/* @layer renderer-components @kind logic */
import type { InputProfile } from '../../../bindings';
import type { ControlsLabels } from '../ControlsSettings.type';

const profileSubtitle = (profile: InputProfile, labels: ControlsLabels): string =>
  profile.assignedDevice?.displayName ?? (profile.deviceType === 'keyboard' ? labels.keyboard : labels.controller);

export { profileSubtitle };

/* @layer renderer-components @kind logic */
import type { InputProfile } from '../../../bindings';
import type { ResolvedControlsLabels } from '../ControlsSettings.type';

const profileSubtitle = (profile: InputProfile, labels: ResolvedControlsLabels): string =>
  profile.assignedDevice?.displayName ?? (profile.deviceType === 'keyboard' ? labels.keyboard : labels.controller);

export { profileSubtitle };

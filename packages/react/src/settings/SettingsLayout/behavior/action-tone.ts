/* @layer renderer-shell @kind logic */
import type { ButtonVariant } from '@drizztdourden08/tessera/primitives';
import type { SettingAction } from '../../settings.type';

const actionTone = (action: SettingAction): ButtonVariant | undefined => action.tone ?? action.variant;

export { actionTone };

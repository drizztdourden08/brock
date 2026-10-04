/* @layer renderer-shell @kind logic */
import type { SettingAction, SettingValues } from '../../settings.type';

const actionDisabled = (action: SettingAction, settings: SettingValues = {}): boolean =>
  (typeof action.disabled === 'function' ? action.disabled(settings) : action.disabled === true);

export { actionDisabled };

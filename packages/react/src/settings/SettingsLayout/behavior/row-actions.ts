/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsRowAction } from '@drizztdourden08/tessera/composites';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { SettingAction, SettingValues } from '../../settings.type';
import { actionDisabled } from './action-disabled';
import { runSettingAction } from './run-setting-action';

const rowAction = (action: SettingAction, index: number, settings: SettingValues): SettingsRowAction => ({
  id: action.id ?? `${index}:${action.label}`,
  label: action.label,
  icon: action.icon ? createElement(Icon, { name: action.icon }) : undefined,
  tone: action.variant === 'danger' ? 'danger' : undefined,
  disabled: actionDisabled(action, settings),
  confirm: typeof action.confirm === 'string' ? action.confirm : undefined,
  onClick: () => void runSettingAction(action, { settings, inline: true }),
});

const rowActions = (actions: readonly SettingAction[] | undefined, settings: SettingValues = {}): SettingsRowAction[] | undefined =>
  (actions && actions.length > 0 ? actions.map((action, index) => rowAction(action, index, settings)) : undefined);

export { rowActions };

/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsRowAction } from '@drizztdourden08/tessera/composites';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { SettingAction } from '../../settings.type';
import { runSettingAction } from './run-setting-action';

const rowAction = (action: SettingAction, index: number): SettingsRowAction => ({
  id: action.id ?? `${index}:${action.label}`,
  label: action.label,
  icon: action.icon ? createElement(Icon, { name: action.icon }) : undefined,
  tone: action.variant === 'danger' ? 'danger' : undefined,
  disabled: action.disabled,
  confirm: typeof action.confirm === 'string' ? action.confirm : undefined,
  onClick: () => void runSettingAction(action, { inline: true }),
});

const rowActions = (actions: readonly SettingAction[] | undefined): SettingsRowAction[] | undefined =>
  (actions && actions.length > 0 ? actions.map(rowAction) : undefined);

export { rowActions };

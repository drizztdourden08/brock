/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsRowAction } from '@drizztdourden08/tessera/composites';
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { SettingAction, SettingValues } from '../../settings.type';
import type { RowActionScope } from '../SettingsLayout.type';
import { actionDisabled } from './action-disabled';
import { runSettingAction } from './run-setting-action';

const rowAction = (action: SettingAction, index: number, settings: SettingValues, scope: RowActionScope | undefined): SettingsRowAction => {
  const id = action.id ?? `${index}:${action.label}`;
  const key = `${scope?.id ?? ''}/${id}`;
  const options = { settings, inline: true };
  return {
    id,
    label: action.label,
    icon: action.icon ? createElement(Icon, { name: action.icon }) : undefined,
    tone: action.variant === 'danger' ? 'danger' : undefined,
    disabled: actionDisabled(action, settings),
    loading: scope?.runner?.busy[key] === true,
    confirm: typeof action.confirm === 'string' ? action.confirm : undefined,
    onSelect: () => void (scope?.runner ? scope.runner.run(key, action, options) : runSettingAction(action, options)),
  };
};

const rowActions = (actions: readonly SettingAction[] | undefined, settings: SettingValues = {}, scope?: RowActionScope): SettingsRowAction[] | undefined =>
  (actions && actions.length > 0 ? actions.map((action, index) => rowAction(action, index, settings, scope)) : undefined);

export { rowActions };

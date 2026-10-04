/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { SettingsDescription, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import type { SettingItem, SettingValues } from '../../settings.type';
import type { SettingRowContext } from '../SettingsLayout.type';
import { LinkedToggle } from '../sub-components/LinkedToggle';
import { SettingActions } from '../sub-components/SettingActions';
import { rowActions } from './row-actions';
import { settingInput } from './setting-input';
import { warnMissingControl } from './warn-missing-control';

const descriptionOf = (item: SettingItem): SettingsDescription =>
  (item.noDescription === true ? { noDescription: true } : { description: item.description });

const withActions = (content: ReactNode, item: SettingItem, disabled: boolean, settings: SettingValues): ReactNode => {
  const actions = item.actions ?? [];
  if (actions.length === 0) return content;
  return createElement(Stack, { gap: 'xs' }, content, createElement(SettingActions, { actions, disabled, settings }));
};

const settingRow = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsSectionRow | null => {
  const { settings, onChange, renderControl, disabled, lock, runner } = ctx;
  const values = settings as SettingValues;
  const value = values[item.key];
  const set = (next: unknown): void => onChange({ [item.key]: next } as Partial<S>);
  const shared = { id: item.key, title: item.label, hint: item.hint, keywords: item.keywords, lock, ...descriptionOf(item) };
  const custom = renderControl?.(item.key, settings, onChange);
  if (custom !== null && custom !== undefined) return { ...shared, content: withActions(custom, item, disabled, values) };
  if (item.link !== undefined && typeof value === 'boolean') {
    return { ...shared, content: withActions(createElement(LinkedToggle, { item, checked: value, disabled, onChange: set }), item, disabled, values) };
  }
  const input = settingInput(item.control, value, set, { label: item.label, disabled });
  const actions = rowActions(item.actions, values, runner ? { id: item.key, runner } : undefined);
  if (!input && !actions) {
    warnMissingControl(item.key, value);
    return null;
  }
  return { ...shared, ...(input ? { input } : {}), ...(actions ? { actions } : {}), disabled };
};

export { settingRow };

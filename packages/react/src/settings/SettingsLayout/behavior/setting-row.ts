/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsDescription, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { SettingItem, SettingValues } from '../../settings.type';
import type { SettingRowContext } from '../SettingsLayout.type';
import { LinkedToggle } from '../sub-components/LinkedToggle';
import { controlRow } from './control-row';
import { rowActions } from './row-actions';
import { settingInput } from './setting-input';
import { warnMissingControl } from './warn-missing-control';
import { withActions } from './with-actions';

const descriptionOf = (item: SettingItem): SettingsDescription =>
  (item.noDescription === true ? { noDescription: true } : { description: item.description });

const settingRow = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsSectionRow | null => {
  const { settings, onChange, renderControl, disabled, lock, runner } = ctx;
  const values = settings as SettingValues;
  const value = values[item.key];
  const set = (next: unknown): void => onChange({ [item.key]: next } as Partial<S>);
  const shared = { id: item.key, title: item.label, hint: item.hint, keywords: item.keywords, lock, ...descriptionOf(item) };
  const custom = renderControl?.(item.key, settings, onChange);
  if (custom !== null && custom !== undefined) return controlRow(item, custom, { shared, settings, disabled, runner });
  if (item.link !== undefined && typeof value === 'boolean') {
    return { ...shared, content: withActions(createElement(LinkedToggle, { item, checked: value, disabled, onChange: set }), item, disabled, values) };
  }
  const input = settingInput(item.control, value, set, { label: item.label, disabled });
  const actions = rowActions(item.actions, values, { id: item.key, runner });
  if (!input && !actions) {
    warnMissingControl(item.key, value);
    return null;
  }
  return { ...shared, ...(input ? { input } : {}), ...(actions ? { actions } : {}), disabled };
};

export { settingRow };

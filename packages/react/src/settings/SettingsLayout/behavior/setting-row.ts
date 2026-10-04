/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { SettingsDescription, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { SettingItem } from '../../settings.type';
import type { SettingRowContext } from '../SettingsLayout.type';
import { LinkedToggle } from '../sub-components/LinkedToggle';
import { settingInput } from './setting-input';

const descriptionOf = (item: SettingItem): SettingsDescription =>
  (item.noDescription === true ? { noDescription: true } : { description: item.description });

const settingRow = <S extends object>(item: SettingItem, ctx: SettingRowContext<S>): SettingsSectionRow | null => {
  const { settings, onChange, renderControl, disabled, lock } = ctx;
  const value = (settings as Record<string, unknown>)[item.key];
  const set = (next: unknown): void => onChange({ [item.key]: next } as Partial<S>);
  const shared = { id: item.key, title: item.label, hint: item.hint, keywords: item.keywords, lock, ...descriptionOf(item) };
  const custom = renderControl?.(item.key, settings, onChange);
  if (custom !== null && custom !== undefined) return { ...shared, content: custom };
  if (item.link !== undefined && typeof value === 'boolean') {
    return { ...shared, content: createElement(LinkedToggle, { item, checked: value, disabled, onChange: set }) };
  }
  const input = settingInput(item.control, value, set);
  return input ? { ...shared, input, disabled } : null;
};

export { settingRow };

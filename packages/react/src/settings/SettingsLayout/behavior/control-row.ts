/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { SettingItem, SettingValues } from '../../settings.type';
import type { ControlRowInput } from '../SettingsLayout.type';
import { SettingWideControl } from '../sub-components/SettingWideControl';
import { rowActions } from './row-actions';
import { withActions } from './with-actions';

const controlRow = (item: SettingItem, custom: ReactNode, input: ControlRowInput): SettingsSectionRow => {
  const { shared, settings, disabled, runner } = input;
  const values = settings as SettingValues;
  if (item.chrome === false) return { ...shared, content: withActions(custom, item, disabled, values) };
  const control = item.layout === 'wide' ? createElement(SettingWideControl, null, custom) : custom;
  const actions = rowActions(item.actions, values, { id: item.key, runner });
  return { ...shared, input: { kind: 'custom', control }, ...(actions ? { actions } : {}), disabled };
};

export { controlRow };

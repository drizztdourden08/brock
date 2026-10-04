/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { SettingPathField } from '../sub-components/SettingPathField';
import type { SettingInputOf } from './setting-input.type';

const pathInput: SettingInputOf<'path'> = (control, value, onChange, { label, disabled }) => (typeof value === 'string'
  ? { kind: 'custom', control: createElement(SettingPathField, { control, value, onChange, label, disabled }), text: value }
  : null);

export { pathInput };

/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { SettingJsonField } from '../sub-components/SettingJsonField';
import type { SettingInputOf } from './setting-input.type';

const jsonInput: SettingInputOf<'json'> = (control, value, onChange, { label, disabled }) => (value === undefined
  ? null
  : { kind: 'custom', control: createElement(SettingJsonField, { control, value, onChange, label, disabled }) });

export { jsonInput };

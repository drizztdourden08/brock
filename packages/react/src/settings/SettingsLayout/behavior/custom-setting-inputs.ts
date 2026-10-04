/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { JsonInput } from '@drizztdourden08/tessera/primitives';
import { SettingPathField } from '../sub-components/SettingPathField';
import type { SettingInputOf } from './setting-input.type';

const path: SettingInputOf<'path'> = (control, value, onChange, { label, disabled }) => (typeof value === 'string'
  ? { kind: 'custom', control: createElement(SettingPathField, { control, value, onChange, label, disabled }), text: value }
  : null);

const json: SettingInputOf<'json'> = (control, value, onChange, { label, disabled }) => (value === undefined
  ? null
  : { kind: 'custom', control: createElement(JsonInput, { value, onChange, shape: control.shape, disabled, 'aria-label': label }) });

export { json, path };

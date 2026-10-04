/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { JsonInput } from '@drizztdourden08/tessera/primitives';
import type { SettingInputOf } from './setting-input.type';

const jsonInput: SettingInputOf<'json'> = (control, value, onChange, { label, disabled }) => (value === undefined
  ? null
  : { kind: 'custom', control: createElement(JsonInput, { value, onChange, shape: control.shape, disabled, 'aria-label': label }) });

export { jsonInput };

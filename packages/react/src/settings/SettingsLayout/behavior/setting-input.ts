/* @layer renderer-shell @kind logic */
import type { SettingsInput } from '@drizztdourden08/tessera/composites';
import type { SettingChoiceLook, SettingControl, SettingControlKind } from '../../settings.type';
import { SEGMENTED_MOST } from './setting-input.constants';
import { json, path } from './custom-setting-inputs';
import type { SettingChange, SettingInputOf, SettingInputRow } from './setting-input.type';

const isText = (value: unknown): value is string => typeof value === 'string';

const isList = (value: unknown): value is readonly string[] => Array.isArray(value) && value.every(isText);

const lookOf = (control: Extract<SettingControl, { kind: 'choice' }>): SettingChoiceLook =>
  control.look ?? (control.options.length > SEGMENTED_MOST ? 'select' : 'segmented');

const choice: SettingInputOf<'choice'> = (control, value, onChange) =>
  (isText(value) ? { kind: lookOf(control), value, options: control.options, onChange } : null);

const select: SettingInputOf<'select'> = (control, value, onChange) =>
  (isText(value) ? { kind: 'select', value, options: control.options, searchable: control.searchable, onChange } : null);

const radio: SettingInputOf<'radio'> = (control, value, onChange) => (isText(value) ? { kind: 'radio', value, options: control.options, onChange } : null);

const range: SettingInputOf<'range'> = (control, value, onChange) => (typeof value === 'number'
  ? { kind: 'slider', value, min: control.min, max: control.max, step: control.step, formatValue: control.format, onChange }
  : null);

const number: SettingInputOf<'number'> = (control, value, onChange) => (typeof value === 'number'
  ? { kind: 'number', value, min: control.min, max: control.max, step: control.step, unit: control.unit, onChange }
  : null);

const text: SettingInputOf<'text'> = (control, value, onChange) => (isText(value) ? { kind: 'text', value, placeholder: control.placeholder, onChange } : null);

const password: SettingInputOf<'password'> = (control, value, onChange) =>
  (isText(value) ? { kind: 'password', value, placeholder: control.placeholder, onChange } : null);

const tags: SettingInputOf<'tags'> = (control, value, onChange) =>
  (isList(value) ? { kind: 'tags', value, suggestions: control.suggestions, placeholder: control.placeholder, onChange } : null);

const inputBuilders: { [K in SettingControlKind]: SettingInputOf<K> } = { choice, select, radio, range, number, text, password, tags, path, json };

const NO_ROW: SettingInputRow = { label: '', disabled: false };

const inputFor = <K extends SettingControlKind>(control: Extract<SettingControl, { kind: K }>, value: unknown, onChange: SettingChange, row: SettingInputRow): SettingsInput | null =>
  (inputBuilders[control.kind] as SettingInputOf<K>)(control, value, onChange, row);

const settingInput = (control: SettingControl | undefined, value: unknown, onChange: SettingChange, row: SettingInputRow = NO_ROW): SettingsInput | null => {
  if (control) return inputFor(control, value, onChange, row);
  return typeof value === 'boolean' ? { kind: 'toggle', value, onChange } : null;
};

export { settingInput };

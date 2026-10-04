/* @layer renderer-shell @kind logic */
import { TEXT_INPUT_TYPES } from './escape.constants';
import type { TextField } from './escape.type';

const isTextField = (target: unknown): target is TextField => {
  if (typeof target !== 'object' || target === null) return false;
  const field = target as Partial<TextField>;
  if (typeof field.value !== 'string') return false;
  if (field.tagName === 'TEXTAREA') return true;
  return field.tagName === 'INPUT' && TEXT_INPUT_TYPES.includes(field.type ?? 'text');
};

const setNativeValue = (field: TextField, value: string): void => {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), 'value')?.set;
  if (setter) setter.call(field, value);
  else field.value = value;
};

const clearTextField = (target: EventTarget | null): boolean => {
  if (!isTextField(target) || target.value === '' || target.readOnly === true || target.disabled === true) return false;
  setNativeValue(target, '');
  target.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

export { clearTextField };

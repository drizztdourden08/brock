/* @layer electron-main @kind logic */
import { CTRL_KEYS, CTRL_MODIFIERS, KEY_RELEASES } from './widget-windows.constants';
import type { ModifierInput } from './widget-windows.type';

const ctrlFromInput = (input: ModifierInput): boolean | null => {
  const key = input.key ?? input.keyCode;
  if (key !== undefined && CTRL_KEYS.includes(key)) return !KEY_RELEASES.includes(input.type ?? '');
  if (input.modifiers) return input.modifiers.some((modifier) => CTRL_MODIFIERS.includes(modifier));
  return typeof input.control === 'boolean' ? input.control : null;
};

export { ctrlFromInput };

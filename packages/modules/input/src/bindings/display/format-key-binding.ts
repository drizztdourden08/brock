/* @layer core @kind logic */
import type { KeyboardBinding } from '../bindings.type';
import { formatKeyCode } from './format-key-code';

const formatKeyBinding = (binding: KeyboardBinding): string => {
  const parts: string[] = [];
  if (binding.modifiers?.ctrl) parts.push('Ctrl');
  if (binding.modifiers?.shift) parts.push('Shift');
  if (binding.modifiers?.alt) parts.push('Alt');
  parts.push(binding.label ?? formatKeyCode(binding.code));
  return parts.join(' + ');
};

export { formatKeyBinding };

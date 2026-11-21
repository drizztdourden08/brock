/* @layer core @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { KeyboardBinding } from '../bindings.type';
import { MODIFIER_LABELS } from './display.constants';
import { formatKeyCode } from './format-key-code';

const formatKeyBinding = (binding: KeyboardBinding, text: (value: Text) => string): string => {
  const parts: string[] = [];
  if (binding.modifiers?.ctrl) parts.push(text(MODIFIER_LABELS.ctrl));
  if (binding.modifiers?.shift) parts.push(text(MODIFIER_LABELS.shift));
  if (binding.modifiers?.alt) parts.push(text(MODIFIER_LABELS.alt));
  parts.push(binding.label ?? formatKeyCode(binding.code, text));
  return parts.join(' + ');
};

export { formatKeyBinding };

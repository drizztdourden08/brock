/* @layer core @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ButtonIcon, InputBinding } from '../bindings.type';
import { formatKeyBinding } from './format-key-binding';

const getBindingLabel = (binding: InputBinding, text: (value: Text) => string, icon?: ButtonIcon | null): string => {
  if (binding.type === 'none') return '-';
  if (icon?.label) return icon.label;
  switch (binding.type) {
    case 'keyboard':
      return formatKeyBinding(binding, text);
    case 'gamepad-button':
      return binding.label ?? text(msg('input:key.button', { index: binding.index }));
    case 'gamepad-axis':
      return binding.label ?? text(msg('input:key.axis', { index: binding.axisIndex, direction: binding.direction }));
  }
};

export { getBindingLabel };

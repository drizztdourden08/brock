/* @layer core @kind logic */
import type { DeviceProfileAxis } from '../../device-profile/device-profile.type';
import { resolveStickDirectionIcon } from '../../family/stick-direction-icon';
import type { ButtonIcon, GamepadAxisBinding } from '../bindings.type';

const axisIcon = (axis: DeviceProfileAxis, binding: GamepadAxisBinding): ButtonIcon => {
  const label = `${axis.label} ${binding.direction}`;
  if (axis.category === 'trigger') return { key: axis.icon, label, path: null };
  const sign = binding.direction === '+' ? 1 : -1;
  const x = axis.id.endsWith('X') ? sign : 0;
  const y = axis.id.endsWith('Y') ? sign : 0;
  return { key: resolveStickDirectionIcon(axis.icon, x, y), label, path: null };
};

export { axisIcon };

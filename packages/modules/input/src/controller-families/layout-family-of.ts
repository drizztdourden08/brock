/* @layer renderer-shell @kind logic */
import type { PadFamily } from '../pad/controller-slot.type';
import { ANALOG_POSITIONS } from './controller-families.constants';
import type { DevicePositions, LayoutFamily } from './controller-families.type';

const layoutFamilyOf = (family: PadFamily | undefined, positions: DevicePositions): LayoutFamily => {
  const hasAnalog = ANALOG_POSITIONS.some((position) => positions.has(position));
  if (!hasAnalog) return 'snes';
  return family ?? 'generic';
};

export { layoutFamilyOf };

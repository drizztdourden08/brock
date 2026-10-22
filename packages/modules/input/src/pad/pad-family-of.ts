/* @layer core @kind logic */
import type { ControllerGamepadType } from '../device.type';
import type { PadFamily } from './controller-slot.type';
import { FAMILY_OF_TYPE } from './pad-slots.constants';

const padFamilyOf = (type: ControllerGamepadType): PadFamily => FAMILY_OF_TYPE[type];

export { padFamilyOf };

/* @layer renderer-components @kind constants */
import type { ControllerSlotId } from '../../../pad/controller-slot.type';

const CLICK_OF: Partial<Record<ControllerSlotId, ControllerSlotId>> = {
  'stick.left': 'stick.left.click',
  'stick.right': 'stick.right.click',
};

export { CLICK_OF };

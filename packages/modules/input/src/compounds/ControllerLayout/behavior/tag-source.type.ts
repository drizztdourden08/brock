/* @layer renderer-shell @kind types */
import type { ControllerSlotState } from '../ControllerLayout.type';

interface TagSource {
  state: ControllerSlotState | undefined;
  active: boolean;
}

export type { TagSource };

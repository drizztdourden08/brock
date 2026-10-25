/* @layer renderer-components @kind types */
import type { PressedGridItem } from '../../../compounds/PressedGrid';

interface PressedModel {
  items: readonly PressedGridItem[];
  pressed: readonly string[];
}

export type { PressedModel };

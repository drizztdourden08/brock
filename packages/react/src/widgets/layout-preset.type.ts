/* @layer renderer-shell @kind types */
import type { LayoutNode } from '@drizztdourden08/tessera/composites';

type LayoutCell = string | readonly string[];

interface LayoutPreset {
  rows: readonly (readonly LayoutCell[])[];
  sizes?: readonly number[];
  widths?: readonly (readonly number[] | undefined)[];
}

interface SizedNode {
  node: LayoutNode;
  size: number | undefined;
}

export type { LayoutCell, LayoutPreset, SizedNode };

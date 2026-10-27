/* @layer renderer-shell @kind types */
import type { LayoutNode } from '@drizztdourden08/tessera/composites';

type LayoutPane = string | readonly string[];

interface LayoutColumn {
  column: readonly LayoutPane[];
  sizes?: readonly number[];
}

type LayoutCell = LayoutPane | LayoutColumn;

interface LayoutRow {
  cells: readonly LayoutCell[];
  under?: 'main';
}

type LayoutRowDef = readonly LayoutCell[] | LayoutRow;

type RevisionMode = 'offer' | 'apply';

interface LayoutPreset {
  rows: readonly LayoutRowDef[];
  sizes?: readonly number[];
  widths?: readonly (readonly number[] | undefined)[];
  revision?: number;
  onRevision?: RevisionMode;
}

interface SizedNode {
  node: LayoutNode;
  size: number | undefined;
}

export type { LayoutCell, LayoutColumn, LayoutPane, LayoutPreset, LayoutRow, LayoutRowDef, RevisionMode, SizedNode };

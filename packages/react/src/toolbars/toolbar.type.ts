/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarColumns, ToolbarDefinition, ToolbarLayout, ToolbarMenuWords, ToolbarSide, ToolbarSlot } from '@drizztdourden08/tessera/composites';
import type { ContextMenuEntry } from '../context-menu/context-menu.type';
import type { ShowRule } from '../screens/show/show.type';

interface ToolbarItemRef {
  id: string;
  label: string;
}

interface ToolbarDef extends ToolbarDefinition {
  render: (slot: ToolbarSlot) => ReactNode;
  when?: ShowRule;
  items?: readonly ToolbarItemRef[];
  contextEntries?: (itemId: string) => readonly ContextMenuEntry[];
}

interface ToolbarLayoutState {
  definitions: readonly ToolbarDef[];
  layout: ToolbarLayout;
  pending: { stored: unknown } | null;
  setDefinitions: (definitions: readonly ToolbarDef[]) => void;
  replace: (stored: unknown) => void;
  setLayout: (layout: ToolbarLayout) => void;
  toggle: (id: string) => void;
  hide: (id: string) => void;
  setLabels: (id: string, on: boolean) => void;
  setItems: (id: string, hidden: readonly string[]) => void;
  setColumns: (id: string, columns: ToolbarColumns | undefined) => void;
  moveToSide: (id: string, side: ToolbarSide) => void;
  reset: () => void;
}

interface ToolbarItemArgs {
  id: string;
  item: string;
}

interface ToolbarColumnsArgs {
  id: string;
  columns: ToolbarColumns;
}

interface ToolbarMoveArgs {
  id: string;
  side: ToolbarSide;
}

type ToolbarPlacement = 'widgets' | 'app';

interface ToolbarSnapshot {
  id: string;
  label: string;
  shown: boolean;
  side: ToolbarSide | null;
  row: number | null;
  index: number | null;
  labels: boolean;
  hiddenItems: string[];
  columns: ToolbarColumns | null;
  available: boolean;
}

type ToolbarListener = (snapshot: readonly ToolbarSnapshot[]) => void;

interface ToolbarMenuInput {
  definitions: readonly ToolbarDef[];
  layout: ToolbarLayout;
  toggle: (id: string) => void;
  words: ToolbarMenuWords;
  reset: () => void;
}

export type { ToolbarColumnsArgs, ToolbarDef, ToolbarItemArgs, ToolbarItemRef, ToolbarLayoutState, ToolbarListener, ToolbarMenuInput, ToolbarMoveArgs, ToolbarPlacement, ToolbarSnapshot };

/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarDefinition, ToolbarLayout, ToolbarMenuWords, ToolbarSide, ToolbarSlot } from '@drizztdourden08/tessera/composites';

interface ToolbarDef extends ToolbarDefinition {
  render: (slot: ToolbarSlot) => ReactNode;
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
  moveToSide: (id: string, side: ToolbarSide) => void;
  reset: () => void;
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
}

type ToolbarListener = (snapshot: readonly ToolbarSnapshot[]) => void;

interface ToolbarMenuInput {
  definitions: readonly ToolbarDef[];
  layout: ToolbarLayout;
  toggle: (id: string) => void;
  words: ToolbarMenuWords;
  reset: () => void;
}

export type { ToolbarDef, ToolbarLayoutState, ToolbarListener, ToolbarMenuInput, ToolbarMoveArgs, ToolbarPlacement, ToolbarSnapshot };

/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ToolbarDefinition, ToolbarLayout, ToolbarMenuWords, ToolbarSlot } from '@drizztdourden08/tessera/composites';

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
  reset: () => void;
}

type ToolbarPlacement = 'widgets' | 'app';

interface ToolbarMenuInput {
  definitions: readonly ToolbarDef[];
  layout: ToolbarLayout;
  toggle: (id: string) => void;
  words: ToolbarMenuWords;
  reset: () => void;
}

export type { ToolbarDef, ToolbarLayoutState, ToolbarMenuInput, ToolbarPlacement };

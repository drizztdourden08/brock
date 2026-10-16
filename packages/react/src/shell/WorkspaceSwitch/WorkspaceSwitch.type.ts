/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';

interface WorkspaceItem {
  id: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  onHighlight?: () => void;
}

interface WorkspaceSwitchProps {
  items: readonly WorkspaceItem[];
  current: string;
  onSelect: (id: string) => void;
  label?: string;
}

export type { WorkspaceItem, WorkspaceSwitchProps };

/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../../menu/menu.type';
import { buildWorkspaceMenuEntries } from './build-workspace-menu-entries';
import { useWorkspaceRegistryStore } from './useWorkspaceRegistryStore';
import { useWorkspaceStore } from './useWorkspaceStore';
import { activateWorkspace, resetWorkspace } from './workspace-activate';

const useWorkspaceMenuEntries = (): MenuItem[] => {
  const defs = useWorkspaceRegistryStore((s) => s.registered);
  const active = useWorkspaceStore((s) => s.active);
  return useMemo(() => buildWorkspaceMenuEntries({ defs, active, activate: activateWorkspace, reset: resetWorkspace }), [defs, active]);
};

export { useWorkspaceMenuEntries };

/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '../../i18n';
import type { MenuItem } from '../../menu/menu.type';
import { buildWorkspaceMenuEntries } from './build-workspace-menu-entries';
import { useWorkspaceRegistryStore } from './useWorkspaceRegistryStore';
import { useWorkspaceStore } from './useWorkspaceStore';
import { activateWorkspace } from './workspace-activate';
import { resetWorkspace } from './workspace-reset';

const useWorkspaceMenuEntries = (): MenuItem[] => {
  const defs = useWorkspaceRegistryStore((s) => s.registered);
  const active = useWorkspaceStore((s) => s.active);
  const text = useText();
  return useMemo(() => buildWorkspaceMenuEntries({ defs, active, activate: activateWorkspace, reset: resetWorkspace, text }), [defs, active, text]);
};

export { useWorkspaceMenuEntries };

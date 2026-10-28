/* @layer renderer-shell @kind hook */
import { useEffect, useMemo } from 'react';
import { useShowContext } from '../../screens/show/useShowContext';
import { chosenWorkspace } from './chosen-workspace';
import { useWorkspaceRegistryStore } from './useWorkspaceRegistryStore';
import { useWorkspaceStore } from './useWorkspaceStore';
import { activateWorkspace } from './workspace-activate';

const useWorkspaceRules = (): void => {
  const registered = useWorkspaceRegistryStore((s) => s.registered);
  const ready = useWorkspaceStore((s) => s.ready);
  const show = useShowContext();
  const chosen = useMemo(() => chosenWorkspace(registered, show), [registered, show]);
  useEffect(() => useWorkspaceStore.getState().setDefs(registered), [registered]);
  useEffect(() => {
    if (ready) activateWorkspace(chosen);
  }, [ready, chosen, registered]);
};

export { useWorkspaceRules };

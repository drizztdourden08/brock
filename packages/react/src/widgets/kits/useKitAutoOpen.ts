/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useRef } from 'react';
import { isShown } from '../../screens/show/is-shown';
import { useShowContext } from '../../screens/show/useShowContext';
import { useWorkspaceStore } from '../workspaces/useWorkspaceStore';
import { useWidgetKitStore } from './useWidgetKitStore';

const useKitAutoOpen = (): void => {
  const kits = useWidgetKitStore((s) => s.kits);
  const ready = useWorkspaceStore((s) => s.ready);
  const show = useShowContext();
  const wanted = useMemo(() => kits.find((kit) => kit.when !== undefined && isShown(kit.when, show))?.id ?? null, [kits, show]);
  const opened = useRef<string | null>(null);
  useEffect(() => {
    if (!ready) return;
    const store = useWidgetKitStore.getState();
    if (wanted !== null) {
      if (store.active !== wanted) store.open(wanted);
      opened.current = wanted;
    } else if (opened.current !== null) {
      if (store.active === opened.current) store.close();
      opened.current = null;
    }
  }, [ready, wanted]);
};

export { useKitAutoOpen };

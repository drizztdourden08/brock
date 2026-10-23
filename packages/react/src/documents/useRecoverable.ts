/* @layer renderer-shell @kind hook */
import type { UseRecoverable } from './documents.type';
import { useRecoverableStore } from './useRecoverableStore';
import { useRefreshOnProfile } from './useRefreshOnProfile';

const useRecoverable = (): UseRecoverable => {
  const snapshots = useRecoverableStore((s) => s.snapshots);
  const refresh = useRecoverableStore((s) => s.refresh);
  const restore = useRecoverableStore((s) => s.restore);
  const discard = useRecoverableStore((s) => s.discard);
  useRefreshOnProfile(refresh);
  return { snapshots, refresh, restore, discard };
};

export { useRecoverable };

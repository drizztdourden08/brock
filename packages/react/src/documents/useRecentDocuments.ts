/* @layer renderer-shell @kind hook */
import type { UseRecentDocuments } from './documents.type';
import { useRecentDocumentsStore } from './useRecentDocumentsStore';
import { useRefreshOnProfile } from './useRefreshOnProfile';

const useRecentDocuments = (): UseRecentDocuments => {
  const recent = useRecentDocumentsStore((s) => s.recent);
  const refresh = useRecentDocumentsStore((s) => s.refresh);
  const clear = useRecentDocumentsStore((s) => s.clear);
  const open = useRecentDocumentsStore((s) => s.open);
  useRefreshOnProfile(refresh);
  return { recent, refresh, clear, open };
};

export { useRecentDocuments };

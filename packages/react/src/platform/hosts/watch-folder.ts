/* @layer renderer-shell @kind logic */
import type { AppIpcApi, DocumentsPort } from '@drizztdourden08/brock-core';

const watchFolder = async (api: AppIpcApi, ...[folder, options, listener]: Parameters<DocumentsPort['watch']>): Promise<() => void> => {
  const id = crypto.randomUUID();
  const stopEvents = api.onDocumentWatch((from, event) => {
    if (from === id) listener(event);
  });
  try {
    await api.documentWatch(id, folder, options);
  } catch (error) {
    stopEvents();
    throw error;
  }
  let open = true;
  return () => {
    if (!open) return;
    open = false;
    stopEvents();
    void api.documentUnwatch(id).catch(() => undefined);
  };
};

export { watchFolder };

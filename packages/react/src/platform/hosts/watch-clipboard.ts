/* @layer renderer-shell @kind logic */
import type { AppIpcApi } from '@drizztdourden08/brock-core';

const watchClipboard = (api: AppIpcApi, listener: () => void): (() => void) => {
  const id = crypto.randomUUID();
  const stopEvents = api.onClipboardChange(listener);
  let open = true;
  api.clipboardWatch(id).catch(() => {
    open = false;
    stopEvents();
  });
  return () => {
    if (!open) return;
    open = false;
    stopEvents();
    void api.clipboardUnwatch(id).catch(() => undefined);
  };
};

export { watchClipboard };

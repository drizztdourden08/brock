/* @layer renderer-shell @kind constants */
import type { EscapeLayer } from '@drizztdourden08/brock-react';
import { useUpdaterStore } from './useUpdaterStore';

const UPDATER_ESCAPE_LAYER: EscapeLayer = {
  isOpen: () => useUpdaterStore.getState().dialogOpen,
  close: () => useUpdaterStore.getState().closeDialog(),
};

export { UPDATER_ESCAPE_LAYER };

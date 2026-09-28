/* @layer renderer-shell @kind logic */
import type { UpdateStatus } from '../../updater-store.type';

const isBusy = (status: UpdateStatus): boolean => status === 'downloading' || status === 'ready';

export { isBusy };

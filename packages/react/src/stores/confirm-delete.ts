/* @layer renderer-shell @kind logic */
import { confirmAction } from './confirm-action';
import type { ConfirmDeleteOptions } from './dialog.type';

const confirmDelete = ({ what, consequence, confirmLabel = 'Delete' }: ConfirmDeleteOptions): Promise<boolean> =>
  confirmAction({ title: `Delete ${what}?`, message: consequence, confirmLabel, variant: 'danger' });

export { confirmDelete };

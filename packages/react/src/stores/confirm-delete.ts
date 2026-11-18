/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { confirmAction } from './confirm-action';
import type { ConfirmDeleteOptions } from './dialog.type';

const confirmDelete = ({ what, consequence, confirmLabel = msg('brock-shell:dialog.delete') }: ConfirmDeleteOptions): Promise<boolean> =>
  confirmAction({ title: msg('brock-shell:dialog.delete.title', { what }), message: consequence, confirmLabel, variant: 'danger' });

export { confirmDelete };

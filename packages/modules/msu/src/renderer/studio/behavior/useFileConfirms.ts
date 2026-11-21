/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { formatBytes } from '@drizztdourden08/brock-core';
import { NO_USES } from '../MsuFilePanel.constants';
import type { FileConfirmsParams } from './file-confirms.type';

const useFileConfirms = (params: FileConfirmsParams) => {
  const t = useT();
  const { usage, covered, onDeleteConfirm, deleteFile, report } = params;

  const confirmDelete = useCallback((fileName: string) => {
    const uses = usage.get(fileName) ?? NO_USES;
    const played = uses.length > 0 ? ` ${t('msu:confirm.deleteFile.leftEmpty', { uses: uses.join(', ') })}` : '';
    onDeleteConfirm(
      t('msu:confirm.deleteFile.title'),
      `${t('msu:confirm.deleteFile.message', { name: fileName })}${played}`,
      () => { deleteFile(fileName); },
    );
  }, [usage, t, onDeleteConfirm, deleteFile]);

  const confirmRemoveSuperseded = useCallback(() => {
    const doomed = [...covered.superseded];
    const stillNamed = doomed.filter((name) => (usage.get(name) ?? NO_USES).length > 0);
    const played = stillNamed.length > 0
      ? ` ${t('msu:confirm.superseded.stillNamed', { count: stillNamed.length })}`
      : '';
    onDeleteConfirm(
      t('msu:confirm.superseded.title'),
      `${t('msu:confirm.superseded.message', { count: doomed.length, size: formatBytes(covered.totalBytes) })}${played}`,
      () => { void covered.removeAll().then(report); },
    );
  }, [covered, usage, t, onDeleteConfirm, report]);

  return { confirmDelete, confirmRemoveSuperseded };
};

export { useFileConfirms };

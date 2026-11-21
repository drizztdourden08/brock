/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { failure } from './failure';
import type { ActionResult } from '../msu.type';

const useFileDeletion = (
  selected: string | null,
  reload: () => void,
  report: (action: Promise<ActionResult>) => Promise<ActionResult>,
) => {
  const { store } = useMsuStudio();
  const t = useT();
  const deleteFile = useCallback(async (fileName: string): Promise<ActionResult> => {
    if (!selected) return { success: false, message: t('msu:result.noPack') };
    try {
      await store.deleteMsuTrackFile(selected, fileName);
      return { success: true, message: t('msu:result.deleted', { name: fileName }) };
    } catch (err) {
      return failure(err, t('msu:result.deleteFailed'));
    } finally {
      reload();
    }
  }, [store, selected, reload, t]);

  return useCallback((fileName: string) => {
    void report(deleteFile(fileName));
  }, [deleteFile, report]);
};

export { useFileDeletion };

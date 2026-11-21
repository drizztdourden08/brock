/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { withFileRenamed } from '../../../layer-edit';
import { useMsuStudio } from '../../game/useMsuStudio';
import { failure } from './failure';
import { renameProblem } from './rename-problem';
import type { FileMutationParams } from './file-panel.type';

const useFileMutations = (params: FileMutationParams) => {
  const t = useT();
  const { store } = useMsuStudio();
  const { pack, saveBase, taken, reload, setStatus, setWorking } = params;

  const renameFile = useCallback((from: string, to: string) => {
    const wanted = to.trim();
    if (wanted === from) return;
    const problem = renameProblem(from, wanted, taken, t);
    if (problem !== null) { setStatus({ success: false, message: problem }); return; }
    setWorking(true);
    void (async () => {
      try {
        await store.renameMsuTrackFile(pack, from, wanted);
        if (saveBase !== null) await store.writeMsuManifest(pack, withFileRenamed(saveBase, from, wanted));
        setStatus({ success: true, message: t('msu:result.renamed', { name: wanted }) });
      } catch (err) {
        setStatus(failure(err, t('msu:files.renameFailed')));
      } finally {
        setWorking(false);
        reload();
      }
    })();
  }, [store, t, pack, saveBase, taken, reload, setStatus, setWorking]);

  const deleteFile = useCallback((fileName: string) => {
    setWorking(true);
    void (async () => {
      try {
        await store.deleteMsuTrackFile(pack, fileName);
        setStatus({ success: true, message: t('msu:result.deleted', { name: fileName }) });
      } catch (err) {
        setStatus(failure(err, t('msu:result.deleteFailed')));
      } finally {
        setWorking(false);
        reload();
      }
    })();
  }, [store, t, pack, reload, setStatus, setWorking]);

  return { renameFile, deleteFile };
};

export { useFileMutations };

/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { withFileRenamed } from '../../../layer-edit';
import { useMsuStudio } from '../../game/useMsuStudio';
import { failure } from './failure';
import { renameProblem } from './rename-problem';
import type { FileMutationParams } from './file-panel.type';

const useFileMutations = (params: FileMutationParams) => {
  const { store } = useMsuStudio();
  const { pack, saveBase, taken, reload, setStatus, setWorking } = params;

  const renameFile = useCallback((from: string, to: string) => {
    const wanted = to.trim();
    if (wanted === from) return;
    const problem = renameProblem(from, wanted, taken);
    if (problem !== null) { setStatus({ success: false, message: problem }); return; }
    setWorking(true);
    void (async () => {
      try {
        await store.renameMsuTrackFile(pack, from, wanted);
        if (saveBase !== null) await store.writeMsuManifest(pack, withFileRenamed(saveBase, from, wanted));
        setStatus({ success: true, message: `Renamed to "${wanted}"` });
      } catch (err) {
        setStatus(failure(err, 'Could not rename that file'));
      } finally {
        setWorking(false);
        reload();
      }
    })();
  }, [store, pack, saveBase, taken, reload, setStatus, setWorking]);

  const deleteFile = useCallback((fileName: string) => {
    setWorking(true);
    void (async () => {
      try {
        await store.deleteMsuTrackFile(pack, fileName);
        setStatus({ success: true, message: `Deleted "${fileName}"` });
      } catch (err) {
        setStatus(failure(err, 'Could not delete that file'));
      } finally {
        setWorking(false);
        reload();
      }
    })();
  }, [store, pack, reload, setStatus, setWorking]);

  return { renameFile, deleteFile };
};

export { useFileMutations };

/* @layer renderer-shell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { supersededMap, withSupersededRepointed } from '../../../superseded';
import { useMsuStudio } from '../../game/useMsuStudio';
import { failure } from './failure';
import type { ActionResult } from '../msu.type';
import type { SupersededParams } from './superseded-files.type';

const supersededNames = (names: string[]): Set<string> => new Set(supersededMap(names).keys());

const useSupersededFiles = (params: SupersededParams) => {
  const { store } = useMsuStudio();
  const t = useT();
  const { pack, files, saveBase, reload } = params;
  const [removing, setRemoving] = useState(false);

  const names = useMemo(() => files.map((file) => file.name), [files]);
  const superseded = useMemo(() => supersededNames(names), [names]);

  const totalBytes = useMemo(
    () => files.reduce((sum, file) => (superseded.has(file.name) ? sum + file.size : sum), 0),
    [files, superseded],
  );

  const removeAll = useCallback(async (): Promise<ActionResult> => {
    const doomed = [...superseded];
    if (doomed.length === 0) return { success: false, message: t('msu:result.nothingSuperseded') };
    setRemoving(true);
    try {
      if (saveBase !== null) {
        const repointed = withSupersededRepointed(saveBase, names);
        if (repointed !== saveBase) await store.writeMsuManifest(pack, repointed);
      }
      for (const name of doomed) await store.deleteMsuTrackFile(pack, name);
      return { success: true, message: t('msu:result.removedSuperseded', { count: doomed.length }) };
    } catch (err) {
      return failure(err, t('msu:result.removeSupersededFailed'));
    } finally {
      setRemoving(false);
      reload();
    }
  }, [store, pack, names, saveBase, superseded, reload, t]);

  return { superseded, count: superseded.size, totalBytes, removing, removeAll };
};

export { useSupersededFiles };

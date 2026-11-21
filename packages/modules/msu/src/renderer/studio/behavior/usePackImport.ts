/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { stemOf } from './track-file-name';
import { failure } from './failure';
import { isMsulName } from './is-msul-name';
import type { ActionResult } from '../msu.type';
import type { PackImportParams } from './pack-import.type';

const usePackImport = (params: PackImportParams) => {
  const t = useT();
  const { refresh, onImported } = params;
  const { store } = useMsuStudio();

  const importMsul = useCallback(async (file: File, desiredName: string): Promise<ActionResult> => {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await store.installMsulFile(bytes, desiredName || stemOf(file.name));
      await refresh();
      onImported(result.pack);
      const missing = result.missingFiles.length > 0
        ? ` ${t('msu:import.missing', { count: result.missingFiles.length, names: result.missingFiles.join(', ') })}`
        : '';
      return { success: true, message: `${t('msu:import.imported', { name: result.pack, files: result.fileCount, slots: result.trackCount })}${missing}` };
    } catch (err) {
      return failure(err, t('msu:import.readFailed'));
    }
  }, [store, t, refresh, onImported]);

  return { importMsul, isMsulName };
};

export { usePackImport };

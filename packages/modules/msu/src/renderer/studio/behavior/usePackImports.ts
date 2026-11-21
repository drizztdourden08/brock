/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { isMsulName } from './is-msul-name';
import { skipNote } from './skip-note';
import { usePackImport } from './usePackImport';
import type { ActionResult } from '../msu.type';
import type { PackImportsParams } from './pack-imports.type';
import type { StoreImport } from './store-import.type';

const usePackImports = (params: PackImportsParams) => {
  const { newPackName, setNewPackName, refresh, setSelected } = params;
  const { store } = useMsuStudio();
  const t = useT();
  const { importMsul } = usePackImport({ refresh, onImported: setSelected });

  const settleImport = useCallback(async (pack: string, result: StoreImport, failure: string): Promise<ActionResult> => {
    if (!result.success) return { success: false, message: result.error ?? failure };
    await refresh();
    setSelected(pack);
    setNewPackName('');
    return { success: true, message: `${t('msu:result.imported', { count: result.fileCount ?? 0 })}${skipNote(result, t)}` };
  }, [refresh, setSelected, setNewPackName, t]);

  const handleUrlImport = useCallback(async (url: string): Promise<ActionResult> => {
    const pack = newPackName.trim() || `pack-${Date.now()}`;
    return settleImport(pack, await store.importMsu(pack, url), t('msu:import.downloadFailed'));
  }, [store, newPackName, settleImport, t]);

  const handleFileImport = useCallback(async (dropped: File[]): Promise<ActionResult> => {
    const [file] = dropped;
    if (file === undefined) return { success: false, message: t('msu:result.noFile') };
    if (isMsulName(file.name)) {
      const result = await importMsul(file, newPackName.trim());
      if (result.success) setNewPackName('');
      return result;
    }
    const pack = newPackName.trim() || `pack-${Date.now()}`;
    return settleImport(pack, await store.importMsuFile(pack, file), t('msu:import.failed'));
  }, [store, newPackName, setNewPackName, importMsul, settleImport, t]);

  return { handleUrlImport, handleFileImport };
};

export { usePackImports };

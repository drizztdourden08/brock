/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { failure } from './failure';
import type { ActionResult, MsuPackRow } from '../msu.type';

const usePackList = (onRefresh: () => void) => {
  const { store } = useMsuStudio();
  const t = useT();
  const [packs, setPacks] = useState<MsuPackRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingPacks, setLoadingPacks] = useState(true);

  const refresh = useCallback(async () => {
    const list = await store.listMsuPacks();
    const rows = await Promise.all(list.map(async (pack): Promise<MsuPackRow> => {
      const audio = await store.listMsuAudioFiles(pack.name);
      return {
        name: pack.name,
        fileCount: audio.length,
        totalSize: audio.reduce((sum, f) => sum + f.size, 0),
        format: (await store.readMsuManifest(pack.name)) ? 'layered' : 'classic',
      };
    }));
    setPacks(rows);
    onRefresh();
  }, [store, onRefresh]);

  useEffect(() => {
    void refresh().catch(() => undefined).finally(() => { setLoadingPacks(false); });
  }, [refresh]);

  const createPack = useCallback(async (name: string): Promise<ActionResult> => {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, message: t('msu:result.nameFirst') };
    try {
      await store.createMsuPack(trimmed);
      await refresh();
      setSelected(trimmed);
      return { success: true, message: t('msu:result.created', { name: trimmed }) };
    } catch (err) { return failure(err, t('msu:result.createFailed')); }
  }, [store, refresh, t]);

  const renamePack = useCallback(async (from: string, to: string): Promise<ActionResult> => {
    const trimmed = to.trim();
    if (!trimmed) return { success: false, message: t('msu:result.nameFirst') };
    if (trimmed === from) return { success: true, message: t('msu:result.nameUnchanged') };
    try {
      await store.renameMsuPack(from, trimmed);
      await refresh();
      setSelected(trimmed);
      return { success: true, message: t('msu:result.renamed', { name: trimmed }) };
    } catch (err) { return failure(err, t('msu:result.renameFailed')); }
  }, [store, refresh, t]);

  return { packs, loadingPacks, selected, setSelected, refresh, createPack, renamePack };
};

export { usePackList };

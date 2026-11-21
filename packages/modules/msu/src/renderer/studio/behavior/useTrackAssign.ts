/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { withTrackFile } from './pack-manifest';
import { parkFile } from './park-file';
import { canonicalTrackName, extensionOf, namePrefixOf, uniqueFileName } from './track-file-name';
import { failure } from './failure';
import { getTrackNumber } from './get-track-number';
import type { ActionResult } from '../msu.type';
import type { TrackAssignParams } from './track-assign.type';

const useTrackAssign = (params: TrackAssignParams) => {
  const { pack, format, manifest, files, reload } = params;
  const { store } = useMsuStudio();
  const t = useT();
  const [busy, setBusy] = useState(false);

  const assignClassic = useCallback(async (trackNum: number, fileName: string): Promise<ActionResult> => {
    if (!pack) return { success: false, message: t('msu:result.noPack') };
    const names = files.map((f) => f.name);
    const taken = new Set(names);
    const occupant = names.find((n) => n !== fileName && getTrackNumber(n) === trackNum);

    if (!fileName) {
      if (!occupant) return { success: true, message: t('msu:assign.alreadyEmpty', { slot: trackNum }) };
      const parked = await parkFile(store, pack, occupant, taken);
      return { success: true, message: t('msu:assign.clearedParked', { slot: trackNum, parked }) };
    }

    const target = canonicalTrackName(namePrefixOf(names, pack), trackNum, extensionOf(fileName));
    if (!occupant) {
      if (fileName === target) return { success: true, message: t('msu:assign.alreadyFills', { name: fileName, slot: trackNum }) };
      await store.renameMsuTrackFile(pack, fileName, target);
      return { success: true, message: t('msu:assign.nowPlays', { slot: trackNum, name: target }) };
    }
    if (fileName === target) {
      const parked = await parkFile(store, pack, occupant, taken);
      return { success: true, message: t('msu:assign.movedAside', { slot: trackNum, name: fileName, occupant, parked }) };
    }
    const hold = uniqueFileName(`swap.${extensionOf(occupant)}`, taken);
    await store.renameMsuTrackFile(pack, occupant, hold);
    await store.renameMsuTrackFile(pack, fileName, target);
    await store.renameMsuTrackFile(pack, hold, fileName);
    return { success: true, message: t('msu:assign.swapped', { slot: trackNum, name: target, replaced: fileName }) };
  }, [store, pack, files, t]);

  const assign = useCallback(async (trackNum: number, fileName: string): Promise<ActionResult> => {
    if (!pack) return { success: false, message: t('msu:result.noPack') };
    setBusy(true);
    try {
      if (format === 'layered') {
        await store.writeMsuManifest(pack, withTrackFile(manifest, trackNum, fileName || null, t('msu:layer.trackName', { number: trackNum })));
        return { success: true, message: fileName ? t('msu:assign.nowPlays', { slot: trackNum, name: fileName }) : t('msu:assign.cleared', { slot: trackNum }) };
      }
      return await assignClassic(trackNum, fileName);
    } catch (err) {
      return failure(err, t('msu:assign.failed'));
    } finally {
      setBusy(false);
      reload();
    }
  }, [store, pack, format, manifest, assignClassic, reload, t]);

  return { assign, assigning: busy };
};

export { useTrackAssign };

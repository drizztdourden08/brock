/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { soundTitle } from '../sound-labels';
import { failure } from './failure';
import { withoutSound } from './sound-manifest';
import type { StopReplacingParams } from './stop-replacing.type';

const useStopReplacing = (params: StopReplacingParams) => {
  const t = useT();
  const { pack, channel, saveBase, reload, setStatus } = params;
  const { game, store } = useMsuStudio<never, never>();

  return useCallback(async (soundId: number) => {
    try {
      await store.writeMsuManifest(pack, withoutSound(saveBase, channel, soundId));
      setStatus({ success: true, message: t('msu:effects.chipAgain', { sound: soundTitle(game, channel, soundId) }) });
    } catch (err) {
      setStatus(failure(err, t('msu:effects.updateFailed')));
    } finally {
      reload();
    }
  }, [store, game, t, pack, channel, saveBase, reload, setStatus]);
};

export { useStopReplacing };

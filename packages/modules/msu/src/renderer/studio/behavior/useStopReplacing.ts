/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useMsuStudio } from '../../game/useMsuStudio';
import { soundTitle } from '../sound-labels';
import { failure } from './failure';
import { withoutSound } from './sound-manifest';
import type { StopReplacingParams } from './stop-replacing.type';

const useStopReplacing = (params: StopReplacingParams) => {
  const { pack, channel, saveBase, reload, setStatus } = params;
  const { game, store } = useMsuStudio<never, never>();

  return useCallback(async (soundId: number) => {
    try {
      await store.writeMsuManifest(pack, withoutSound(saveBase, channel, soundId));
      setStatus({ success: true, message: `${soundTitle(game, channel, soundId)} plays from the sound chip again` });
    } catch (err) {
      setStatus(failure(err, 'Could not update the pack'));
    } finally {
      reload();
    }
  }, [store, game, pack, channel, saveBase, reload, setStatus]);
};

export { useStopReplacing };

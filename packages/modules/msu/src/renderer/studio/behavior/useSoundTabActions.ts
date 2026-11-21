/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { soundTitle } from '../sound-labels';
import type { SoundTabActionsParams } from './sound-tab-actions.type';

const useSoundTabActions = (params: SoundTabActionsParams) => {
  const t = useT();
  const { sound, onDeleteConfirm } = params;
  const { stopReplacing, toggleLayers, playOriginal } = sound;
  const game = useMsuStudioGame<never, never>();

  const confirmStopReplacing = useCallback((channel: string, soundId: number) => {
    onDeleteConfirm(
      t('msu:effects.stopTitle'),
      t('msu:effects.stopMessage', { sound: soundTitle(game, channel, soundId) }),
      () => { void stopReplacing(soundId); },
    );
  }, [onDeleteConfirm, game, t, stopReplacing]);

  const select = useCallback((_channel: string, soundId: number) => toggleLayers(soundId), [toggleLayers]);
  const original = useCallback((_channel: string, soundId: number) => playOriginal(soundId), [playOriginal]);

  return { confirmStopReplacing, select, original };
};

export { useSoundTabActions };

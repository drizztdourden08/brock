/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { soundTitle } from '../sound-labels';
import type { SoundTabActionsParams } from './sound-tab-actions.type';

const useSoundTabActions = (params: SoundTabActionsParams) => {
  const { sound, onDeleteConfirm } = params;
  const { stopReplacing, toggleLayers, playOriginal } = sound;
  const game = useMsuStudioGame<never, never>();

  const confirmStopReplacing = useCallback((channel: string, soundId: number) => {
    onDeleteConfirm(
      'Stop Replacing Sound',
      `Remove this pack's layers for ${soundTitle(game, channel, soundId)}? It will play from the sound chip again.`,
      () => { void stopReplacing(soundId); },
    );
  }, [onDeleteConfirm, game, stopReplacing]);

  const select = useCallback((_channel: string, soundId: number) => toggleLayers(soundId), [toggleLayers]);
  const original = useCallback((_channel: string, soundId: number) => playOriginal(soundId), [playOriginal]);

  return { confirmStopReplacing, select, original };
};

export { useSoundTabActions };

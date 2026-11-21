/* @layer renderer-shell @kind hook */
import { useT } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { useMsuStudioGame } from '../../game/useMsuStudioGame';
import { soundTitle } from '../sound-labels';
import type { MsuEffectsPanelProps } from '../msu.type';
import { parseEffectQuery } from './effect-query';
import { mergeEffectRows } from './merge-effect-rows';
import { openEffectOf } from './open-effect-of';
import { portTags } from './port-tags';
import { useSoundPanel } from './useSoundPanel';

const useEffectsPanel = (props: MsuEffectsPanelProps) => {
  const t = useT();
  const { channels, pack, manifest, saveBase, files, onDeleteConfirm, onReload } = props;
  const [firstChannel, secondChannel] = channels;
  const game = useMsuStudioGame<never, never>();
  const [filter, setFilter] = useState('');
  const query = parseEffectQuery(filter, portTags(game, channels));
  const shared = {
    pack, manifest, saveBase, files, filter: query.text, showUnreachable: false, reload: onReload,
  };
  const first = useSoundPanel({ ...shared, channel: firstChannel });
  const second = useSoundPanel({ ...shared, channel: secondChannel });

  const panelOf = useCallback((channel: string) => (channel === firstChannel ? first : second), [firstChannel, first, second]);
  const otherOf = useCallback((channel: string) => (channel === firstChannel ? second : first), [firstChannel, first, second]);

  const wanted = query.channel;
  const rows = useMemo(
    () => mergeEffectRows(channels, first.rows, second.rows, wanted),
    [channels, first.rows, second.rows, wanted],
  );

  const play = useCallback((channel: string, soundId: number) => {
    otherOf(channel).stop();
    otherOf(channel).closeLayers();
    panelOf(channel).play(channel, soundId);
  }, [otherOf, panelOf]);

  const playOriginal = useCallback((channel: string, soundId: number) => {
    otherOf(channel).stop();
    otherOf(channel).closeLayers();
    panelOf(channel).playOriginal(soundId);
  }, [otherOf, panelOf]);

  const toggleLayers = useCallback((channel: string, soundId: number) => {
    otherOf(channel).closeLayers();
    panelOf(channel).toggleLayers(soundId);
  }, [otherOf, panelOf]);

  const stopAll = useCallback(() => { first.stop(); second.stop(); }, [first, second]);

  const confirmStopReplacing = useCallback((channel: string, soundId: number) => {
    onDeleteConfirm(
      t('msu:effects.stopTitle'),
      t('msu:effects.stopMessage', { sound: soundTitle(game, channel, soundId) }),
      () => { void panelOf(channel).stopReplacing(soundId); },
    );
  }, [onDeleteConfirm, game, t, panelOf]);

  return {
    filter, setFilter, first, second, panelOf, rows, open: openEffectOf(channels, first, second),
    play, playOriginal, toggleLayers, stopAll, confirmStopReplacing,
  };
};

export { useEffectsPanel };

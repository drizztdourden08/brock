/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import type { MsuSoundDef } from '../../../types';
import { soundHexId } from '../sound-labels';
import type { SoundRowData } from '../msu.type';
import { FIRST_PLAYABLE_ID } from './sound-rows.constants';

const reachOf = (game: MsuStudioGame<never, never>, channel: string, soundId: number) => ({
  role: game.sounds.roleOf?.(channel, soundId) ?? null,
  unreachable: game.sounds.isReachable !== undefined && !game.sounds.isReachable(channel, soundId),
});

const buildSoundRows = (
  game: MsuStudioGame<never, never>,
  channel: string,
  byId: ReadonlyMap<number, MsuSoundDef>,
): SoundRowData[] => {
  const named = game.sounds.list(channel).map((sound): SoundRowData => ({
    soundId: sound.id,
    hex: soundHexId(sound.id),
    label: sound.label,
    triggers: [...sound.triggers],
    sites: sound.sites,
    layerCount: byId.get(sound.id)?.layers.length ?? 0,
    unlisted: false,
    ...reachOf(game, channel, sound.id),
  }));
  const known = new Set(named.map((row) => row.soundId));
  const rest: SoundRowData[] = [];
  for (let id = FIRST_PLAYABLE_ID; id < game.config.soundIdCount; id++) {
    if (known.has(id)) continue;
    rest.push({
      soundId: id,
      hex: soundHexId(id),
      label: game.sounds.name(channel, id),
      triggers: [],
      sites: 0,
      layerCount: byId.get(id)?.layers.length ?? 0,
      unlisted: true,
      ...reachOf(game, channel, id),
    });
  }
  return [...named, ...rest];
};

export { buildSoundRows };

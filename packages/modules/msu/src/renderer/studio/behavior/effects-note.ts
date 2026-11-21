/* @layer renderer-shell @kind logic */
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { soundChannelTag } from '../sound-labels';

const effectsNote = (game: MsuStudioGame<never, never>, channels: readonly [string, string], t: I18n['t']): string => {
  const [first, second] = channels;
  return t('msu:effects.note', { first: soundChannelTag(game, first), second: soundChannelTag(game, second) });
};

export { effectsNote };

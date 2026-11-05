/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { soundChannelTag } from '../sound-labels';

const effectsNote = (game: MsuStudioGame<never, never>, channels: readonly [string, string]): string => {
  const [first, second] = channels;
  return `Each id belongs to port ${soundChannelTag(game, first)} or ${soundChannelTag(game, second)}. Add either to the filter to narrow to one port.`;
};

export { effectsNote };

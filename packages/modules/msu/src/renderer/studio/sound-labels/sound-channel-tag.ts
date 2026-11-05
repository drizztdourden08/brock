/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';

const soundChannelTag = (game: MsuStudioGame<never, never>, channel: string): string =>
  game.channelTags[channel] ?? channel.toUpperCase();

export { soundChannelTag };

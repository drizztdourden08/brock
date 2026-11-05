/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';

const soundChannelLabel = (game: MsuStudioGame<never, never>, channel: string): string =>
  game.channelLabels[channel] ?? channel;

export { soundChannelLabel };

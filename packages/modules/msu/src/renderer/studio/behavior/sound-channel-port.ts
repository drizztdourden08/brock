/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { soundChannelLabel } from '../sound-labels';

const soundChannelPort = (game: MsuStudioGame<never, never>, channel: string): string => {
  const port = game.channelPorts?.[channel];
  const label = soundChannelLabel(game, channel);
  return port === undefined ? label : `${label} · port ${port}`;
};

export { soundChannelPort };

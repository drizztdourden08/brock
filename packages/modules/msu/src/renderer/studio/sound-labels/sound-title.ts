/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { soundChannelLabel } from './sound-channel-label';
import { soundHexId } from './sound-hex-id';

const soundTitle = (game: MsuStudioGame<never, never>, channel: string, soundId: number): string =>
  `${soundChannelLabel(game, channel)} ${soundHexId(soundId)}`;

export { soundTitle };

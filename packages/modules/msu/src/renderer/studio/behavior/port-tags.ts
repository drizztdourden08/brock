/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { soundChannelTag } from '../sound-labels';
import type { PortTag } from './effect-query.type';

const portTags = (game: MsuStudioGame<never, never>, channels: readonly string[]): PortTag[] =>
  channels.map((channel) => ({ channel, tag: soundChannelTag(game, channel).toLowerCase() }));

export { portTags };

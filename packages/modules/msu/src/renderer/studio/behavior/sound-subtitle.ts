/* @layer renderer-shell @kind logic */
import type { MsuGameConfig } from '../../../config';
import { isAdditiveChannel } from './sound-channel-kind';
import type { SubtitleCounts } from './sound-subtitle.type';

const soundPanelSubtitle = (config: MsuGameConfig<never>, counts: SubtitleCounts): string => {
  const { total, raisedCount, reachableCount, hiddenCount, showUnreachable } = counts;
  if (isAdditiveChannel(config, counts.channel)) return `${raisedCount} of ${total} ids are used by the game.`;
  const tail = showUnreachable ? '' : ` ${hiddenCount} more hidden.`;
  return `${reachableCount} of ${total} ids are used by the game.${tail}`;
};

export { soundPanelSubtitle };

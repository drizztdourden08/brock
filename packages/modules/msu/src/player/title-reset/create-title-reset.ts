/* @layer core @kind logic */
import type { BuiltChannels } from '../build-channels';
import { isSilencedAtTitle } from './is-silenced-at-title';

const createTitleReset = (
  channels: BuiltChannels,
  isTitleScene?: (scene: number) => boolean,
  enabled?: () => boolean,
  onReset?: () => void,
) => {
  const all = [channels.music, ...channels.sounds.map((entry) => entry.api)];
  const silenced = channels.sounds.filter((entry) => isSilencedAtTitle(entry.config)).map((entry) => entry.api);
  let wasTitle = false;

  return (scene: number): void => {
    const title = isTitleScene?.(scene) ?? false;
    const entering = title && !wasTitle;
    wasTitle = title;
    if (!title || !(enabled?.() ?? false)) return;
    if (entering) {
      silenced.forEach((channel) => channel.stop());
      onReset?.();
    }
    all.forEach((channel) => channel.forget());
  };
};

export { createTitleReset };

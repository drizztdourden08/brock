/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import { MUSIC_TARGET } from './original-sound.constants';

const isContinuousTarget = (config: MsuGameConfig<never>, target: string): boolean =>
  target === MUSIC_TARGET
  || config.soundChannels.some((channel) => channel.name === target && channel.kind === 'stateful');

export { isContinuousTarget };

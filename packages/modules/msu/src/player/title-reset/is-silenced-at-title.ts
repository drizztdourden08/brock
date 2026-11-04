/* @layer core @kind logic */
import type { MsuSoundChannel } from '../../config';

const isSilencedAtTitle = (channel: MsuSoundChannel): boolean => channel.silenceAtTitle !== false;

export { isSilencedAtTitle };

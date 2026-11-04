/* @layer core @kind logic */
import type { MsuGameConfig, MsuHost } from '../../config';
import { EMPTY_SOUND_CLAIM } from '../../sound-claim';
import { setSoundClaim } from './set-sound-claim';

const clearSoundClaims = (host: MsuHost, config: MsuGameConfig<never>): void => {
  for (const channel of config.soundChannels) setSoundClaim(host, channel, EMPTY_SOUND_CLAIM);
};

export { clearSoundClaims };

/* @layer core @kind logic */
import type { MsuHost, MsuSoundChannel } from '../../config';
import type { SoundClaim } from '../../sound-claim';

const setSoundClaim = (host: MsuHost, channel: MsuSoundChannel, claim: SoundClaim): void => {
  host.setSoundClaim(channel.coreIndex, claim.low, claim.high);
};

export { setSoundClaim };

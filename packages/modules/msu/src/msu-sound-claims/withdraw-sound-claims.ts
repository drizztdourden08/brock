/* @layer core @kind logic */
import { clearSoundClaims } from '../bridge/sound-claim';
import type { MsuGameConfig, MsuHost } from '../config';
import { SOUND_BUSES } from './msu-sound-claims.constants';

const withdrawSoundClaims = (host: MsuHost, config: MsuGameConfig<never>): void => {
  for (const bus of SOUND_BUSES) host.setExternalSounds?.(bus, false);
  clearSoundClaims(host, config);
};

export { withdrawSoundClaims };

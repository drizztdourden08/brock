/* @layer core @kind logic */
import { setSoundClaim } from '../bridge/sound-claim';
import type { MsuGameConfig, MsuHost } from '../config';
import { manifestSoundIds, soundClaimMask } from '../sound-claim';
import type { MsuPackManifest } from '../types';
import { SOUND_BUSES } from './msu-sound-claims.constants';
import type { ClaimedCounts, SoundReplacement } from './msu-sound-claims.type';

const publishSoundClaims = (
  host: MsuHost,
  config: MsuGameConfig<never>,
  manifest: MsuPackManifest,
  allow: SoundReplacement,
): ClaimedCounts => {
  const claimed: ClaimedCounts = { ambient: 0, sfx: 0 };
  for (const channel of config.soundChannels) {
    const ids = allow[channel.bus] ? manifestSoundIds(manifest, channel.name, config.soundIdCount) : [];
    claimed[channel.bus] += ids.length;
    setSoundClaim(host, channel, soundClaimMask(ids, config.soundIdCount));
  }
  for (const bus of SOUND_BUSES) host.setExternalSounds?.(bus, claimed[bus] > 0);
  return claimed;
};

export { publishSoundClaims };

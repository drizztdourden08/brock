/* @layer core @kind logic */
import type { MsuSessionOptions } from '../msu-session';
import type { ClaimedCounts } from '../msu-sound-claims';

const logAttached = <Ctx>(options: MsuSessionOptions<Ctx>, claimed: ClaimedCounts): void => {
  const variant = options.variant === undefined ? '' : `, ${options.variant}`;
  options.log?.info(`[MSU] Engine attached (${options.manifest.tracks.length} tracks${variant})`);
  const sounds = claimed.ambient + claimed.sfx;
  if (sounds > 0) {
    options.log?.info(`[MSU] Claimed ${sounds} sound(s): ${claimed.ambient} ambient, ${claimed.sfx} effect(s)`);
  }
};

export { logAttached };

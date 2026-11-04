/* @layer core @kind constants */
import type { SoundClaim } from './sound-claim.type';

const CLAIM_MAX_BITS = 64;

const CLAIM_HALF_BITS = 32;

const EMPTY_SOUND_CLAIM: SoundClaim = { low: 0, high: 0 };

export { CLAIM_MAX_BITS, CLAIM_HALF_BITS, EMPTY_SOUND_CLAIM };

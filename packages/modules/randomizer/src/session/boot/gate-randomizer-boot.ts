/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../profile/randomizer-profile.type';
import { pendingBoot } from '../store/pending-boot';
import { sessionFactories } from '../store/session-factories';
import type { GateResult } from './gate-result.type';

const gateRandomizerBoot = async (profileId: string, config: RandomizerProfileConfig): Promise<GateResult> => {
  const factory = sessionFactories.get(config.mode);
  if (factory === undefined) {
    return { ok: false, reason: `Randomizer boot blocked: no session is registered for mode ${config.mode}` };
  }
  const pending = await factory.gate(profileId, config);
  if (pending === null) {
    const what = factory.placementBacked ? 'this profile\'s seed could not be rolled' : 'the session could not be prepared';
    return { ok: false, reason: `Randomizer boot blocked: ${what}` };
  }
  pendingBoot.set(pending);
  return { ok: true };
};

export { gateRandomizerBoot };

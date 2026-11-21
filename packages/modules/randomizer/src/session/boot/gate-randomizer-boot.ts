/* @layer renderer-shell @kind logic */
import type { RandomizerProfileConfig } from '../../augment';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { englishText } from '../../text/english-text';
import { pendingBoot } from '../store/pending-boot';
import { sessionFactories } from '../store/session-factories';
import type { GateResult } from './gate-result.type';

const blockedResult = (detail: Text): GateResult => ({
  ok: false,
  reason: `Randomizer boot blocked: ${englishText(detail)}`,
  detail,
});

const gateRandomizerBoot = async (profileId: string, config: RandomizerProfileConfig): Promise<GateResult> => {
  const factory = sessionFactories.get(config.mode);
  if (factory === undefined) return blockedResult(`no session is registered for mode ${config.mode}`);
  const blocked = factory.blockedReason?.(config) ?? null;
  if (blocked !== null) return blockedResult(blocked);
  const pending = await factory.gate(profileId, config);
  if (pending === null) {
    return blockedResult(factory.placementBacked ? 'this profile\'s seed could not be rolled' : 'the session could not be prepared');
  }
  pendingBoot.set(pending);
  return { ok: true };
};

export { gateRandomizerBoot };

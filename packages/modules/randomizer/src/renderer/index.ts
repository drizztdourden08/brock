/* @layer renderer-shell @kind barrel */
import type { RendererModule } from '@drizztdourden08/brock-react';
import { randomizerBucket } from './bucket/randomizer-bucket';
import { stopSessionBeforeQuit } from './lifecycle/before-quit';
import { RANDOMIZER_LOG_CHANNELS } from './lifecycle/log-channels.constants';
import { randomizerLockCause } from './lock/randomizer-lock-cause';
import { randomizerMode } from './mode/randomizer-mode';
import { randomizerProfileHooks } from './profile-hooks/randomizer-profile-hooks';
import { randomizerOptionsStep } from './wizard/randomizer-options.step';
import { randomizerStep } from './wizard/randomizer.step';

const randomizerRenderer: RendererModule = {
  id: 'randomizer',
  buckets: [randomizerBucket],
  profileModes: [randomizerMode],
  lockCauses: [randomizerLockCause],
  profileWizardSteps: [randomizerStep, randomizerOptionsStep],
  profileHooks: randomizerProfileHooks,
  logChannels: RANDOMIZER_LOG_CHANNELS,
  beforeQuit: stopSessionBeforeQuit,
};

export default randomizerRenderer;
export { randomizerRenderer };
export { addRandomizerPages } from './bucket/add-randomizer-pages';
export { registerRandomizerGame } from './game-registry/register-randomizer-game';
export { useRandomizerGame } from './game-registry/behavior/useRandomizerGame';
export { useRandomizerSession } from './hooks/behavior/useRandomizerSession';

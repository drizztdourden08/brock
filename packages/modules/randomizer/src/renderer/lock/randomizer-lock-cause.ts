/* @layer renderer-shell @kind logic */
import { LOCK_CAUSE_ORDER, useProfilesStore } from '@drizztdourden08/brock-react';
import type { LockCauseProvider } from '@drizztdourden08/brock-react';
import { frozenKeysOf } from '../../profile/frozen-keys-of';

const randomizerLockCause: LockCauseProvider = {
  id: 'randomizer',
  order: LOCK_CAUSE_ORDER.module,
  causeOf: (key) => (frozenKeysOf(useProfilesStore.getState().active?.randomizer).includes(key) ? 'randomizer' : null),
};

export { randomizerLockCause };

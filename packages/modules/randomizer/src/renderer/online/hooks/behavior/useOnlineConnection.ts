/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useProfilesStore } from '@drizztdourden08/brock-react';
import type { ArchipelagoConnection } from '../../../../augment';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import type { OnlineConnectionApi } from '../connection-patch.type';
import { NO_CONNECTION } from '../hooks.constants';
import { patchConnection } from '../patch-connection';

const useOnlineConnection = (): OnlineConnectionApi => {
  const game = useRandomizerGame();
  const profile = useProfilesStore((state) => state.active);
  const patch = useCallback((fields: ArchipelagoConnection) => patchConnection({ profile, game, fields }), [profile, game]);
  return { connection: profile?.randomizer ?? NO_CONNECTION, patch };
};

export { useOnlineConnection };

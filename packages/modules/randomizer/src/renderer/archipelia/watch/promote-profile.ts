/* @layer renderer-shell @kind logic */
import { loadProfile } from '@drizztdourden08/brock-react';
import type { LobbyStart } from '../../../archipelago/lobby';
import { appRandomizerLog } from '../../../session/log/app-randomizer-log';
import { promotionOf } from '../membership/promotion-of';
import { updateLobbyProfile } from './update-lobby-profile';

const promoteProfile = async (profileId: string, start: LobbyStart, lobbyServer: string): Promise<void> => {
  const profile = await loadProfile(profileId);
  if (!profile?.randomizer) return;
  await updateLobbyProfile(profileId, { randomizer: promotionOf(profile.randomizer, start, lobbyServer) });
  appRandomizerLog(`Archipelia room started for ${profile.name}`);
};

export { promoteProfile };

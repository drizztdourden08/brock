/* @layer renderer-shell @kind logic */
import { loadProfile } from '@drizztdourden08/brock-react';
import { movedRoomUrlsOf } from '../membership/moved-room-urls-of';
import { updateLobbyProfile } from './update-lobby-profile';

const followRoom = async (profileId: string, address: string, lobbyServer: string): Promise<void> => {
  const profile = await loadProfile(profileId);
  if (profile?.randomizer?.mode !== 'online') return;
  const { fallbackServerUrl, ...rest } = profile.randomizer;
  const urls = movedRoomUrlsOf(lobbyServer, address, fallbackServerUrl !== undefined);
  await updateLobbyProfile(profileId, { randomizer: { ...rest, ...urls } });
};

export { followRoom };

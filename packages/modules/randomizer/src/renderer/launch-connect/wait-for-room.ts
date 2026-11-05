/* @layer renderer-shell @kind logic */
import { listProfiles } from '@drizztdourden08/brock-react';
import { useLobbyStatusStore } from '../archipelia/store/useLobbyStatusStore';
import { LOBBY_GIVEN_UP_STATES, ROOM_NOTE_MS, ROOM_POLL_MS, ROOM_WAIT_MS } from './launch-connect.constants';
import type { LaunchConnectHost } from './launch-connect.type';

const pause = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const isOnlineProfile = async (profileId: string): Promise<boolean> => {
  const found = (await listProfiles()).find((candidate) => candidate.id === profileId);
  const mode: string | undefined = found?.randomizer?.mode;
  return mode === 'online';
};

const lobbyStateOf = (profileId: string) => useLobbyStatusStore.getState().members[profileId]?.state;

const waitForRoom = async (host: LaunchConnectHost, profileId: string): Promise<boolean> => {
  const began = Date.now();
  let noted = began;
  while (Date.now() - began < ROOM_WAIT_MS) {
    if (await isOnlineProfile(profileId)) return true;
    const state = lobbyStateOf(profileId);
    if (state !== undefined && LOBBY_GIVEN_UP_STATES.has(state.kind)) {
      host.log(`[LaunchConnect] The lobby gave up on this profile (${state.kind})`, 'error');
      return false;
    }
    if (Date.now() - noted >= ROOM_NOTE_MS) {
      noted = Date.now();
      host.log(`[LaunchConnect] Waiting for the lobby to start its room (${state?.kind ?? 'unknown'})`);
    }
    await pause(ROOM_POLL_MS);
  }
  host.log('[LaunchConnect] The lobby never started its room', 'error');
  return false;
};

export { waitForRoom };

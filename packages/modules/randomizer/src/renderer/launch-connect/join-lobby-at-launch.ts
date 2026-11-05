/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import type { LobbyJoin } from '../../archipelago/launch-flags';
import { checkedLobby } from './checked-lobby';
import { enterWithProfile } from './enter-with-profile';
import type { LaunchConnectHost } from './launch-connect.type';
import { pickLaunchProfile } from './pick-launch-profile';
import { refuseLobbyJoin } from './refuse-lobby-join';
import { waitForRoom } from './wait-for-room';

const createForLobby = async (host: LaunchConnectHost, active: Profile, name: string, lobby: LobbyJoin & { code: string }): Promise<Profile | null> => {
  const check = await checkedLobby(host, lobby.server, lobby.code);
  return check === null ? null : host.createLobbyProfile(active, name, check);
};

const joinLobbyAtLaunch = async (host: LaunchConnectHost, active: Profile, lobby: LobbyJoin, explicitName: string | null): Promise<Profile | null> => {
  const { server, code } = lobby;
  if (code === null) return refuseLobbyJoin(host, 'the lobby code is missing (--lobby-join=<host>[:<port>]:<code>)');
  const pick = await pickLaunchProfile(active, 'archipelia', explicitName, `${host.lobbyProfilePrefix}${code.slice(0, 4)}`);
  if (pick.kind === 'refuse') return refuseLobbyJoin(host, pick.why);
  const profile = pick.kind === 'create'
    ? await createForLobby(host, active, pick.name, { server, code })
    : await enterWithProfile(host, pick.profile, server, code);
  if (profile === null) return null;
  return (await waitForRoom(host, profile.id)) ? profile : refuseLobbyJoin(host, 'the lobby room did not open');
};

export { joinLobbyAtLaunch };

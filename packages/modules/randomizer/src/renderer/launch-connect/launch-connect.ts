/* @layer renderer-shell @kind logic */
import { listProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { applyApConnect } from './apply-ap-connect';
import { apConnectFlag } from './flags/ap-connect-flag';
import { lobbyJoinFlag } from './flags/lobby-join-flag';
import { profileNameFlag } from './flags/profile-name-flag';
import { joinLobbyAtLaunch } from './join-lobby-at-launch';
import type { LaunchConnectHost } from './launch-connect.type';

const namedProfile = async (host: LaunchConnectHost, name: string): Promise<Profile | null> => {
  const found = (await listProfiles()).find((profile) => profile.name === name);
  if (found === undefined) host.log(`--profile-name refused: there is no profile called "${name}"`, 'error');
  return found ?? null;
};

const launchConnect = async (host: LaunchConnectHost, active: Profile): Promise<Profile | null> => {
  const connect = apConnectFlag(host.log);
  const lobby = lobbyJoinFlag(host.log);
  const name = profileNameFlag();
  if (connect.kind === 'invalid' || lobby.kind === 'invalid') return null;
  if (connect.kind === 'set' && lobby.kind === 'set') {
    host.log('--ap-connect and --lobby-join cannot be combined: pick one', 'error');
    return null;
  }
  if (connect.kind === 'set') return applyApConnect(host, active, connect.value, name);
  if (lobby.kind === 'set') return joinLobbyAtLaunch(host, active, lobby.value, name);
  return name === null || name === active.name ? active : namedProfile(host, name);
};

export { launchConnect };

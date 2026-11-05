/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import type { LobbyCheckOk } from '../archipelia/check/lobby-check.type';
import { joinFromForm } from '../archipelia/join/join-from-form';
import { writeMembership } from '../archipelia/membership/write-membership';
import { lobbyWatch } from '../archipelia/watch/lobby-watch';
import type { LaunchConnectHost } from './launch-connect.type';
import { refuseLobbyJoin } from './refuse-lobby-join';

const joinWithProfile = async (host: LaunchConnectHost, profile: Profile, check: LobbyCheckOk): Promise<Profile | null> => {
  const config = profile.randomizer;
  const mode: string | undefined = config?.mode;
  if (config === undefined || mode !== 'archipelia') return refuseLobbyJoin(host, `profile "${profile.name}" is not an Archipelia profile`);
  const joined = await joinFromForm(check, config, { wanted: null, onProgress: () => undefined });
  if (!joined.ok) return refuseLobbyJoin(host, joined.error, joined.code);
  await writeMembership(profile.id, joined.membership);
  lobbyWatch.adopt(profile.id, joined.session, joined.membership);
  host.log(`[LaunchConnect] Joined lobby "${check.name}" as profile "${profile.name}"`);
  return profile;
};

export { joinWithProfile };

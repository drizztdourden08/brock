/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { isLiveMembership } from '../archipelia/membership/is-live-membership';
import { isSameLobby } from '../archipelia/membership/is-same-lobby';
import type { ArchipeliaMembership } from '../archipelia/membership/membership.type';
import { readMembership } from '../archipelia/membership/read-membership';
import { resumeMembership } from '../archipelia/watch/resume-membership';
import { checkedLobby } from './checked-lobby';
import { joinWithProfile } from './join-with-profile';
import type { LaunchConnectHost } from './launch-connect.type';
import { refuseLobbyJoin } from './refuse-lobby-join';

const resumeWithProfile = async (host: LaunchConnectHost, profile: Profile, membership: ArchipeliaMembership): Promise<Profile> => {
  await resumeMembership(profile);
  host.log(`[LaunchConnect] Profile "${profile.name}" resumes its membership of lobby "${membership.lobbyName}" (${membership.state.kind})`);
  return profile;
};

const holdsOtherLobby = (profile: Profile, membership: ArchipeliaMembership): boolean => {
  const mode: string | undefined = profile.randomizer?.mode;
  return mode !== 'archipelia' || isLiveMembership(membership);
};

const enterWithProfile = async (host: LaunchConnectHost, profile: Profile, server: string, code: string): Promise<Profile | null> => {
  const membership = await readMembership(profile.id);
  if (membership !== null && isSameLobby(membership, server, { code })) return resumeWithProfile(host, profile, membership);
  if (membership !== null && holdsOtherLobby(profile, membership)) {
    return refuseLobbyJoin(host, `profile "${profile.name}" belongs to lobby ${membership.lobby.code ?? membership.lobbyName} on ${membership.server}, not ${code}; name another profile with --profile-name`);
  }
  const check = await checkedLobby(host, server, code);
  return check === null ? null : joinWithProfile(host, profile, check);
};

export { enterWithProfile };

/* @layer renderer-shell @kind logic */
import { loadProfile, updateProfile } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ApConnect } from '../../archipelago/launch-flags';
import type { LaunchConnectHost } from './launch-connect.type';
import { pickLaunchProfile } from './pick-launch-profile';

const refuse = (host: LaunchConnectHost, why: string): null => {
  host.log(`--ap-connect refused: ${why}`, 'error');
  return null;
};

const repoint = async (host: LaunchConnectHost, profile: Profile, connect: ApConnect): Promise<Profile | null> => {
  const stored = await loadProfile(profile.id);
  if (stored === null) return refuse(host, `profile "${profile.name}" is gone`);
  const mode: string | undefined = stored.randomizer?.mode;
  if (stored.randomizer === undefined || mode !== 'online') {
    return refuse(host, `profile "${profile.name}" is not an Archipelago (online) profile`);
  }
  const randomizer = host.repoint(stored.randomizer, connect);
  const updated = await updateProfile(profile.id, { randomizer });
  if (updated === null) return refuse(host, `profile "${profile.name}" could not be updated`);
  host.log(`[LaunchConnect] Profile "${profile.name}" points at ${connect.host}:${connect.port} as slot ${connect.slot}`);
  return profile;
};

const applyApConnect = async (host: LaunchConnectHost, active: Profile, connect: ApConnect, explicitName: string | null): Promise<Profile | null> => {
  const pick = await pickLaunchProfile(active, 'online', explicitName, connect.slot);
  if (pick.kind === 'refuse') return refuse(host, pick.why);
  if (pick.kind === 'create') return host.createOnlineProfile(active, pick.name, connect);
  return repoint(host, pick.profile, connect);
};

export { applyApConnect };

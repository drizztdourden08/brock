/* @layer renderer-shell @kind logic */
import { listProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { inLobby } from '../archipelia/membership/in-lobby';
import { MODE_WORDS } from './launch-connect.constants';
import type { LaunchMode, LaunchProfilePick } from './launch-connect.type';

const isMode = (profile: Profile, mode: LaunchMode): boolean => {
  const current: string | undefined = profile.randomizer?.mode;
  return current === mode;
};

const fitsByName = (profile: Profile, mode: LaunchMode): boolean =>
  isMode(profile, mode) || (mode === 'archipelia' && inLobby(profile));

const pickLaunchProfile = async (
  active: Profile,
  mode: LaunchMode,
  explicitName: string | null,
  fallbackName: string,
): Promise<LaunchProfilePick> => {
  const profiles = await listProfiles();
  if (explicitName === null && isMode(active, mode)) return { kind: 'use', profile: active };
  const name = explicitName ?? fallbackName;
  const found = profiles.find((profile) => profile.name === name);
  if (found === undefined) return { kind: 'create', name };
  if (fitsByName(found, mode)) return { kind: 'use', profile: found };
  return { kind: 'refuse', why: `profile "${name}" exists but is not ${MODE_WORDS[mode]} profile` };
};

export { pickLaunchProfile };

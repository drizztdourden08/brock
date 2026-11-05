/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import { inLobby } from '../membership/in-lobby';
import { resumeMembership } from './resume-membership';

const resumeMemberships = async (profiles: readonly Profile[]): Promise<void> => {
  await Promise.all(profiles.filter(inLobby).map(resumeMembership));
};

export { resumeMemberships };

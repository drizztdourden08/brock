/* @layer renderer-shell @kind logic */
import { profileDir } from '@drizztdourden08/brock-core';
import { PLACEMENT_FILE } from './placement.constants';

const placementPath = (profileId: string): string => `${profileDir(profileId)}/${PLACEMENT_FILE}`;

export { placementPath };

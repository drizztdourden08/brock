/* @layer renderer-shell @kind logic */
import { profileDir } from '@drizztdourden08/brock-core';
import { TRACKER_FILE } from './tracker-marks.constants';

const trackerPath = (profileId: string): string => `${profileDir(profileId)}/${TRACKER_FILE}`;

export { trackerPath };

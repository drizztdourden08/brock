/* @layer renderer-shell @kind logic */
import { readJson } from '@drizztdourden08/brock-core';
import { getPlatform } from '@drizztdourden08/brock-react';
import { marksFromRaw } from '../../../tracker';
import { trackerPath } from './tracker-path';

const readTrackerMarks = async (profileId: string): Promise<ReadonlySet<string>> => {
  const raw = await readJson<unknown>(getPlatform().files, trackerPath(profileId), null);
  return new Set(marksFromRaw(raw));
};

export { readTrackerMarks };

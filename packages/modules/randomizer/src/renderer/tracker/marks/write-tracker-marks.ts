/* @layer renderer-shell @kind logic */
import { profileDir, writeJson } from '@drizztdourden08/brock-core';
import { getPlatform } from '@drizztdourden08/brock-react';
import { appRandomizerLog } from '../../../session';
import { TRACKER_SCHEMA } from '../../../tracker';
import { trackerPath } from './tracker-path';

const queue = { tail: Promise.resolve() };

const save = async (profileId: string, marks: ReadonlySet<string>): Promise<void> => {
  try {
    const { files } = getPlatform();
    await files.mkdir(profileDir(profileId));
    await writeJson(files, trackerPath(profileId), { schema: TRACKER_SCHEMA, marks: [...marks] });
  } catch (error) {
    appRandomizerLog(`[Tracker] Could not save marks: ${String(error)}`, 'warn');
  }
};

const writeTrackerMarks = (profileId: string, marks: ReadonlySet<string>): Promise<void> => {
  queue.tail = queue.tail.then(() => save(profileId, marks));
  return queue.tail;
};

export { writeTrackerMarks };

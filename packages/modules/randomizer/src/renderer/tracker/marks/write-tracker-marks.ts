/* @layer renderer-shell @kind logic */
import { profileDir, writeJson } from '@drizztdourden08/brock-core';
import { getPlatform } from '@drizztdourden08/brock-react';
import { appRandomizerLog } from '../../../session/log/app-randomizer-log';
import { TRACKER_SCHEMA } from '../../../tracker';
import { marksWriteQueue } from './marks-write-queue';
import { trackerPath } from './tracker-path';

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
  marksWriteQueue.tail = marksWriteQueue.tail.then(() => save(profileId, marks));
  return marksWriteQueue.tail;
};

export { writeTrackerMarks };

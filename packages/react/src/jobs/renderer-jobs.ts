/* @layer renderer-shell @kind logic */
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import { getAppLog } from '../log/get-app-log';
import { useJobStore } from './useJobStore';

const rendererJobs = createJobRegistry(
  (snapshot) => useJobStore.getState().upsert(snapshot),
  Date.now,
  (jobId, line) => getAppLog().log('app', `[job ${jobId}] ${line.message}`, line.level),
);

export { rendererJobs };

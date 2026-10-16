/* @layer renderer-shell @kind logic */
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import { useJobStore } from './useJobStore';

const rendererJobs = createJobRegistry((snapshot) => useJobStore.getState().upsert(snapshot));

export { rendererJobs };

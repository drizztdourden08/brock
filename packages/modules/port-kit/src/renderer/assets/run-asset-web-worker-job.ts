/* @layer renderer-shell @kind logic */
import { jobs } from '@drizztdourden08/brock-react';
import { startAssetJob } from '../../assets/worker/start-asset-job';
import type { AssetWebWorkerJobOptions, SpawnAssetWebWorker } from './asset-web-worker-job.type';
import { spawnAssetWebWorker } from './spawn-asset-web-worker';

const runAssetWebWorkerJob = (
  options: AssetWebWorkerJobOptions, spawn: SpawnAssetWebWorker = spawnAssetWebWorker,
): Promise<Record<string, unknown>> =>
  startAssetJob(options.start ?? jobs.start, options, () => spawn(options.worker, options.workerData));

export { runAssetWebWorkerJob };

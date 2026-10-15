/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { startAssetJob } from '../../assets/worker/start-asset-job';
import type { AssetWorkerJobOptions, SpawnAssetWorker } from './asset-worker-job.type';
import { spawnAssetWorker } from './spawn-asset-worker';

const runAssetWorkerJob = (
  ctx: Pick<MainContext, 'job'>, options: AssetWorkerJobOptions, spawn: SpawnAssetWorker = spawnAssetWorker,
): Promise<Record<string, unknown>> => startAssetJob(ctx.job, options, () => spawn(options.worker, options.workerData));

export { runAssetWorkerJob };

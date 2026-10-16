/* @layer renderer-shell @kind types */
import type { StartJob } from '@drizztdourden08/brock-core/jobs';
import type { AssetJobOptions, AssetWorkerPort } from '../../assets/worker/asset-worker.type';

type AssetWebWorkerSource = new () => Worker;

interface AssetWebWorkerJobOptions extends AssetJobOptions {
  worker: AssetWebWorkerSource;
  workerData?: unknown;
  start?: StartJob;
}

type SpawnAssetWebWorker = (worker: AssetWebWorkerSource, workerData: unknown) => AssetWorkerPort;

export type { AssetWebWorkerSource, AssetWebWorkerJobOptions, SpawnAssetWebWorker };

/* @layer electron-main @kind types */
import type { AssetJobOptions, AssetWorkerPort } from '../../assets/worker/asset-worker.type';

interface AssetWorkerJobOptions extends AssetJobOptions {
  worker: string | URL;
  workerData?: unknown;
}

type SpawnAssetWorker = (worker: string | URL, workerData: unknown) => AssetWorkerPort;

export type { AssetWorkerJobOptions, SpawnAssetWorker };

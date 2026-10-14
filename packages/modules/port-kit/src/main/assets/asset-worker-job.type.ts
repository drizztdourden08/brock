/* @layer electron-main @kind types */
import type { AssetWorkerMessage, AssetWorkerRequest, AssetWorkerStepDef } from '../../assets/worker/asset-worker.type';

interface AssetWorkerJobOptions {
  id: string;
  title?: string;
  worker: string | URL;
  workerData?: unknown;
  steps: AssetWorkerStepDef[];
  cancellable?: boolean;
  onResult?: (step: string, result: unknown) => void | Promise<void>;
}

interface AssetWorkerPort {
  run: (request: AssetWorkerRequest) => void;
  listen: (onMessage: (message: AssetWorkerMessage) => void, onFailure: (error: Error) => void) => () => void;
  terminate: () => Promise<void>;
}

type SpawnAssetWorker = (worker: string | URL, workerData: unknown) => AssetWorkerPort;

export type { AssetWorkerJobOptions, AssetWorkerPort, SpawnAssetWorker };

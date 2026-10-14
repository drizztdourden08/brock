/* @layer electron-main @kind logic */
import { Worker } from 'node:worker_threads';
import type { AssetWorkerMessage } from '../../assets/worker/asset-worker.type';
import type { SpawnAssetWorker } from './asset-worker-job.type';

const spawnAssetWorker: SpawnAssetWorker = (worker, workerData) => {
  const thread = new Worker(worker, { workerData });
  let ending = false;
  return {
    run: (request) => thread.postMessage(request),
    listen: (onMessage, onFailure) => {
      const message = (value: AssetWorkerMessage): void => onMessage(value);
      const error = (value: Error): void => onFailure(value);
      const exit = (code: number): void => {
        if (!ending) onFailure(new Error(`The asset worker stopped with code ${code}.`));
      };
      thread.on('message', message);
      thread.on('error', error);
      thread.on('exit', exit);
      return () => {
        thread.off('message', message);
        thread.off('error', error);
        thread.off('exit', exit);
      };
    },
    terminate: async () => {
      ending = true;
      await thread.terminate();
    },
  };
};

export { spawnAssetWorker };

/* @layer renderer-shell @kind logic */
import type { AssetWorkerMessage, AssetWorkerRequest } from '../../assets/worker/asset-worker.type';
import type { SpawnAssetWebWorker } from './asset-web-worker-job.type';

const spawnAssetWebWorker: SpawnAssetWebWorker = (WorkerSource, workerData) => {
  const thread = new WorkerSource();
  const post = (request: AssetWorkerRequest): void => thread.postMessage(request);
  if (workerData !== undefined) post({ type: 'data', data: workerData });
  return {
    run: post,
    listen: (onMessage, onFailure) => {
      const message = (event: MessageEvent<AssetWorkerMessage>): void => onMessage(event.data);
      const error = (event: ErrorEvent): void => {
        event.preventDefault();
        onFailure(new Error(event.message || 'The asset worker failed.'));
      };
      const unreadable = (): void => onFailure(new Error('The asset worker sent a message that could not be read.'));
      thread.addEventListener('message', message);
      thread.addEventListener('error', error);
      thread.addEventListener('messageerror', unreadable);
      return () => {
        thread.removeEventListener('message', message);
        thread.removeEventListener('error', error);
        thread.removeEventListener('messageerror', unreadable);
      };
    },
    terminate: () => {
      thread.terminate();
      return Promise.resolve();
    },
  };
};

export { spawnAssetWebWorker };

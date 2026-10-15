/* @layer electron-main @kind logic */
import { parentPort, workerData } from 'node:worker_threads';
import type { MessagePort } from 'node:worker_threads';
import type { AssetWorkerRequest, AssetWorkerSteps } from '../assets/worker/asset-worker.type';
import { serveStepsOn } from '../assets/worker/serve-steps-on';

const serveAssetSteps = (steps: AssetWorkerSteps, port: MessagePort | null = parentPort, data: unknown = workerData): void => {
  if (!port) throw new Error('serveAssetSteps runs inside a worker thread.');
  serveStepsOn({
    post: (message, transfer) => port.postMessage(message, transfer),
    listen: (onRequest) => port.on('message', (request: AssetWorkerRequest) => onRequest(request)),
  }, steps, data);
};

export { serveAssetSteps };

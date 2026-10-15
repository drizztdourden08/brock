/* @layer core @kind logic */
import type { AssetWorkerSteps } from '../assets/worker/asset-worker.type';
import { serveStepsOn } from '../assets/worker/serve-steps-on';
import type { WebWorkerScope } from './web-worker-scope.type';

const isWorkerScope = (value: unknown): value is WebWorkerScope =>
  typeof value === 'object' && value !== null && !('document' in value)
  && 'postMessage' in value && typeof value.postMessage === 'function'
  && 'addEventListener' in value && typeof value.addEventListener === 'function';

const serveAssetSteps = (steps: AssetWorkerSteps, scope: unknown = typeof self === 'undefined' ? null : self): void => {
  if (!isWorkerScope(scope)) throw new Error('serveAssetSteps runs inside a Web Worker.');
  serveStepsOn({
    post: (message, transfer) => scope.postMessage(message, transfer),
    listen: (onRequest) => scope.addEventListener('message', (event) => onRequest(event.data)),
  }, steps, undefined);
};

export { serveAssetSteps };

/* @layer core @kind types */
import type { AssetWorkerRequest } from '../assets/worker/asset-worker.type';

interface WebWorkerScope {
  postMessage: (message: unknown, transfer: Transferable[]) => void;
  addEventListener: (type: 'message', listener: (event: MessageEvent<AssetWorkerRequest>) => void) => void;
}

export type { WebWorkerScope };

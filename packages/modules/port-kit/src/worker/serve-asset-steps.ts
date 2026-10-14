/* @layer electron-main @kind logic */
import { parentPort } from 'node:worker_threads';
import type { MessagePort } from 'node:worker_threads';
import type { AssetStepReport, AssetWorkerMessage, AssetWorkerRequest, AssetWorkerSteps } from '../assets/worker/asset-worker.type';
import { transferablesOf } from '../assets/worker/transferables-of';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const reportFor = (port: MessagePort, step: string): AssetStepReport => {
  const post = (message: AssetWorkerMessage): void => port.postMessage(message);
  return {
    progress: (fraction, line) => post({ type: 'progress', step, fraction, ...(line === undefined ? {} : { line }) }),
    line: (text) => post({ type: 'line', step, text }),
    log: (message, level) => post({ type: 'log', step, message, ...(level ? { level } : {}) }),
  };
};

const runStep = async (port: MessagePort, steps: AssetWorkerSteps, { step, input }: AssetWorkerRequest): Promise<void> => {
  try {
    const work = steps[step];
    if (!work) throw new Error(`The asset worker has no step "${step}".`);
    const result = await work(input, reportFor(port, step));
    port.postMessage({ type: 'done', step, result } satisfies AssetWorkerMessage, transferablesOf(result));
  } catch (error) {
    port.postMessage({ type: 'error', step, message: messageOf(error) } satisfies AssetWorkerMessage);
  }
};

const serveAssetSteps = (steps: AssetWorkerSteps, port: MessagePort | null = parentPort): void => {
  if (!port) throw new Error('serveAssetSteps runs inside a worker thread.');
  port.on('message', (request: AssetWorkerRequest) => void runStep(port, steps, request));
};

export { serveAssetSteps };

/* @layer core @kind test */
import { parentPort, workerData } from 'node:worker_threads';

parentPort.on('message', ({ step, input }) => {
  if (step === 'crash') process.exit(3);
  parentPort.postMessage({ type: 'progress', step, fraction: 0.5 });
  parentPort.postMessage({ type: 'done', step, result: { step, input, workerData } });
});

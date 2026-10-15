/* @layer core @kind logic */
import type { AssetStepChannel, AssetStepReport, AssetWorkerMessage, AssetWorkerSteps } from './asset-worker.type';
import { transferablesOf } from './transferables-of';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const reportFor = (channel: AssetStepChannel, step: string): AssetStepReport => {
  const post = (message: AssetWorkerMessage): void => channel.post(message, []);
  return {
    progress: (fraction, line) => post({ type: 'progress', step, fraction, ...(line === undefined ? {} : { line }) }),
    line: (text) => post({ type: 'line', step, text }),
    log: (message, level) => post({ type: 'log', step, message, ...(level ? { level } : {}) }),
  };
};

const runStep = async (channel: AssetStepChannel, steps: AssetWorkerSteps, step: string, run: { input: unknown; data: unknown }): Promise<void> => {
  try {
    const work = steps[step];
    if (!work) throw new Error(`The asset worker has no step "${step}".`);
    const result = await work(run.input, reportFor(channel, step), run.data);
    channel.post({ type: 'done', step, result }, transferablesOf(result));
  } catch (error) {
    channel.post({ type: 'error', step, message: messageOf(error) }, []);
  }
};

const serveStepsOn = (channel: AssetStepChannel, steps: AssetWorkerSteps, initialData: unknown): void => {
  let data = initialData;
  channel.listen((request) => {
    if (request.type === 'data') data = request.data;
    else void runStep(channel, steps, request.step, { input: request.input, data });
  });
};

export { serveStepsOn };

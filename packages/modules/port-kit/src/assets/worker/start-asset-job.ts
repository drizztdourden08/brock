/* @layer core @kind logic */
import type { JobHandle, StartJob } from '@drizztdourden08/brock-core/jobs';
import type { AssetJobOptions, AssetWorkerMessage, AssetWorkerPort, AssetWorkerStepDef } from './asset-worker.type';

const report = (job: JobHandle, message: AssetWorkerMessage): void => {
  if (message.type === 'progress') job.progress(message.fraction, message.line);
  else if (message.type === 'line') job.line(message.text);
  else if (message.type === 'log') job.log(message.message, message.level);
};

const runStep = (port: AssetWorkerPort, job: JobHandle, step: AssetWorkerStepDef): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const cleanups: (() => void)[] = [];
    const settle = (finish: () => void): void => {
      for (const cleanup of cleanups) cleanup();
      finish();
    };
    const cancel = (): void => settle(() => reject(new Error('Cancelled.')));
    cleanups.push(port.listen((message) => {
      if (message.step !== step.id) return;
      report(job, message);
      if (message.type === 'error') settle(() => reject(new Error(message.message)));
      if (message.type === 'done') settle(() => resolve(message.result));
    }, (error) => settle(() => reject(error))));
    cleanups.push(() => job.signal.removeEventListener('abort', cancel));
    if (job.signal.aborted) return cancel();
    job.signal.addEventListener('abort', cancel, { once: true });
    port.run({ type: 'run', step: step.id, input: step.input });
  });

const runSteps = async (port: AssetWorkerPort, job: JobHandle, options: AssetJobOptions): Promise<Record<string, unknown>> => {
  const results: Record<string, unknown> = {};
  for (const step of options.steps) {
    job.step(step.id);
    const result = await runStep(port, job, step);
    results[step.id] = result;
    await options.onResult?.(step.id, result);
  }
  return results;
};

const startAssetJob = (start: StartJob, options: AssetJobOptions, spawn: () => AssetWorkerPort): Promise<Record<string, unknown>> => {
  const { id, title, steps, cancellable = true } = options;
  const defs = steps.map(({ id: stepId, label, weight }) => ({ id: stepId, label, ...(weight === undefined ? {} : { weight }) }));
  const job = start(id, defs, { cancellable, ...(title ? { title } : {}) });
  return job.run(async () => {
    const port = spawn();
    const abort = (): void => void port.terminate();
    job.signal.addEventListener('abort', abort, { once: true });
    try {
      return await runSteps(port, job, options);
    } finally {
      job.signal.removeEventListener('abort', abort);
      await port.terminate();
    }
  });
};

export { startAssetJob };

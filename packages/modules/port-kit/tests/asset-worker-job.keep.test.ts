/* @layer core @kind test */
import { MessageChannel } from 'node:worker_threads';
import { describe, expect, it } from 'vitest';
import type { AssetWorkerMessage, AssetWorkerSteps } from '../src/assets/worker/asset-worker.type';
import type { SpawnAssetWorker } from '../src/main/assets/asset-worker-job.type';
import { runAssetWorkerJob } from '../src/main/assets/run-asset-worker-job';
import { serveAssetSteps } from '../src/worker/serve-asset-steps';
import { ASSET_STEPS as STEPS } from './fakes/asset-steps';
import { fakeJob } from './fakes/fake-job';

const channelWorker = (steps: AssetWorkerSteps): { spawn: SpawnAssetWorker; terminated: () => boolean } => {
  let terminated = false;
  const spawn: SpawnAssetWorker = (_worker, workerData) => {
    const { port1, port2 } = new MessageChannel();
    serveAssetSteps(steps, port1, workerData);
    return {
      run: (request) => port2.postMessage(request),
      listen: (onMessage) => {
        const handler = (message: AssetWorkerMessage): void => onMessage(message);
        port2.on('message', handler);
        return () => port2.off('message', handler);
      },
      terminate: () => {
        terminated = true;
        port1.close();
        port2.close();
        return Promise.resolve();
      },
    };
  };
  return { spawn, terminated: () => terminated };
};

describe('runAssetWorkerJob', () => {
  it('runs the app steps in order and reports through the job', async () => {
    const jobs = fakeJob();
    const worker = channelWorker(STEPS);
    const seen: string[] = [];
    const results = await runAssetWorkerJob(jobs.ctx, {
      id: 'assets', worker: 'unused', steps: [{ id: 'tiles', label: 'Tiles', weight: 3, input: 7 }, { id: 'sounds', label: 'Sounds' }],
      onResult: (step) => { seen.push(step); },
    }, worker.spawn);
    expect(Array.from(results.tiles as Uint8Array)).toEqual([7, 2]);
    expect(results.sounds).toEqual({ count: 3 });
    expect(seen).toEqual(['tiles', 'sounds']);
    expect(jobs.steps).toEqual([{ id: 'tiles', label: 'Tiles', weight: 3 }, { id: 'sounds', label: 'Sounds' }]);
    expect(jobs.events).toEqual(['step tiles', 'progress 0.5 half', 'log tiles ready', 'step sounds', 'line mixing', 'done']);
    expect(worker.terminated()).toBe(true);
  });

  it('fails the job with the step error and ends the worker', async () => {
    const jobs = fakeJob();
    const worker = channelWorker(STEPS);
    await expect(runAssetWorkerJob(jobs.ctx, { id: 'a', worker: 'x', steps: [{ id: 'broken', label: 'B' }, { id: 'tiles', label: 'T' }] }, worker.spawn))
      .rejects.toThrow('bad chunk');
    expect(jobs.events).toEqual(['step broken', 'fail bad chunk']);
    expect(worker.terminated()).toBe(true);
  });

  it('hands each step the worker data', async () => {
    const jobs = fakeJob();
    const results = await runAssetWorkerJob(jobs.ctx, { id: 'a', worker: 'x', workerData: { rom: 'r' }, steps: [{ id: 'source', label: 'S', input: 2 }] }, channelWorker(STEPS).spawn);
    expect(results.source).toEqual({ input: 2, data: { rom: 'r' } });
  });

  it('fails a step the worker does not have', async () => {
    const jobs = fakeJob();
    await expect(runAssetWorkerJob(jobs.ctx, { id: 'a', worker: 'x', steps: [{ id: 'nope', label: 'N' }] }, channelWorker(STEPS).spawn))
      .rejects.toThrow('no step "nope"');
  });

  it('stops the worker when the job is cancelled', async () => {
    const jobs = fakeJob();
    const worker = channelWorker(STEPS);
    const running = runAssetWorkerJob(jobs.ctx, { id: 'a', worker: 'x', steps: [{ id: 'slow', label: 'S' }] }, worker.spawn);
    jobs.controller.abort();
    await expect(running).rejects.toThrow('Cancelled.');
    expect(worker.terminated()).toBe(true);
    expect(jobs.events).toEqual(['step slow']);
  });
});

describe('runAssetWorkerJob in a worker thread', () => {
  const worker = new URL('./fakes/echo-asset-worker.mjs', import.meta.url);

  it('posts each step to a real worker with its data', async () => {
    const jobs = fakeJob();
    const results = await runAssetWorkerJob(jobs.ctx, { id: 'a', worker, workerData: { rom: 'x' }, steps: [{ id: 'one', label: 'One', input: 1 }] });
    expect(results.one).toEqual({ step: 'one', input: 1, workerData: { rom: 'x' } });
    expect(jobs.events).toEqual(['step one', 'progress 0.5', 'done']);
  });

  it('fails when the worker exits', async () => {
    const jobs = fakeJob();
    await expect(runAssetWorkerJob(jobs.ctx, { id: 'a', worker, steps: [{ id: 'crash', label: 'Crash' }] })).rejects.toThrow('code 3');
  });
});

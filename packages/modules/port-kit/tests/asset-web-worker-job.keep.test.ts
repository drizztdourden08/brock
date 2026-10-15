/* @layer core @kind test */
import '@vitest/web-worker';
import { describe, expect, it, vi } from 'vitest';
import { jobs } from '@drizztdourden08/brock-react';
import { runAssetWebWorkerJob } from '../src/renderer/assets/run-asset-web-worker-job';
import { spawnAssetWebWorker } from '../src/renderer/assets/spawn-asset-web-worker';
import type { SpawnAssetWebWorker } from '../src/renderer/assets/asset-web-worker-job.type';
import AssetStepsWorker from './fakes/asset-steps.worker?worker';
import { fakeJob } from './fakes/fake-job';

const counted = (): { spawn: SpawnAssetWebWorker; ended: () => boolean } => {
  let ended = false;
  const spawn: SpawnAssetWebWorker = (worker, data) => {
    const port = spawnAssetWebWorker(worker, data);
    return { ...port, terminate: () => { ended = true; return port.terminate(); } };
  };
  return { spawn, ended: () => ended };
};

describe('runAssetWebWorkerJob in a Web Worker', () => {
  it('runs the shared steps in the worker and reports through the job', async () => {
    const job = fakeJob();
    const worker = counted();
    const seen: string[] = [];
    const steps = [{ id: 'tiles', label: 'Tiles', weight: 3, input: 7 }, { id: 'sounds', label: 'Sounds' }];
    const results = await runAssetWebWorkerJob({ id: 'assets', worker: AssetStepsWorker, start: job.ctx.job, steps, onResult: (step) => { seen.push(step); } }, worker.spawn);
    expect({ ...results, tiles: Array.from(results.tiles as Uint8Array) }).toEqual({ tiles: [7, 2], sounds: { count: 3 } });
    expect({ seen, ended: worker.ended(), defs: job.steps }).toEqual({ seen: ['tiles', 'sounds'], ended: true, defs: steps.map(({ input: _input, ...def }) => def) });
    expect(job.events.join(' | ')).toBe('step tiles | progress 0.5 half | log tiles ready | step sounds | line mixing | done');
  });

  it('hands each step the worker data', async () => {
    const job = fakeJob();
    const results = await runAssetWebWorkerJob({
      id: 'a', worker: AssetStepsWorker, workerData: { rom: new Uint8Array([4]) }, start: job.ctx.job, steps: [{ id: 'source', label: 'S', input: 'en' }],
    });
    expect(results.source).toEqual({ input: 'en', data: { rom: new Uint8Array([4]) } });
  });

  it('fails the job with the step error, or a step the worker lacks, and ends the worker', async () => {
    const job = fakeJob();
    const worker = counted();
    await expect(runAssetWebWorkerJob({ id: 'a', worker: AssetStepsWorker, start: job.ctx.job, steps: [{ id: 'broken', label: 'B' }, { id: 'tiles', label: 'T' }] }, worker.spawn))
      .rejects.toThrow('bad chunk');
    expect(job.events).toEqual(['step broken', 'fail bad chunk']);
    expect(worker.ended()).toBe(true);
    await expect(runAssetWebWorkerJob({ id: 'b', worker: AssetStepsWorker, start: fakeJob().ctx.job, steps: [{ id: 'nope', label: 'N' }] }))
      .rejects.toThrow('no step "nope"');
  });

  it('stops the worker when the job is cancelled', async () => {
    const job = fakeJob();
    const worker = counted();
    const running = runAssetWebWorkerJob({ id: 'a', worker: AssetStepsWorker, start: job.ctx.job, steps: [{ id: 'slow', label: 'S' }] }, worker.spawn);
    await vi.waitFor(() => expect(job.events).toContain('line waiting'));
    job.controller.abort();
    await expect(running).rejects.toThrow('Cancelled.');
    expect(worker.ended()).toBe(true);
  });
});

describe('runAssetWebWorkerJob on the renderer job store', () => {
  it('shows the job in the job store the job dialog reads, without a main process', async () => {
    await runAssetWebWorkerJob({ id: 'web-assets', title: 'Building the assets', worker: AssetStepsWorker, steps: [{ id: 'tiles', label: 'Tiles', input: 1 }] });
    expect(jobs.get('web-assets')).toMatchObject({ title: 'Building the assets', state: 'done', progress: 1, steps: [{ id: 'tiles', state: 'done' }] });
    jobs.dismiss('web-assets');
    expect(jobs.get('web-assets')).toBeNull();
  });

  it('cancels through the job controls the dialog uses', async () => {
    const running = runAssetWebWorkerJob({ id: 'web-slow', worker: AssetStepsWorker, steps: [{ id: 'slow', label: 'Slow' }] });
    await vi.waitFor(() => expect(jobs.get('web-slow')).toMatchObject({ state: 'running', line: 'waiting' }));
    jobs.cancel('web-slow');
    await expect(running).rejects.toThrow('Cancelled.');
    expect(jobs.get('web-slow')?.state).toBe('cancelled');
  });
});

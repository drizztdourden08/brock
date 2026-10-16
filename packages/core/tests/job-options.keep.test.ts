/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { JobLogLine, JobSnapshot } from '@drizztdourden08/brock-core/types';
import { createJobRegistry } from '../src/jobs/create-job-registry';

const STEPS = [{ id: 'fetch', label: 'Fetch' }, { id: 'save', label: 'Save' }];

const setup = () => {
  const emitted: JobSnapshot[] = [];
  const forwarded: [string, JobLogLine][] = [];
  const registry = createJobRegistry((snapshot) => emitted.push(snapshot), () => 5, (id, line) => forwarded.push([id, line]));
  const latest = (id: string): JobSnapshot | undefined => emitted.filter((snapshot) => snapshot.id === id).at(-1);
  return { registry, emitted, forwarded, latest };
};

describe('quiet jobs', () => {
  it('marks a job started with visible: false in its snapshot, and every other job visible', () => {
    const { registry, latest } = setup();
    registry.start('thumbs', STEPS, { visible: false }).step('fetch');
    registry.start('export', STEPS);
    expect(latest('thumbs')).toMatchObject({ visible: false, currentStep: 'fetch' });
    expect(latest('export')?.visible).toBe(true);
  });
});

describe('forwarding the job log', () => {
  it('hands each log line of a job started with forwardLog to the sink with the job id, and keeps the others to the job', () => {
    const { registry, forwarded } = setup();
    const job = registry.start('sync', STEPS, { forwardLog: true });
    registry.start('other', STEPS).log('stays in the job');
    job.log('fetched 3 files');
    job.fail(new Error('disk full'));
    expect(forwarded).toEqual([
      ['sync', { at: 5, level: 'info', message: 'fetched 3 files' }],
      ['sync', { at: 5, level: 'error', message: 'disk full' }],
    ]);
  });

  it('forwards nothing when the registry has no sink', () => {
    const registry = createJobRegistry(() => undefined);
    expect(() => registry.start('sync', STEPS, { forwardLog: true }).log('no sink')).not.toThrow();
  });
});

describe('the duplicate id policy: throw and queue', () => {
  it('throws by default, and ends with started and ended promises on the handle', async () => {
    const { registry } = setup();
    const job = registry.start('scan', STEPS);
    expect(() => registry.start('scan', STEPS)).toThrow('job "scan" is already running');
    expect(() => registry.start('scan', STEPS, { onDuplicate: 'throw' })).toThrow(/already running/);
    await expect(job.started).resolves.toBeUndefined();
    job.done();
    await expect(job.ended).resolves.toBe('done');
  });

  it('queues the new job after the running one, in order, under the same id', async () => {
    const { registry, latest } = setup();
    const order: string[] = [];
    const first = registry.start('scan', STEPS);
    const second = registry.start('scan', STEPS, { onDuplicate: 'queue', title: 'Second' });
    const third = registry.start('scan', STEPS, { onDuplicate: 'queue', title: 'Third' });
    expect(second.id).toBe('scan');
    second.step('fetch');
    expect(latest('scan')?.title).toBe('scan');
    const secondRun = second.run(async () => { order.push('second'); return Promise.resolve(2); });
    const thirdRun = third.run(async () => { order.push('third'); return Promise.resolve(3); });
    await Promise.resolve();
    expect(order).toEqual([]);
    expect(() => registry.start('scan', STEPS)).toThrow(/already running/);
    first.done();
    await expect(secondRun).resolves.toBe(2);
    await expect(thirdRun).resolves.toBe(3);
    expect(order).toEqual(['second', 'third']);
    expect(latest('scan')).toMatchObject({ title: 'Third', state: 'done' });
    await expect(second.ended).resolves.toBe('done');
  });

  it('starts a queued job when the running one is cancelled or fails, and gives it its own signal', async () => {
    const { registry, latest } = setup();
    registry.start('scan', STEPS);
    const queued = registry.start('scan', STEPS, { onDuplicate: 'queue', title: 'After' });
    registry.cancel('scan');
    await queued.started;
    expect(queued.signal.aborted).toBe(false);
    expect(latest('scan')).toMatchObject({ title: 'After', state: 'running' });
    registry.cancel('scan');
    expect(queued.signal.aborted).toBe(true);
    await expect(queued.ended).resolves.toBe('cancelled');
  });

});

describe('the duplicate id policy: parallel and join', () => {
  it('runs a parallel job under the first free suffixed id, keeping the title', () => {
    const { registry, latest } = setup();
    registry.start('scan', STEPS, { title: 'Scanning' });
    const second = registry.start('scan', STEPS, { onDuplicate: 'parallel', title: 'Scanning' });
    const third = registry.start('scan', STEPS, { onDuplicate: 'parallel' });
    expect([second.id, third.id]).toEqual(['scan-2', 'scan-3']);
    expect(latest('scan-3')?.title).toBe('scan');
    second.done();
    expect(registry.start('scan', STEPS, { onDuplicate: 'parallel' }).id).toBe('scan-2');
  });

  it('joins the running job: the same job and signal, and run waits for its work instead of running again', async () => {
    const { registry, emitted } = setup();
    const work = vi.fn(async () => Promise.resolve('loaded'));
    let finish: () => void = () => undefined;
    const first = registry.start('load', STEPS);
    const firstRun = first.run(async () => {
      await new Promise<void>((resolve) => { finish = resolve; });
      return 'loaded';
    });
    const joined = registry.start('load', STEPS, { onDuplicate: 'join' });
    expect(joined.id).toBe('load');
    expect(joined.signal).toBe(first.signal);
    joined.step('save');
    expect(emitted.at(-1)?.currentStep).toBe('save');
    const joinedRun = joined.run(work);
    finish();
    await expect(firstRun).resolves.toBe('loaded');
    await expect(joinedRun).resolves.toBe('loaded');
    expect(work).not.toHaveBeenCalled();
    expect(registry.list()).toHaveLength(1);
  });

  it('joins a job driven by hand, resolving when it is done and rejecting when it fails', async () => {
    const { registry } = setup();
    const job = registry.start('load', STEPS);
    const joined = registry.start('load', STEPS, { onDuplicate: 'join' }).run(async () => Promise.resolve(1));
    job.done();
    await expect(joined).resolves.toBeUndefined();
    const again = registry.start('load', STEPS);
    const failing = registry.start('load', STEPS, { onDuplicate: 'join' }).run(async () => Promise.resolve(1));
    again.fail(new Error('bad file'));
    await expect(failing).rejects.toThrow('job "load" failed');
  });
});

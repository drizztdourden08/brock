/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import { runBootTasks } from '../src/boot/run-boot-tasks';
import type { BootProgress, BootTask } from '../src/boot/boot-task.type';

const task = (id: string, extra: Partial<BootTask> = {}): BootTask => ({ id, label: `Task ${id}`, run: () => undefined, ...extra });

const runWith = (tasks: BootTask[], progress: BootProgress[] = []) =>
  runBootTasks(tasks, { extras: () => ({}), onProgress: (p) => progress.push(p) });

describe('K1 runBootTasks', { tags: ['critical'] }, () => {
  it('runs a task only after every task in its after list', async () => {
    const order: string[] = [];
    const log = (id: string) => async () => { await Promise.resolve(); order.push(id); };
    const outcome = await runWith([
      task('settings', { after: ['profiles'], run: log('settings') }),
      task('profiles', { run: log('profiles') }),
      task('first-frame', { after: ['settings', 'fonts'], run: log('first-frame') }),
      task('fonts', { run: log('fonts') }),
    ]);
    expect(outcome).toEqual({ ok: true });
    expect(order.indexOf('settings')).toBeGreaterThan(order.indexOf('profiles'));
    expect(order.at(-1)).toBe('first-frame');
  });

});

describe('K1 runBootTasks failures', { tags: ['critical'] }, () => {
  it('fails a task that passes its timeout and aborts its signal', async () => {
    vi.useFakeTimers();
    let aborted = false;
    const pending = runWith([
      task('stuck', {
        timeoutMs: 20,
        run: ({ signal }) => new Promise<void>(() => { signal.addEventListener('abort', () => { aborted = true; }); }),
      }),
    ]);
    await vi.advanceTimersByTimeAsync(25);
    const outcome = await pending;
    vi.useRealTimers();
    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.failure).toMatchObject({ task: 'stuck', timedOut: true });
    expect(aborted).toBe(true);
  });

  it('stops on the first failure, reports it and never starts dependent tasks', async () => {
    let dependentRan = false;
    const outcome = await runWith([
      task('profiles', { run: () => { throw new Error('profiles folder unreadable'); } }),
      task('settings', { after: ['profiles'], run: () => { dependentRan = true; } }),
    ]);
    expect(outcome).toEqual({ ok: false, failure: { task: 'profiles', label: 'Task profiles', message: 'profiles folder unreadable', timedOut: false } });
    expect(dependentRan).toBe(false);
  });

});

describe('K1 runBootTasks default timeout', { tags: ['critical'] }, () => {
  const stuck = (extra: Partial<BootTask> = {}) => task('stuck', { run: () => new Promise<void>(() => undefined), ...extra });
  const failureAfter = async (tasks: BootTask[], defaultTimeoutMs: number | undefined, waitMs: number) => {
    vi.useFakeTimers();
    const pending = runBootTasks(tasks, { extras: () => ({}), defaultTimeoutMs });
    await vi.advanceTimersByTimeAsync(waitMs);
    const settled = await Promise.race([pending, Promise.resolve(null)]);
    vi.useRealTimers();
    return settled;
  };

  it('times out a task with no timeoutMs at the runner default', async () => {
    expect(await failureAfter([stuck()], 50, 49)).toBeNull();
    const outcome = await failureAfter([stuck()], 50, 51);
    expect(outcome).toMatchObject({ ok: false, failure: { task: 'stuck', timedOut: true } });
  });

  it('keeps the own timeoutMs of a task over the runner default', async () => {
    const outcome = await failureAfter([stuck({ timeoutMs: 10 })], 5_000, 11);
    expect(outcome).toMatchObject({ ok: false, failure: { timedOut: true } });
  });

  it('falls back to the 20 s constant when no default is given', async () => {
    expect(await failureAfter([stuck()], undefined, 19_999)).toBeNull();
    expect(await failureAfter([stuck()], undefined, 20_001)).toMatchObject({ ok: false });
  });
});

describe('K1 runBootTasks progress', { tags: ['critical'] }, () => {
  it('reports weighted progress with the running label and detail', async () => {
    const progress: BootProgress[] = [];
    await runWith([
      task('heavy', { weight: 3, run: ({ report }) => { report(0.5, 'half way'); } }),
      task('light', { after: ['heavy'] }),
    ], progress);
    const halfWay = progress.find((p) => p.detail === 'half way');
    expect(halfWay).toMatchObject({ done: 1.5, total: 4, label: 'Task heavy' });
    expect(progress.at(-1)).toMatchObject({ done: 4, total: 4 });
    const dones = progress.map((p) => p.done);
    expect(dones).toEqual([...dones].sort((a, b) => a - b));
  });

  it('rejects a graph with an unknown dependency or a cycle before running anything', async () => {
    let ran = false;
    const unknown = await runWith([task('a', { after: ['missing'], run: () => { ran = true; } })]);
    const cycle = await runWith([task('a', { after: ['b'] }), task('b', { after: ['a'] })]);
    expect(unknown.ok).toBe(false);
    expect(cycle.ok).toBe(false);
    expect(ran).toBe(false);
  });

  it('passes the extras to every task', async () => {
    let seen: string | null = null;
    await runBootTasks([{ id: 'a', label: 'A', run: ({ profile }: { profile: string }) => { seen = profile; } }], { extras: () => ({ profile: 'p1' }) });
    expect(seen).toBe('p1');
  });
});

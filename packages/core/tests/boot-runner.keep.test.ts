/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { runBootTasks } from '../src/boot/run-boot-tasks';
import type { BootProgress, BootTask } from '../src/boot/boot-task.type';

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const task = (id: string, extra: Partial<BootTask> = {}): BootTask => ({ id, label: `Task ${id}`, run: () => undefined, ...extra });

const runWith = (tasks: BootTask[], progress: BootProgress[] = []) =>
  runBootTasks(tasks, { extras: () => ({}), onProgress: (p) => progress.push(p) });

describe('runBootTasks', () => {
  it('runs a task only after every task in its after list', async () => {
    const order: string[] = [];
    const log = (id: string, ms: number) => async () => { await wait(ms); order.push(id); };
    const outcome = await runWith([
      task('settings', { after: ['profiles'], run: log('settings', 1) }),
      task('profiles', { run: log('profiles', 15) }),
      task('first-frame', { after: ['settings', 'fonts'], run: log('first-frame', 1) }),
      task('fonts', { run: log('fonts', 5) }),
    ]);
    expect(outcome).toEqual({ ok: true });
    expect(order.indexOf('settings')).toBeGreaterThan(order.indexOf('profiles'));
    expect(order.at(-1)).toBe('first-frame');
  });

  it('runs independent tasks together', async () => {
    const started: number[] = [];
    const slow = (ms: number) => async () => { started.push(Date.now()); await wait(ms); };
    const begun = Date.now();
    await runWith([task('a', { run: slow(40) }), task('b', { run: slow(40) }), task('c', { run: slow(40) })]);
    expect(Date.now() - begun).toBeLessThan(110);
    expect(Math.max(...started) - Math.min(...started)).toBeLessThan(20);
  });

});

describe('runBootTasks failures', () => {
  it('fails a task that passes its timeout and aborts its signal', async () => {
    let aborted = false;
    const outcome = await runWith([
      task('stuck', {
        timeoutMs: 20,
        run: ({ signal }) => new Promise<void>(() => { signal.addEventListener('abort', () => { aborted = true; }); }),
      }),
    ]);
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

describe('runBootTasks progress', () => {
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

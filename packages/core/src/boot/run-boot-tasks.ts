/* @layer core @kind logic */
import type { BootOutcome, BootProgress, BootRunOptions, BootTask } from './boot-task.type';
import { BOOT_GRAPH_LABEL, BOOT_GRAPH_TASK, DEFAULT_BOOT_WEIGHT } from './boot.constants';
import { bootGraphProblem } from './boot-graph-problem';
import { runBootTask } from './run-boot-task';

const weightOf = (task: Pick<BootTask, 'weight'>): number => Math.max(0, task.weight ?? DEFAULT_BOOT_WEIGHT);

const clamp = (value: number): number => (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0);

const linkedStop = (signal: AbortSignal | undefined): AbortController => {
  const stop = new AbortController();
  if (signal?.aborted) stop.abort(signal.reason);
  else signal?.addEventListener('abort', () => stop.abort(signal.reason), { once: true });
  return stop;
};

const runBootTasks = <X extends object>(tasks: readonly BootTask<X>[], options: BootRunOptions<X>): Promise<BootOutcome> => {
  const problem = bootGraphProblem(tasks);
  if (problem) return Promise.resolve({ ok: false, failure: { task: BOOT_GRAPH_TASK, label: BOOT_GRAPH_LABEL, message: problem, timedOut: false } });

  const total = tasks.reduce((sum, task) => sum + weightOf(task), 0);
  const shares = new Map<string, number>();
  const started = new Set<string>();
  const finished = new Set<string>();
  const stop = linkedStop(options.signal);
  let current: Pick<BootProgress, 'label' | 'detail'> = { label: '', detail: null };

  const emit = (): void => {
    const done = tasks.reduce((sum, task) => sum + weightOf(task) * (shares.get(task.id) ?? 0), 0);
    options.onProgress?.({ done, total, ...current });
  };

  return new Promise<BootOutcome>((resolve) => {
    let settled = false;
    const settle = (outcome: BootOutcome): void => {
      if (settled) return;
      settled = true;
      if (!outcome.ok) stop.abort(new Error(outcome.failure.message));
      resolve(outcome);
    };

    const start = (task: BootTask<X>): void => {
      started.add(task.id);
      current = { label: task.label, detail: null };
      emit();
      const report = (fraction: number, detail: string | null): void => {
        if (settled) return;
        shares.set(task.id, Math.max(shares.get(task.id) ?? 0, clamp(fraction)));
        current = { label: task.label, detail };
        emit();
      };
      void runBootTask(task, { extras: options.extras, stop: stop.signal, report }).then((outcome) => {
        if (settled) return;
        if (!outcome.ok) return settle(outcome);
        shares.set(task.id, 1);
        finished.add(task.id);
        options.onTaskDone?.(task.id);
        emit();
        startReady();
      });
    };

    const startReady = (): void => {
      if (finished.size === tasks.length) return settle({ ok: true });
      for (const task of tasks) {
        if (!started.has(task.id) && (task.after ?? []).every((dep) => finished.has(dep))) start(task);
      }
    };

    emit();
    startReady();
  });
};

export { runBootTasks };

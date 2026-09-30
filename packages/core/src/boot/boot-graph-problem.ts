/* @layer core @kind logic */
import type { BootTask } from './boot-task.type';

const duplicateOf = (tasks: readonly Pick<BootTask, 'id' | 'after'>[]): string | null => {
  const seen = new Set<string>();
  for (const { id } of tasks) {
    if (seen.has(id)) return id;
    seen.add(id);
  }
  return null;
};

const cycleThrough = (tasks: readonly Pick<BootTask, 'id' | 'after'>[]): string | null => {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (id: string): string | null => {
    if (state.get(id) === 'done') return null;
    if (state.get(id) === 'visiting') return id;
    state.set(id, 'visiting');
    for (const dep of byId.get(id)?.after ?? []) {
      const found = visit(dep);
      if (found) return found;
    }
    state.set(id, 'done');
    return null;
  };
  for (const { id } of tasks) {
    const found = visit(id);
    if (found) return found;
  }
  return null;
};

const bootGraphProblem = (tasks: readonly Pick<BootTask, 'id' | 'after'>[]): string | null => {
  const duplicate = duplicateOf(tasks);
  if (duplicate) return `two boot tasks share the id "${duplicate}"`;
  const ids = new Set(tasks.map((task) => task.id));
  for (const task of tasks) {
    const missing = (task.after ?? []).find((dep) => !ids.has(dep));
    if (missing) return `boot task "${task.id}" runs after "${missing}", which is not a boot task`;
  }
  const cycle = cycleThrough(tasks);
  return cycle ? `boot task "${cycle}" waits on itself through its after list` : null;
};

export { bootGraphProblem };

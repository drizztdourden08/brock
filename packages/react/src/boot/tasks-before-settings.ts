/* @layer renderer-shell @kind logic */
import type { BootTask } from '@drizztdourden08/brock-core';
import { BUILT_IN_BOOT_TASKS, SETTINGS_TASK } from './boot.constants';

const waitsForSettings = (id: string, byId: ReadonlyMap<string, Pick<BootTask, 'after'>>, seen: Set<string>): boolean => {
  if (id === SETTINGS_TASK) return true;
  if (seen.has(id)) return false;
  seen.add(id);
  return (byId.get(id)?.after ?? []).some((dep) => waitsForSettings(dep, byId, seen));
};

const tasksBeforeSettings = (tasks: readonly Pick<BootTask, 'id' | 'after'>[]): string[] => {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  return tasks
    .filter((task) => !BUILT_IN_BOOT_TASKS.includes(task.id))
    .filter((task) => !waitsForSettings(task.id, byId, new Set()))
    .map((task) => task.id);
};

export { tasksBeforeSettings };

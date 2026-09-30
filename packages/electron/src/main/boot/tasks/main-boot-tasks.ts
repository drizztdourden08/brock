/* @layer electron-main @kind logic */
import type { BootstrapOptions } from '../../types/main-context.type';
import type { MainBootTask } from '../boot-state.type';
import { modulesTask } from './modules-task';
import { windowStateTask } from './window-state-task';

const afterModules = (task: MainBootTask): MainBootTask => {
  const after = task.after ?? [];
  return after.includes('modules') ? task : { ...task, after: ['modules', ...after] };
};

const mainBootTasks = (options: BootstrapOptions, openWindow: () => Promise<void>): MainBootTask[] => [
  modulesTask(options),
  windowStateTask(openWindow),
  ...(options.modules ?? []).flatMap((module) => module.bootTasks ?? []).map(afterModules),
  ...(options.bootTasks ?? []).map(afterModules),
];

export { mainBootTasks };

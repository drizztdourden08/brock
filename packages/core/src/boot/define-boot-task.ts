/* @layer core @kind logic */
import type { BootTaskDef } from './boot-task.type';

const defineBootTask = <X extends object = object>(def: BootTaskDef<X>): BootTaskDef<X> => def;

export { defineBootTask };

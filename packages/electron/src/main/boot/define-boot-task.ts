/* @layer electron-main @kind logic */
import { defineBootTask as defineCoreBootTask } from '@drizztdourden08/brock-core/boot';
import type { MainBootTaskDef } from './boot-state.type';

const defineBootTask = (def: MainBootTaskDef): MainBootTaskDef => defineCoreBootTask(def);

export { defineBootTask };

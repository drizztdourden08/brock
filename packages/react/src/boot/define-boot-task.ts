/* @layer renderer-shell @kind logic */
import { defineBootTask as defineCoreBootTask } from '@drizztdourden08/brock-core';
import type { RendererBootTaskDef } from './renderer-boot.type';

const defineBootTask = (def: RendererBootTaskDef): RendererBootTaskDef => defineCoreBootTask(def);

export { defineBootTask };

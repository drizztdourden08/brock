/* @layer renderer-shell @kind logic */
import type { RendererBootTask } from '@drizztdourden08/brock-react';
import { CONTROLLER_HOOKS_LABEL, CONTROLLER_HOOKS_TASK_ID } from './controller-hooks.constants';
import { registerControllerHooks } from './register-controller-hooks';
import type { ControllerHooksConfig } from './controller-hooks.type';

const createControllerHooksBootTask = (config: ControllerHooksConfig): RendererBootTask => ({
  id: CONTROLLER_HOOKS_TASK_ID,
  label: CONTROLLER_HOOKS_LABEL,
  weight: 1,
  run: () => registerControllerHooks(config),
});

export { createControllerHooksBootTask };

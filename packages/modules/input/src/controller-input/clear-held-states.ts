/* @layer renderer-shell @kind logic */
import type { ControllerInputState } from '../runtime/controller-input-store.type';
import type { ControllerStateHost } from '../runtime/process-controller-state.type';

const idleStateOf = (state: ControllerInputState): ControllerInputState => ({
  deviceKey: state.deviceKey,
  buttons: state.buttons.map(() => false),
  axes: state.axes.map(() => 0),
  timestamp: performance.now(),
});

const clearHeldStates = (host: ControllerStateHost): void => {
  const idle = [...host.states.values()].map(idleStateOf);
  for (const state of idle) {
    host.states.set(state.deviceKey, state);
    for (const cb of host.listeners) cb(state);
  }
};

export { clearHeldStates };

/* @layer renderer-shell @kind logic */
import type { ControllerAnalog } from '../ControllerLayout.type';
import { finite } from './finite';

const clampUnit = (value: number | undefined): number => Math.min(1, Math.max(0, finite(value)));

const amountOf = (state: ControllerAnalog | undefined): number => {
  if (!state) return 0;
  if (state.value !== undefined) return clampUnit(state.value);
  return state.pressed ? 1 : 0;
};

export { amountOf };

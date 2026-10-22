/* @layer core @kind logic */
import type { ControllerStateListener } from '../device.type';
import type { PadStateListener } from './controller-slot.type';
import { padStateOf } from './pad-state-of';

const padStateSubscription =
  (onState: (listener: ControllerStateListener) => () => void) =>
  (listener: PadStateListener): (() => void) =>
    onState((deviceKey, buttons, axes) => listener(deviceKey, padStateOf(buttons, axes)));

export { padStateSubscription };
